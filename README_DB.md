Database and deployment instructions (Postgres / Render)

This repository can run against Postgres. Follow these steps to connect your local app and Render deployment to the Render Postgres instance you provided.

Provided connection string example:

postgresql://root:8ShbzrgaggeDBuRMgwClxKhBLgwYWWtJ@dpg-d3rv9pbuibrs739i6mj0-a/urbanledge

1) Set DATABASE_URL locally (PowerShell)
Create or update `.env.local` in the project root and add:

```powershell
# .env.local (project root)
DATABASE_URL="postgresql://root:8ShbzrgaggeDBuRMgwClxKhBLgwYWWtJ@dpg-d3rv9pbuibrs739i6mj0-a/urbanledge"
```

Or set it in your current PowerShell session (temporary):

```powershell
$env:DATABASE_URL = 'postgresql://root:8ShbzrgaggeDBuRMgwClxKhBLgwYWWtJ@dpg-d3rv9pbuibrs739i6mj0-a/urbanledge'
```

2) Test the connection (quick)
I added `scripts/test_db.js` to validate the connection using the existing `pg` dependency.

Run it from the project root:

```powershell
node .\scripts\test_db.js
```

Expected output: current timestamp and Postgres version in JSON form. If it errors, check `DATABASE_URL` and networking from your machine to the Render DB.

3) Apply Postgres schema
The repository includes `sql/schema_postgres.sql`. The project has a helper that applies it using `scripts/apply_schema.js` and the `DATABASE_URL` env var.

Run:

```powershell
npm run apply-schema
```

This script splits the SQL file into statements and runs them using the `pg` client. If you prefer `psql`, you can run:

```powershell
# requires psql in PATH
psql "$env:DATABASE_URL" -f .\sql\schema_postgres.sql
```

4) (Optional) Load sample data
The repository contains `sql/sample_data.sql`. Load it with `psql` or adapt the contents if you want to avoid overwriting production data.

```powershell
psql "$env:DATABASE_URL" -f .\sql\sample_data.sql
```

5) Keep all data on Render
- In Render's dashboard, add or edit the environment variable `DATABASE_URL` for your Web Service to the same connection string so both local and deployed apps use the same DB.
- Render will persist the data; your app will read and write to that instance.

6) App wiring notes
- The project already uses `src/lib/db.ts` which reads `process.env.DATABASE_URL` and uses the `pg` client. No code change is required for basic DB connectivity.
- If you created `src/lib/mysqlClient.ts` earlier, ignore it while using Postgres.

7) Verify from the app
- Start the app locally and exercise the UI that creates owners/properties/assessments. Data will be stored in the Render Postgres instance.

8) Troubleshooting
- If `scripts/test_db.js` fails with network errors, confirm your IP is allowed by Render (some managed DBs restrict connections). Use Render's private networking or a bastion if needed.
- If `npm run apply-schema` errors, run the statements directly in psql to see more detailed Postgres errors.

Want me to do any of the following for you?
- Run `scripts/test_db.js` here (I can execute commands in a terminal if you want me to run them now).
- Apply the schema automatically to your Render Postgres (you need to confirm you want me to run commands against that URL here).
- Convert any MySQL-specific stored-proc/trigger SQL into Postgres equivalents and add them to `sql/stored_procs_postgres.sql`.

If you want me to run the quick test now, confirm and I will run `node .\scripts\test_db.js` in a terminal using the connection string you provided.

