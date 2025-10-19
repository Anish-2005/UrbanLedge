'use server'

import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL not set')
}

const pool = new Pool({ connectionString })

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
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
    CREATE TABLE IF NOT EXISTS property (
      property_id SERIAL PRIMARY KEY,
      owner_id INT,
      ward VARCHAR(150),
      ptype VARCHAR(100),
      address TEXT,
      land_area NUMERIC(10,2) DEFAULT 0,
      built_area NUMERIC(10,2) DEFAULT 0,
      usage VARCHAR(100),
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS assessment (
      assess_id SERIAL PRIMARY KEY,
      property_id INT NOT NULL,
      financial_year VARCHAR(9) NOT NULL,
      assessed_value NUMERIC(14,2) NOT NULL,
      base_tax NUMERIC(12,2) NOT NULL,
      exemption_pct NUMERIC(5,2) DEFAULT 0,
      penalty NUMERIC(12,2) DEFAULT 0,
      total_due NUMERIC(12,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'DUE',
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS payment (
      payment_id SERIAL PRIMARY KEY,
      assess_id INT NOT NULL,
      paid_amount NUMERIC(12,2) NOT NULL,
      paid_on TIMESTAMP DEFAULT now(),
      payment_method VARCHAR(50),
      transaction_ref VARCHAR(200),
      payment_status VARCHAR(20) DEFAULT 'SUCCESS'
    );
  `)
}
