export interface IncomingMessage {
  messageSid: string;
  from: string;
  to: string;
  body: string;
  mediaUrl?: string;
  mediaContentType?: string;
  numMedia: number;
}

export interface ConversionResult {
  inputPath: string;
  outputPath: string;
  originalName: string;
}

export const SUPPORTED_MIME_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "text/plain",
  "text/html",
  "text/csv",
  "image/jpeg",
  "image/png",
  "image/bmp",
  "image/gif",
  "image/webp",
  "application/rtf",
];

const EXTENSION_MAP: Record<string, string> = {
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".pptx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.oasis.opendocument.text": ".odt",
  "application/vnd.oasis.opendocument.spreadsheet": ".ods",
  "application/vnd.oasis.opendocument.presentation": ".odp",
  "text/plain": ".txt",
  "text/html": ".html",
  "text/csv": ".csv",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/bmp": ".bmp",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/rtf": ".rtf",
};

export function mimeToExtension(mimeType: string): string {
  return EXTENSION_MAP[mimeType] || ".bin";
}
