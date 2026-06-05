import fs from "fs/promises";
import path from "path";
import { config } from "./config";
import { DownloadError } from "./errors";
import { mimeToExtension } from "./types";

export async function downloadMedia(
  mediaUrl: string,
  mediaContentType: string,
  messageSid: string
): Promise<string> {
  const accountSid = config.twilio.accountSid;
  const authToken = config.twilio.authToken;
  const authString = Buffer.from(`${accountSid}:${authToken}`).toString(
    "base64"
  );

  const extension = mimeToExtension(mediaContentType);
  const filename = `${messageSid}${extension}`;
  const filepath = path.join(config.tempDir, filename);

  await ensureTempDir();

  const response = await fetch(mediaUrl, {
    headers: {
      Authorization: `Basic ${authString}`,
    },
  });

  if (!response.ok) {
    throw new DownloadError(
      `Failed to download media: HTTP ${response.status} ${response.statusText}`
    );
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength) {
    const sizeMb = parseInt(contentLength, 10) / (1024 * 1024);
    if (sizeMb > config.maxFileSizeMb) {
      throw new DownloadError(
        `File too large (${sizeMb.toFixed(1)}MB). Maximum size is ${config.maxFileSizeMb}MB.`
      );
    }
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  return filepath;
}

async function ensureTempDir(): Promise<void> {
  await fs.mkdir(config.tempDir, { recursive: true });
}
