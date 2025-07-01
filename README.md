# Email Service

This microservice wraps Mailmodo APIs to send emails for other services. It exposes REST endpoints for campaigns, templates and contact lists.

## Requirements
- Node.js 18+
- Mailmodo API key

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and provide your environment values.
3. Build the TypeScript project:
   ```bash
   npm run build
   ```
4. Start the server:
   ```bash
   npm start
   ```
   Development mode with automatic reload:
   ```bash
   npm run dev
   ```

## Testing
Run all Jest tests with:
```bash
npm test
```

## Docker
A multi-stage `Dockerfile` is provided. Build and run the container:
```bash
docker build -t email-service .
docker run -p 8008:8008 --env-file .env email-service
```
