# Backend Engine

REST API for Green Garden Resort Hurghada's PMS — reservations, front desk, room availability, and housekeeping. Node.js + Express + Sequelize + MySQL.

## Setup

1. Install dependencies:
   ```
   cd Backend
   npm install
   ```

2. Create a MySQL database:
   ```sql
   CREATE DATABASE hotelsys;
   ```

3. Copy `.env.example` to `.env` and fill in your MySQL credentials and a real `JWT_SECRET`:
   ```
   cp .env.example .env
   ```

4. Create the tables and seed the 8 default rooms + an admin login:
   ```
   npm run seed
   ```
   This creates an admin user using `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` from your `.env` (defaults to `admin` / `ChangeMe123!`). **Change this password after your first login.**

5. Start the server:
   ```
   npm run dev
   ```
   API is now live at `http://localhost:4000/api`.

## API overview

**Public (no auth required)**
- `GET /api/rooms` — all rooms
- `GET /api/rooms/available?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=2` — rooms free for a date range
- `POST /api/bookings` — create a reservation
- `GET /api/bookings/lookup?code=GGR-XXX-0000` — guest looks up their reservation
- `POST /api/auth/login` — staff login, returns a JWT

**Staff (send `Authorization: Bearer <token>`)**
- `GET /api/bookings` — full reservation ledger
- `PATCH /api/bookings/:id/status` — check in / check out / cancel
- `PATCH /api/rooms/:id` — update price / active status
- `POST /api/rooms` — add a room
- `GET /api/closures`, `POST /api/closures`, `DELETE /api/closures/:id` — block/unblock room dates
- `GET /api/housekeeping`, `POST /api/housekeeping`, `DELETE /api/housekeeping/:id` — cleaning log
- `GET /api/stats` — dashboard numbers (occupancy, arrivals, revenue)

## Notes

- `sequelize.sync()` creates tables automatically on first run. For schema changes on a database that already has data, switch to Sequelize migrations rather than relying on `sync()`.
- Currently there's one role tier enforced (`requireAuth` — any logged-in staff account can access every staff endpoint). The `role` field on `User` is there for when you want to split admin vs. staff permissions later.
