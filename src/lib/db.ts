'use server'

import { Pool } from 'pg'

// Lazily initialize pool so module import doesn't throw when DATABASE_URL is missing.
let pool: Pool | null = null

function getPool() {
  if (pool) return pool
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL not set')
  }
  // Support TLS connections for hosts like Render Postgres. Use PG_SSL_REJECT_UNAUTHORIZED to control strict cert validation.
  const rejectUnauthorized = process.env.PG_SSL_REJECT_UNAUTHORIZED === 'true' ? true : false
  pool = new Pool({ connectionString, ssl: { rejectUnauthorized } as any })
  return pool
}

export async function query(text: string, params?: any[]) {
  const p = getPool()
  const client = await p.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}

// Optional: create tables if not exist (basic subset)
export async function ensureTables() {
  await query(`
    -- Lookup tables
    CREATE TABLE IF NOT EXISTS ward (
      ward_id SERIAL PRIMARY KEY,
      name VARCHAR(150) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS property_type (
      ptype_id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );

    -- Core property table (references lookup ids)
    CREATE TABLE IF NOT EXISTS property (
      property_id SERIAL PRIMARY KEY,
      owner_id INT,
      ward_id INT REFERENCES ward(ward_id) ON DELETE SET NULL,
      ptype_id INT REFERENCES property_type(ptype_id) ON DELETE SET NULL,
      address TEXT,
      land_area NUMERIC(10,2) DEFAULT 0,
      built_area NUMERIC(10,2) DEFAULT 0,
      usage VARCHAR(100),
      created_at TIMESTAMP DEFAULT now()
    );

    -- Assessments for properties
    CREATE TABLE IF NOT EXISTS assessment (
      assess_id SERIAL PRIMARY KEY,
      property_id INT NOT NULL REFERENCES property(property_id) ON DELETE CASCADE,
      financial_year VARCHAR(9) NOT NULL,
      assessed_value NUMERIC(14,2) NOT NULL,
      base_tax NUMERIC(12,2) NOT NULL,
      exemption_pct NUMERIC(5,2) DEFAULT 0,
      penalty NUMERIC(12,2) DEFAULT 0,
      total_due NUMERIC(12,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'DUE',
      created_at TIMESTAMP DEFAULT now()
    );

    -- Payments linked to assessments
    CREATE TABLE IF NOT EXISTS payment (
      payment_id SERIAL PRIMARY KEY,
      assess_id INT NOT NULL REFERENCES assessment(assess_id) ON DELETE CASCADE,
      paid_amount NUMERIC(12,2) NOT NULL,
      paid_on TIMESTAMP DEFAULT now(),
      payment_method VARCHAR(50),
      transaction_ref VARCHAR(200),
      payment_status VARCHAR(20) DEFAULT 'SUCCESS'
    );
  `)
}
