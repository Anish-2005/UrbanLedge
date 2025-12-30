'use server'

import { Pool } from 'pg'

let pool: Pool | null = null

function getPool() {
  if (pool) return pool
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL not set')
  }
  pool = new Pool({ connectionString })
  return pool
}

// Returns true when PostgreSQL is configured via env
export async function isDbEnabled() {
  return Boolean(process.env.DATABASE_URL)
}

export async function query(text: string, params?: unknown[]) {
  const client = await getPool().connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// PostgreSQL query methods
export async function selectFrom(table: string, columns = '*', filters?: Record<string, any>) {
  let sql = `SELECT ${columns} FROM ${table}`
  const params: any[] = []
  let paramIndex = 1

  if (filters && Object.keys(filters).length > 0) {
    const conditions = Object.entries(filters).map(([key, value]) => {
      params.push(value)
      return `${key} = $${paramIndex++}`
    })
    sql += ` WHERE ${conditions.join(' AND ')}`
  }

  const result = await query(sql, params)
  return { rows: result.rows }
}

export async function insertInto(table: string, data: Record<string, any>) {
  const columns = Object.keys(data)
  const values = Object.values(data)
  const placeholders = values.map((_, i) => `$${i + 1}`)

  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`
  const result = await query(sql, values)
  return { rows: result.rows }
}

export async function updateIn(table: string, data: Record<string, any>, filters: Record<string, any>) {
  const setParts = Object.keys(data).map((key, i) => `${key} = $${i + 1}`)
  const values = Object.values(data)
  let paramIndex = values.length + 1

  const whereParts = Object.entries(filters).map(([key, value]) => {
    values.push(value)
    return `${key} = $${paramIndex++}`
  })

  const sql = `UPDATE ${table} SET ${setParts.join(', ')} WHERE ${whereParts.join(' AND ')} RETURNING *`
  const result = await query(sql, values)
  return { rows: result.rows }
}

export async function deleteFrom(table: string, filters: Record<string, any>) {
  const values: any[] = []
  let paramIndex = 1

  const whereParts = Object.entries(filters).map(([key, value]) => {
    values.push(value)
    return `${key} = $${paramIndex++}`
  })

  const sql = `DELETE FROM ${table} WHERE ${whereParts.join(' AND ')} RETURNING *`
  const result = await query(sql, values)
  return { rows: result.rows }
}

// Optional: create tables if not exist (full schema)
export async function ensureTables() {
  // If no PostgreSQL configured, skip creating tables
  if (!(await isDbEnabled())) {
    // No DB configured - skip schema creation
    return
  }

  // For PostgreSQL, check if basic tables exist by trying to query them
  try {
    await selectFrom('property', 'property_id', { property_id: '1' })
    console.log('Database tables appear to exist')
  } catch (error: any) {
    if (error.message?.includes('relation "public.property" does not exist') ||
        error.message?.includes('does not exist')) {
      console.warn('Database tables do not exist. Please create them manually in Neon SQL Editor using the schema files in the sql/ directory')
      // Don't throw error - let the app fail gracefully
    } else {
      // Re-throw other errors
      throw error
    }
  }
}
