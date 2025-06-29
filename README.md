# Influencer Discovery Tool

This repository contains a basic prototype for searching YouTube channels. It consists of:

- **backend**: Node.js + Express server that queries the YouTube Data API.
- **frontend**: Next.js React app that interacts with the backend.

## Running Locally

1. In `backend` copy `.env.example` to `.env` and set `YT_API_KEY`.
2. Install dependencies and start the server:

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:3001`.

3. In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available on `http://localhost:3000`.

## Tests

Both the backend and frontend have placeholder test scripts so `npm test` will run without failing:

```bash
cd backend && npm test
cd ../frontend && npm test
```
