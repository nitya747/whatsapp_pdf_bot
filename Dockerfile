FROM node:20-bookworm-slim

# Install LibreOffice (required for document to PDF conversion)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libreoffice \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project files
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Create a tmp directory for file processing
RUN mkdir -p tmp/served

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
