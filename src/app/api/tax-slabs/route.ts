import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await query(`
      SELECT ts.*, pt.name as property_type_name
      FROM tax_slab ts
      LEFT JOIN property_type pt ON ts.ptype_id = pt.ptype_id
      WHERE ts.active = true
      ORDER BY ts.ptype_id, ts.min_area
    `)
    return NextResponse.json(res.rows)
  } catch (err: any) {
    console.error('GET /api/tax-slabs error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await ensureTables()
    const body = await req.json()
    const { ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to } = body

    const res = await query(
      'INSERT INTO tax_slab(ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to]
    )
    return NextResponse.json(res.rows[0])
  } catch (err: any) {
    console.error('POST /api/tax-slabs error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}