export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class DownloadError extends AppError {
  constructor(message: string) {
    super(message, "DOWNLOAD_FAILED", 502);
    this.name = "DownloadError";
  }
}

export class ConversionError extends AppError {
  constructor(message: string) {
    super(message, "CONVERSION_FAILED", 500);
    this.name = "ConversionError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_FAILED", 400);
    this.name = "ValidationError";
  }
}
