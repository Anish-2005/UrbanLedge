# UrbanLedge

This workspace contains a prototype and SQL artifacts for the Online Property Tax Management System (OPTMS).

Quick start (frontend prototype - Next.js):

1. Install dependencies (run in PowerShell):

	npm install
	npm install tailwindcss postcss autoprefixer -D
	npx tailwindcss init -p
	npm install lucide-react framer-motion

2. Tailwind setup: add to your `tailwind.config.js` content paths (e.g., `./src/**/*.{js,ts,jsx,tsx}`) and import Tailwind in `src/app/globals.css`:

	@tailwind base;
	@tailwind components;
	@tailwind utilities;

3. Run the dev server:

	npm run dev

Database / schema
Ensure you have a Postgres DATABASE_URL in `.env.local` (example provided in repo). To apply the Postgres schema to your DB run:

```powershell
npm install
$env:DATABASE_URL = 'postgresql://postgres:password@host:5432/postgres'
npm run apply-schema
```

Firebase auth
To use Firebase sign-in provide the following env vars in `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

The prototype will attach the Firebase ID token as a Bearer token on mutating API requests. Server-side verification is a TODO and requires a Firebase service account / firebase-admin.

Firebase console note:
- In the Firebase Console for project `urbanledge-f926f`, go to Authentication → Sign-in method and enable "Google" as a sign-in provider. Without this the Google popup sign-in will fail.

SQL files:

- `sql/schema.sql` — create the database schema in MySQL.
- `sql/stored_procs.sql` — stored procedures, triggers and views.
- `sql/sample_data.sql` — sample data and example queries.

To import SQL into a local MySQL server (PowerShell):

	mysql -u root -p < .\\sql\\schema.sql
	mysql -u root -p < .\\sql\\stored_procs.sql
	mysql -u root -p < .\\sql\\sample_data.sql

Notes:
- The prototype page at `src/app/prototype/page.tsx` is a static demo UI using Tailwind, `lucide-react` and `framer-motion`.
- For a full-stack scaffold (API routes, DB connector), I can add an Express or Next.js API and example endpoints next.

If you'd like, I can scaffold full authentication, API routes and connect to MySQL next.
# UrbanLedge