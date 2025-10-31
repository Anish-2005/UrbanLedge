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

export async function PUT(req: Request) {
  try {
    await ensureTables()
    const body = await req.json()
    const { slab_id, ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to, active } = body

    if (slab_id) {
      // Update specific slab
      const res = await query(
        'UPDATE tax_slab SET ptype_id=$1, min_area=$2, max_area=$3, base_rate_per_sq_m=$4, effective_from=$5, effective_to=$6, active=$7 WHERE slab_id=$8 RETURNING *',
        [ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to, active, slab_id]
      )
      return NextResponse.json(res.rows[0])
    }
  } catch (err: any) {
    console.error('PUT /api/tax-slabs error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}