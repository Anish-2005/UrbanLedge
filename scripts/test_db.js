const { Pool } = require('pg')
require('dotenv').config()

const conn = process.env.DATABASE_URL
if (!conn) {
  console.error('Please set DATABASE_URL environment variable (see .env.local)')
  process.exit(1)
}

(async function(){
  const pool = new Pool({ connectionString: conn })
  const client = await pool.connect()
  try {
    const res = await client.query('SELECT now() AS now, version() AS pg_version')
    console.log('Connection OK:', res.rows[0])
  } catch (err) {
    console.error('Connection failed:', err)
    process.exitCode = 1
  } finally {
    client.release(); await pool.end()
  }
})()
