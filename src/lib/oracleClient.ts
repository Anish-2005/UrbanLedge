"use server"

import oracledb from 'oracledb'

let pool: oracledb.Pool | null = null

export async function getPool() {
  if (pool) return pool
  const user = process.env.ORACLE_DB_USER
  const password = process.env.ORACLE_DB_PASSWORD
  const connectString = process.env.ORACLE_DB_CONNECT_STRING // e.g. host:port/service

  if (!user || !password || !connectString) {
    throw new Error('ORACLE_DB_USER, ORACLE_DB_PASSWORD or ORACLE_DB_CONNECT_STRING not set')
  }

  pool = await oracledb.createPool({ user, password, connectString, poolMin: 1, poolMax: 10 })
  return pool
}

export async function query(text: string, params: any[] = []) {
  const p = await getPool()
  const conn = await p.getConnection()
  try {
    const result = await conn.execute(text, params, { autoCommit: false })
    return result
  } finally {
    try { await conn.close() } catch (e) { /* ignore */ }
  }
}

export async function closePool() {
  if (pool) {
    try { await pool.close(10) } catch (e) { /* ignore */ }
    pool = null
  }
}
