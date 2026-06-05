import { execFile } from "child_process";
import path from "path";
import { config } from "./config";
import { ConversionError } from "./errors";

const CONVERSION_TIMEOUT_MS = 30_000;

export function convertToPdf(inputPath: string): Promise<string> {
  const outputDir = config.tempDir;
  const outputFilename = `${path.basename(inputPath, path.extname(inputPath))}.pdf`;
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    const child = execFile(
      config.libreOfficePath,
      [
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        outputDir,
        inputPath,
      ],
      { timeout: CONVERSION_TIMEOUT_MS },
      (error, stdout, stderr) => {
        if (error) {
          const message =
            stderr?.trim() || error.message || "Unknown conversion error";
          reject(new ConversionError(`LibreOffice failed: ${message}`));
          return;
        }
        resolve(outputPath);
      }
    );

    child.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(
          new ConversionError(
            `LibreOffice not found at "${config.libreOfficePath}". Is it installed?`
          )
        );
      } else {
        reject(new ConversionError(`Failed to start LibreOffice: ${err.message}`));
      }
    });
  });
}
