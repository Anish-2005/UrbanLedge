const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

const sqlPath = path.resolve(process.cwd(), 'sql', 'sample_data.sql')
if (!fs.existsSync(sqlPath)) {
  console.error('sample_data.sql not found at', sqlPath)
  process.exit(1)
}

const sql = fs.readFileSync(sqlPath, 'utf8')
const conn = process.env.DATABASE_URL
if (!conn) {
  console.error('Please set DATABASE_URL environment variable (see .env.local)')
  process.exit(1)
}

(async function run(){
  const pool = new Pool({ connectionString: conn, ssl: { rejectUnauthorized: false } })
  const client = await pool.connect()
  try {
    console.log('Applying sample data...')
    // split on semicolon newline as in apply_schema.js
    const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)
    for (const st of statements) {
      try {
        await client.query(st)
      } catch (err) {
        console.error('Statement failed:', st.slice(0,120))
        console.error(err.message)
      }
    }
    console.log('Sample data applied (best-effort)')
  } catch (err) {
    console.error('Sample data apply failed:', err)
    process.exit(1)
  } finally {
    client.release(); await pool.end()
  }
})()
