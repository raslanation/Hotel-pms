# Frontend Dashboard

Guest booking site + front desk dashboard for Green Garden Resort Hurghada. Vite + React, talking to the Backend Engine over REST.

## Setup

1. Make sure the backend is running first (see `../Backend/README.md`) — this app calls it directly.

2. Install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Copy `.env.example` to `.env` and point it at your backend if it's not on the default local port:
   ```
   cp .env.example .env
   ```

4. Start the dev server:
   ```
   npm run dev
   ```
   Opens at `http://localhost:5173`.

## What's here

- **Guest view** — search dates, browse open apartments, book, get a confirmation "keycard," look up a reservation by code.
- **Front Desk view** — staff log in (seeded via the backend's `npm run seed`), then get the reservation ledger, room management, date-based room closures, and a housekeeping log, each with a PDF export button.

## Building for production

```
npm run build
```
Outputs static files to `dist/` — upload that folder to any static host (Netlify, Vercel, S3, your own server, etc.). Since this build talks to a live backend API, make sure `VITE_API_URL` in your `.env` points at wherever you deploy the Backend before running `npm run build` — Vite bakes that value in at build time.
