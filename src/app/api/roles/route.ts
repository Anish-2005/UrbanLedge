import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await query('SELECT * FROM role ORDER BY role_id')
    return NextResponse.json(res.rows)
  } catch (err: any) {
    console.error('GET /api/roles error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}