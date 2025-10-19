const { Client } = require('pg');
// dotenv doesn't load .env.local by default in Node scripts, so load it explicitly
require('dotenv').config({ path: '.env.local' });

async function check() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set in environment');
    process.exit(2);
  }

  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as ok');
    console.log('connected, query result:', res.rows[0]);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('connection failed:', err.message);
    if (err.code) console.error('pg error code:', err.code);
    if (err.cause && err.cause.code) console.error('cause code:', err.cause.code);
    process.exit(1);
  }
}

check();
