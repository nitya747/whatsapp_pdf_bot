import express from "express";
import path from "path";
import { config } from "./config";
import { validateWebhook, handleIncoming } from "./webhook";

const app = express();

app.use(
  express.urlencoded({
    extended: false,
    verify: (req: any, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

// Serve converted PDFs so Twilio can fetch them
app.use("/files", express.static(path.join(config.tempDir, "served")));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// WhatsApp webhook
app.post("/webhook", async (req, res) => {
  if (!validateWebhook(req)) {
    res.status(403).send("Invalid Twilio signature");
    return;
  }
  await handleIncoming(req, res);
});

const server = app.listen(config.port, () => {
  console.log(`WhatsApp PDF Bot listening on port ${config.port}`);
});

function shutdown() {
  console.log("\nShutting down...");
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
