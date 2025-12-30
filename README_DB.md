Database and deployment instructions (Supabase)

This repository can run against Supabase (PostgreSQL). Follow these steps to connect your local app and deployment to your Supabase instance.

1) Set up Supabase
- Create a new project at https://supabase.com
- Go to Settings > API in your Supabase dashboard
- Copy the Project URL and anon/public key

2) Set environment variables locally
Create or update `.env.local` in the project root and add:

```bash
# .env.local (project root)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

You can find these values in your Supabase dashboard under Settings > API.

3) Test the connection (quick)
I added `scripts/test_db.js` to validate the connection using the existing `pg` dependency.

Run it from the project root:

```bash
node .\scripts\test_db.js
```

Expected output: current timestamp and Postgres version in JSON form. If it errors, check your Supabase URL and service role key.

4) Apply Postgres schema to Supabase
The repository includes `sql/schema_postgres.sql`. The project has a helper that applies it using `scripts/apply_schema.js`.

First, update the DATABASE_URL in your environment to use the Supabase connection string. You can find the connection string in Supabase dashboard under Settings > Database.

```bash
# Set DATABASE_URL to your Supabase connection string
DATABASE_URL="postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres"
```

Then run:

```bash
npm run apply-schema
```

This script splits the SQL file into statements and runs them using the `pg` client.

5) (Optional) Load sample data
The repository contains `sql/sample_data.sql`. Load it with `psql` or adapt the contents.

```bash
psql "$DATABASE_URL" -f .\sql\sample_data.sql
```

6) App wiring notes
- The project uses `src/lib/db.ts` which reads `DATABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` and uses the `pg` client.
- The `src/lib/supabaseClient.ts` is configured for client-side operations.
- No code changes are required for basic DB connectivity.

7) Verify from the app
- Start the app locally and exercise the UI that creates owners/properties/assessments. Data will be stored in your Supabase instance.

8) Troubleshooting
- If connection fails, ensure your Supabase project is active and the service role key has the correct permissions.
- Check Supabase dashboard for any connection issues or firewall settings.
- If `npm run apply-schema` errors, run the statements directly in the Supabase SQL editor or psql to see detailed errors.
The repository contains `sql/sample_data.sql`. Load it with `psql` or adapt the contents if you want to avoid overwriting production data.

```bash
psql "$DATABASE_URL" -f .\sql\sample_data.sql
```

5) Keep all data on Supabase
- Your data will persist in Supabase; your app will read and write to that instance.
- For production deployment, set the same environment variables in your hosting platform.

6) App wiring notes
- The project already uses `src/lib/db.ts` which reads `DATABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` and uses the `pg` client. No code change is required for basic DB connectivity.
- The `src/lib/supabaseClient.ts` is configured for client-side Supabase operations.

7) Verify from the app
- Start the app locally and exercise the UI that creates owners/properties/assessments. Data will be stored in your Supabase instance.

8) Troubleshooting
- If `scripts/test_db.js` fails with network errors, check your Supabase project settings and ensure the database is accessible.
- If `npm run apply-schema` errors, run the statements directly in the Supabase SQL editor to see more detailed Postgres errors.
- Ensure your service role key has the necessary permissions for schema creation and data manipulation.

