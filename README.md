# WhatsApp PDF Bot

A Node.js/TypeScript WhatsApp bot that automatically converts received document files (like Word documents, images, text, etc.) to PDF format using LibreOffice, and sends them back to the user via Twilio.

## Features

- Receives files (e.g., DOCX, TXT, images) sent via WhatsApp.
- Automatically downloads and processes them.
- Converts files to PDF using a headless LibreOffice installation.
- Sends the converted PDF back to the user via Twilio WhatsApp API.
- Comprehensive error handling and logging.

## Prerequisites

- Node.js (v18 or higher recommended)
- LibreOffice (installed and accessible in the system path or configured in env)
- Twilio Account (with WhatsApp Sandbox or a Sandbox number configured)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/nitya747/whatsapp_pdf_bot.git
   cd whatsapp_pdf_bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```

4. Make sure LibreOffice is installed on your system.

## Running the Application

### Development Mode

Run the application with auto-reloading:
```bash
npm run dev
```

### Production Mode

Build the TypeScript files:
```bash
npm run build
```

Start the built application:
```bash
npm start
```

## License

MIT
