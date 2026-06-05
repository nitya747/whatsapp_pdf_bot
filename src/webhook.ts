import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { validateRequest } from "twilio";
import { config } from "./config";
import { downloadMedia } from "./downloader";
import { convertToPdf } from "./converter";
import { sendPdf, sendText } from "./sender";
import { SUPPORTED_MIME_TYPES } from "./types";
import { AppError } from "./errors";

const USAGE_TEXT =
  "Hi! Send me any document, spreadsheet, presentation, or image and I'll convert it to PDF and send it back.";

export function validateWebhook(req: Request): boolean {
  const signature = req.headers["x-twilio-signature"] as string | undefined;
  if (!signature) return false;

  const valid = validateRequest(
    config.twilio.authToken,
    signature,
    buildWebhookUrl(req),
    req.body || {}
  );

  if (!valid) {
    console.log("=== Webhook signature mismatch ===");
    console.log("URL used:", buildWebhookUrl(req));
    console.log("Host header:", req.get("host"));
    console.log("X-Forwarded-Host:", req.get("x-forwarded-host"));
    console.log("X-Forwarded-Proto:", req.get("x-forwarded-proto"));
    console.log("Original URL:", req.originalUrl);
    console.log("Received sig:", signature);
    console.log("Body keys:", Object.keys(req.body || {}).join(", "));
  }
  return valid;
}

function buildWebhookUrl(req: Request): string {
  const host = req.get("host");
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  return `${proto}://${host}${req.originalUrl}`;
}

export async function handleIncoming(req: Request, res: Response): Promise<void> {
  const body = req.body;
  const from = body.From;
  const messageSid = body.MessageSid;
  const numMedia = parseInt(body.NumMedia || "0", 10);

  // Twilio expects a quick response — acknowledge immediately
  res.status(200).type("text/xml").send("<Response></Response>");

  try {
    if (numMedia > 0) {
      const mediaUrl = body.MediaUrl0;
      const mediaContentType = body.MediaContentType0;

      if (!mediaUrl || !mediaContentType) {
        await sendText(from, "I couldn't find the file in your message. Please try again.");
        return;
      }

      if (!SUPPORTED_MIME_TYPES.includes(mediaContentType)) {
        await sendText(
          from,
          `Sorry, I can't convert "${mediaContentType}" files. I support documents, spreadsheets, presentations, and images.`
        );
        return;
      }

      await processFile(from, messageSid, mediaUrl, mediaContentType);
    } else {
      await sendText(from, USAGE_TEXT);
    }
  } catch (err) {
    console.error("Processing Error:", err);
    const message =
      err instanceof AppError
        ? `Error: ${err.message}`
        : "Something went wrong during conversion. Please try again.";
    try {
      await sendText(from, message);
    } catch (sendErr) {
      console.error("Failed to send error notification:", sendErr);
      // Best-effort error notification
    }
  }
}

async function processFile(
  to: string,
  messageSid: string,
  mediaUrl: string,
  mediaContentType: string
): Promise<void> {
  const inputPath = await downloadMedia(mediaUrl, mediaContentType, messageSid);
  const outputPath = await convertToPdf(inputPath);

  // Move output to a served directory so it can be publicly accessed
  const servedName = `${messageSid}.pdf`;
  const servedPath = path.join(config.tempDir, "served", servedName);
  await fs.mkdir(path.dirname(servedPath), { recursive: true });
  await fs.rename(outputPath, servedPath);

  // Clean up input
  fs.unlink(inputPath).catch(() => {});

  // Construct public URL — the server exposes /files/:filename
  const publicUrl = `${process.env.PUBLIC_URL || process.env.BASE_URL || `http://localhost:${config.port}`}/files/${servedName}`;
  await sendPdf(to, publicUrl);

  // Schedule cleanup after delivery
  setTimeout(() => {
    fs.unlink(servedPath).catch(() => {});
  }, 300_000); // 5 minutes
}
