import dotenv from "dotenv";
import path from "path";

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value || value.startsWith("your_")) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  twilio: {
    accountSid: required("TWILIO_ACCOUNT_SID"),
    authToken: required("TWILIO_AUTH_TOKEN"),
    phoneNumber: required("TWILIO_PHONE_NUMBER"),
  },
  libreOfficePath: process.env.LIBREOFFICE_PATH || "libreoffice",
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || "15", 10),
  tempDir: path.resolve(process.env.TEMP_DIR || "./tmp"),
};
