# Hotel Tamarind Tree — Website

Production-grade website for **Hotel Tamarind Tree**, Tissamaharama, Sri Lanka.
A 4-star boutique hotel with Deluxe and Family rooms, located at the gateway to Yala National Park.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Neon |
| ORM | Prisma |
| Auth | Auth.js (NextAuth v5) |
| Payments | Stripe (Phase 4) |
| Images | Cloudinary (Phase 2+) |
| Hosting | Vercel + Neon |

---

## Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd hotel-tamarind-tree
pnpm install
```

### 2. Environment Variables
```bash
cp .env.example .env.local
# Fill in your Neon DATABASE_URL and AUTH_SECRET
```

Generate AUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Database Setup
```bash
# Push schema to Neon
pnpm db:migrate

# Seed with rooms, rates, and admin user
pnpm db:seed
```
> ⚠️ **Save the admin password** printed during seed — it won't be shown again.

### 4. Run Dev Server
```bash
pnpm dev
# → http://localhost:3000
```

---

## Project Structure

```
app/
  (marketing)/          → Public pages (Home, Rooms, Gallery, etc.)
  (booking)/            → Booking flow (Phase 3)
  admin/                → Protected admin dashboard (Phase 5+)
  api/                  → API routes
components/
  marketing/            → Header, Footer, public components
  booking/              → Booking flow components (Phase 3)
  admin/                → Admin UI components (Phase 5+)
  ui/                   → Shared shadcn/ui components
lib/
  auth.ts               → Auth.js configuration
  db.ts                 → Prisma singleton
  utils.ts              → Shared helpers
  constants.ts          → App-wide constants
prisma/
  schema.prisma         → Full database schema
  seed.ts               → Seed: 20 rooms, rate plans, admin user
```

---

## Build Phases

- [x] **Phase 1** — Foundation: scaffold, schema, design system, app shell, git
- [ ] **Phase 2** — Marketing pages: static/ISR pages with real content and Cloudinary images
- [ ] **Phase 3** — Booking engine: availability search → room select → guest details (no payment yet)
- [ ] **Phase 4** — Payments: Stripe integration + confirmation emails
- [ ] **Phase 5** — Admin auth + dashboard shell
- [ ] **Phase 6** — Admin core: reservations, calendar view, manual bookings
- [ ] **Phase 7** — Admin management: rooms, rates, guests, reports
- [ ] **Phase 8** — Hardening: tests, accessibility pass, performance pass

---

## Room Types & Rates

| Room | Beds | BB | HB |
|---|---|---|---|
| Deluxe Twin | 2 single | $50/night | $60/night |
| Deluxe Double | 1 double | $50/night | $60/night |
| Deluxe Triple | 3 single | $70/night | $90/night |
| Family | 4 beds | $100/night | $130/night |

20 rooms total: 101–106 (Twin), 107–112 (Double), 113–116 (Triple), 201–204 (Family)

---

## Admin Access

After running `pnpm db:seed`, use the credentials printed to the console to log in at `/admin/login`.

---

## Environment Variables

See `.env.example` for all required variables. Required for Phase 1:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev
