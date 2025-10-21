"use server"

import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

function getPool() {
  if (pool) return pool
  const uri = process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL
  if (!uri) {
    throw new Error('MYSQL_DATABASE_URL or DATABASE_URL not set')
  }
  pool = mysql.createPool({ uri, connectionLimit: 10 }) as unknown as mysql.Pool
  return pool
}

export async function query(sql: string, params?: any[]) {
  const p = getPool()
  const [rows] = await p.execute(sql, params)
  return rows
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
