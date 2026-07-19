# Hotelsys — Green Garden Resort Hurghada PMS

A small property management system: guest-facing booking site plus a front-desk dashboard, backed by a real database so every staff member and guest sees the same live data.

## Structure

```
Hotelsys-main/
├── Backend/     Node.js + Express + MySQL REST API
└── frontend/    Vite + React app (guest site + admin dashboard)
```

## Quick start

```bash
# 1. Backend
cd Backend
npm install
cp .env.example .env      # fill in your MySQL credentials + a JWT_SECRET
npm run seed               # creates tables, 8 default rooms, and an admin login
npm run dev                 # http://localhost:4000

# 2. Frontend (in a separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

Log in to the Front Desk tab with the admin credentials from your `.env` (`SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`, defaults `admin` / `ChangeMe123!`) — **change that password after your first login.**

## Deploying via GitHub

This repo includes `.github/workflows/deploy-frontend.yml`, which auto-builds and deploys the **frontend** to GitHub Pages on every push to `main`. The **backend** (needs a running server + MySQL, which Pages can't do) goes to Railway, connected to the same repo so it also redeploys on push.

**1. Push this repo to GitHub**, if you haven't already:
```bash
git init && git add -A && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main && git push -u origin main
```

**2. Backend on Railway** (railway.app, connects directly to GitHub):
- New Project → Deploy from GitHub repo → select this repo
- In the service settings, set **Root Directory** to `Backend`
- Add a MySQL database: "+ New" → Database → MySQL (Railway gives you connection env vars automatically)
- In the backend service's **Variables** tab, add: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (map these from the MySQL service's variables — Railway lets you reference them), plus `JWT_SECRET` (generate a long random string), `CORS_ORIGIN` (your Pages URL, added after step 3), `SEED_ADMIN_USERNAME`, `SEED_ADMIN_PASSWORD`
- Deploy, then open the service's **Shell** (or use the Railway CLI) and run `npm run seed` once
- Railway gives you a public URL like `https://hotelsys-backend-production.up.railway.app` — that's your API base

**3. Frontend on GitHub Pages:**
- Repo → **Settings → Pages** → Source: **GitHub Actions**
- Repo → **Settings → Secrets and variables → Actions** → New repository secret: `VITE_API_URL` = `https://your-railway-url.up.railway.app/api`
- Push anything to `main` (or re-run the workflow from the **Actions** tab) — it builds and deploys automatically
- Your site is live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

**4. Close the loop:** go back to Railway and set `CORS_ORIGIN` to that Pages URL so the browser is allowed to call the API.

**Custom domain:** if you want this at your own domain instead of `github.io`, add a `CNAME` file to `frontend/public/` with your domain, point a DNS `CNAME` record at `YOUR_USERNAME.github.io`, and set it in Settings → Pages → Custom domain.

## What's implemented

- Guest booking flow: search by dates/party size, live availability (checked against real bookings and room closures), reservation form, confirmation code lookup
- Front desk: reservation ledger (check in / check out / cancel), room management (rate + active toggle), date-based room closures, housekeeping log — each with a PDF export
- Staff login with JWT-protected admin routes

## What's next

This covers the "core reservations + front desk" priority. Natural next additions, in roughly the order they tend to matter for a small property:

1. **Guest CRM** — track repeat guests across stays instead of treating each booking as a fresh contact
2. **Billing & invoicing** — itemized folios, payments, receipts
3. **Reports & analytics** — occupancy trends, revenue by room type, over a date range
4. **Role-based permissions** — the `role` field already exists on `User`; routes just need to start checking it
5. **Channel manager integration** (Booking.com, Airbnb) — syncing availability/rates outward is a much bigger project involving each platform's API

Let me know which of these you want built next.
