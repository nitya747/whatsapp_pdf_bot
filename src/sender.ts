import twilio from "twilio";
import path from "path";
import { config } from "./config";

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

export async function sendPdf(
  to: string,
  pdfUrl: string
): Promise<void> {
  await client.messages.create({
    from: config.twilio.phoneNumber,
    to,
    body: "Here's your converted PDF!",
    mediaUrl: [pdfUrl],
  });
}

export async function sendText(to: string, body: string): Promise<void> {
  await client.messages.create({
    from: config.twilio.phoneNumber,
    to,
    body,
  });
}
