const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })

const sqlPath = path.resolve(process.cwd(), 'sql', 'schema_postgres.sql')
if (!fs.existsSync(sqlPath)) {
  console.error('schema_postgres.sql not found at', sqlPath)
  process.exit(1)
}

const sql = fs.readFileSync(sqlPath, 'utf8')
const conn = process.env.DATABASE_URL
if (!conn) {
  console.error('Please set DATABASE_URL environment variable (see .env.local)')
  process.exit(1)
}

;(async function run(){
  const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false } })
  const client = await pool.connect()
  try {
    console.log('Applying schema...')
    await client.query('BEGIN')
    const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)
    for (const st of statements) {
      await client.query(st)
    }
    await client.query('COMMIT')
    console.log('Schema applied successfully')
  } catch (err) {
    console.error('Schema apply failed:', err)
    try { await client.query('ROLLBACK') } catch (e) {}
    process.exit(1)
  } finally {
    client.release(); await pool.end()
  }
})()
