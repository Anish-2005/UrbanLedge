# UrbanLedge

<p align="center">
  <img src="./public/urbanledge.png" alt="UrbanLedge logo" width="120" />
</p>

<p align="center">
  Property tax management platform for assessments, payments, and municipal administration.
</p>

<p align="center">
  <a href="https://urbanledge.vercel.app"><strong>Live App</strong></a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-pg-336791?style=flat-square&logo=postgresql" />
  <img alt="Firebase Auth" src="https://img.shields.io/badge/Auth-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## Why UrbanLedge

UrbanLedge is built for municipal tax operations with a practical workflow:

- Property registry and ward mapping
- Tax assessment generation and tracking
- Payment processing and receipts
- Admin controls for tax slabs, exemptions, users, and activity logs
- Clean dashboards for operational visibility

---

## Feature Map

| Module | What it does |
| --- | --- |
| Dashboard | Revenue, dues, wards, and activity summaries |
| Properties | Create/update property records with land/built area data |
| Assessments | Generate tax assessments and track due/paid status |
| Payments | Record payments and generate receipts |
| Admin | Manage tax slabs, exemptions, wards, users, and system activity |

---

## Architecture

```mermaid
flowchart LR
  UI[Next.js App Router UI] --> API[Next.js API Routes]
  API --> DB[(PostgreSQL)]
  UI --> AUTH[Firebase Auth]
  API --> LOG[Activity Logging]
```

---

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL (`pg`) |
| Authentication | Firebase Google Sign-in |
| Deployment | Vercel |

---

## Getting Started

### 1) Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database (local, Neon, Supabase, etc.)
- Firebase project (for Google sign-in)

### 2) Install

```bash
npm install
```

### 3) Configure environment

Create `.env.local` in project root.

```bash
# App URL (used for metadata/canonical/sitemap)
NEXT_PUBLIC_SITE_URL="https://urbanledge.vercel.app"

# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Optional Supabase client vars
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# Firebase (client-side auth)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""
```

### 4) Apply schema

```bash
npm run apply-schema
```

### 5) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm run dev:turbo` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run apply-schema` | Apply PostgreSQL schema from `sql/schema_postgres.sql` |

---

## Database Notes

- SQL files are in `/sql`.
- PostgreSQL is the default runtime target.
- Additional schema/sample variants are available for MySQL and Oracle in the same folder.
- Supabase setup details are in [README_DB.md](./README_DB.md).

---

## API Surface (high-level)

The app includes route handlers under `src/app/api/*` for:

- `properties`
- `assessments`
- `payments`
- `tax-slabs`
- `exemptions`
- `users`
- `wards`
- `reports`
- `activities`
- `db/status`

---

## SEO and Metadata

UrbanLedge includes:

- Canonical and Open Graph metadata per route group
- Dynamic `robots.txt` and `sitemap.xml` routes
- Structured data (`SoftwareApplication`) in root layout

Set `NEXT_PUBLIC_SITE_URL` in production to ensure canonical URLs are correct.

---

## Project Structure

```text
src/
  app/
    admin/
    assessments/
    payments/
    properties/
    api/
    layout.tsx
    page.tsx
  components/
  contexts/
  lib/
scripts/
sql/
public/
```

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
