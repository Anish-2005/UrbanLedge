import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    // Try database first
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
    } catch (dbErr) {
      console.log('Database not available, using mock service')
      // Fallback to mock service
      const { mockService } = await import('@/lib/mockService')
      const taxSlabs = mockService.taxSlabs.list()
      return NextResponse.json(taxSlabs)
    }
  } catch (err: any) {
    console.error('GET /api/tax-slabs error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ptype_id, property_type_name, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to, active } = body

    try {
      await ensureTables()
      
      // First ensure the property type exists
      if (property_type_name) {
        await query(
          'INSERT INTO property_type (ptype_id, name) VALUES ($1, $2) ON CONFLICT (ptype_id) DO UPDATE SET name = $2',
          [ptype_id, property_type_name]
        )
      }

      // Insert tax slab
      const res = await query(
        'INSERT INTO tax_slab (ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from || null, effective_to || null, active !== false]
      )
      return NextResponse.json(res.rows[0])
    } catch (dbErr) {
      console.log('Database not available, using mock service')
      // Fallback to mock service
      const { mockService } = await import('@/lib/mockService')
      const newSlab = {
        id: 'ts' + Date.now(),
        ptype_id,
        property_type_name,
        min_area: Number(min_area),
        max_area: max_area ? Number(max_area) : null,
        base_rate_per_sq_m: Number(base_rate_per_sq_m),
        effective_from,
        effective_to,
        active: active !== false
      }
      mockService.taxSlabs.create(newSlab)
      return NextResponse.json(newSlab)
    }
  } catch (err: any) {
    console.error('POST /api/tax-slabs error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { slab_id, id, ptype_id, property_type_name, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to, active } = body
    const slabId = slab_id || id

    if (!slabId) {
      return NextResponse.json({ error: 'slab_id or id required' }, { status: 400 })
    }

    try {
      await ensureTables()
      
      // Update property type name if provided
      if (property_type_name) {
        await query(
          'INSERT INTO property_type (ptype_id, name) VALUES ($1, $2) ON CONFLICT (ptype_id) DO UPDATE SET name = $2',
          [ptype_id, property_type_name]
        )
      }

      // Update specific slab
      const res = await query(
        'UPDATE tax_slab SET ptype_id=$1, min_area=$2, max_area=$3, base_rate_per_sq_m=$4, effective_from=$5, effective_to=$6, active=$7 WHERE slab_id=$8 RETURNING *',
        [ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from || null, effective_to || null, active !== false, slabId]
      )
      return NextResponse.json(res.rows[0])
    } catch (dbErr) {
      console.log('Database not available, using mock service')
      // Fallback to mock service
      const { mockService } = await import('@/lib/mockService')
      const updatedSlab = {
        id: slabId,
        ptype_id,
        property_type_name,
        min_area: Number(min_area),
        max_area: max_area ? Number(max_area) : null,
        base_rate_per_sq_m: Number(base_rate_per_sq_m),
        effective_from,
        effective_to,
        active: active !== false
      }
      mockService.taxSlabs.update(updatedSlab)
      return NextResponse.json(updatedSlab)
    }
  } catch (err: any) {
    console.error('PUT /api/tax-slabs error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { slab_id, id } = body
    const slabId = slab_id || id

    if (!slabId) {
      return NextResponse.json({ error: 'slab_id or id required' }, { status: 400 })
    }

    try {
      await ensureTables()
      await query('DELETE FROM tax_slab WHERE slab_id = $1', [slabId])
      return NextResponse.json({ success: true })
    } catch (dbErr) {
      console.log('Database not available, using mock service')
      // Fallback to mock service
      const { mockService } = await import('@/lib/mockService')
      mockService.taxSlabs.delete(slabId)
      return NextResponse.json({ success: true })
    }
  } catch (err: any) {
    console.error('DELETE /api/tax-slabs error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}