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
