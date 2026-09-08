# Homewood on a Budget

A Next.js guide to cheap eats, student discounts, and late-night spots near the Johns Hopkins **Homewood** campus — Charles Village, Remington, Waverly, and nearby Hampden. Not East Baltimore. No JHED login.

Browse without an account. Seeded neighborhood data renders on the home page out of the box.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Optional [Supabase](https://supabase.com) for the spots table
- Deployed on [Vercel](https://vercel.com)

## Local setup

```bash
npm install
cp .env.example .env.local   # optional — leave blank to use seed data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm run start    # serve the production build
```

## Environment variables

None are required for the demo.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon / publishable key |

If both are set, the app reads `public.spots` (public `SELECT` only). If they are missing, or the table is empty, it falls back to `src/data/spots.ts`.

Do not commit secrets. `.env*` is gitignored except `.env.example`.

## Supabase (optional, later)

1. Create a project and copy the URL + anon key into Vercel env vars and `.env.local`.
2. Run `supabase/schema.sql` in the SQL editor. It creates `spots`, enables RLS, allows public reads, and upserts the seed rows.
3. Redeploy. The home page should load from Supabase.

No service-role key belongs in this repo or in `NEXT_PUBLIC_*` variables.

## What’s in the MVP

- Home search + filters: Cheap Eats, Student Discounts, Late Night, Coffee / Study snacks
- Spot cards: tags, `$`–`$$$`, tip, walk time from Homewood, hours note, address / neighborhood
- Detail pages with maps links and related spots
- 18 real Homewood-area places (Chipotle, honeygrow, Tamber’s, One World Cafe, Bird in Hand, Nori in Hampden, R. House, and others)

Hours are approximate. Confirm before you walk.

## Vercel auto-deploy from `main`

Connect the GitHub repo to a Vercel project (Import Git Repository). Vercel detects Next.js.

- Every push to `main` builds and deploys production
- Pull requests get preview deployments
- Add optional Supabase env vars in the Vercel project: **Settings → Environment Variables**

No extra deploy command is required. Do not put secrets in the repository.

## Project layout

```
src/app/                 App Router pages
src/components/          Header, cards, search/filters
src/data/spots.ts        Seeded spots (source of truth for the demo)
src/lib/spots.ts         Supabase-or-seed data access
supabase/schema.sql      Table, RLS, and seed upserts
```
