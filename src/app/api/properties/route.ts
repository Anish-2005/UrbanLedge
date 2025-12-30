import { NextResponse } from 'next/server'
import { selectFrom, insertInto, updateIn, deleteFrom, ensureTables, query } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    // Use JOIN to get ward and property type names
    const sql = `
      SELECT p.property_id, p.address, w.name as ward, pt.name as ptype,
             p.land_area, p.built_area, p.usage, p.owner_id, p.created_at
      FROM property p
      JOIN ward w ON p.ward_id = w.ward_id
      JOIN property_type pt ON p.ptype_id = pt.ptype_id
      ORDER BY p.property_id
    `
    const result = await query(sql)
    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error('GET /api/properties error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Database connection failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await ensureTables()
    // Optional auth: set REQUIRE_AUTH=true in env to enforce Authorization header
    const requireAuth = process.env.REQUIRE_AUTH === 'true'
    if (requireAuth) {
      const authHeader = req.headers.get('authorization')
      if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
    }
    const body = await req.json()
    const { address, ward, ptype, land_area, built_area, usage, owner_id } = body

    // Use default owner_id if not provided (for demo purposes)
    const final_owner_id = owner_id || 1

    // Look up ward_id and ptype_id
    const wardResult = await query('SELECT ward_id FROM ward WHERE name = $1', [ward || 'Ward 1'])
    const ptypeResult = await query('SELECT ptype_id FROM property_type WHERE name = $1', [ptype || 'Residential'])

    if (wardResult.rows.length === 0) {
      return NextResponse.json({ error: `Ward '${ward || 'Ward 1'}' not found` }, { status: 400 })
    }
    if (ptypeResult.rows.length === 0) {
      return NextResponse.json({ error: `Property type '${ptype || 'Residential'}' not found` }, { status: 400 })
    }

    const ward_id = wardResult.rows[0].ward_id
    const ptype_id = ptypeResult.rows[0].ptype_id

    // Insert with foreign key IDs
    const propertyData = {
      address,
      ward_id,
      ptype_id,
      land_area: land_area || 0,
      built_area: built_area || 0,
      usage: usage || 'Residential',
      owner_id: final_owner_id
    }

    const result = await insertInto('property', propertyData)
    const createdProperty = result.rows[0]

    // Return with names for frontend compatibility
    const wardNameResult = await query('SELECT name FROM ward WHERE ward_id = $1', [createdProperty.ward_id])
    const ptypeNameResult = await query('SELECT name FROM property_type WHERE ptype_id = $1', [createdProperty.ptype_id])

    return NextResponse.json({
      property_id: createdProperty.property_id,
      address: createdProperty.address,
      ward: wardNameResult.rows[0]?.name || 'Unknown',
      ptype: ptypeNameResult.rows[0]?.name || 'Unknown',
      land_area: createdProperty.land_area,
      built_area: createdProperty.built_area,
      usage: createdProperty.usage,
      owner_id: createdProperty.owner_id
    })
  } catch (err: any) {
    console.error('POST /api/properties error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Database connection failed' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    await ensureTables()
    const body = await req.json()
    const id = body.property_id ?? body.id
    if (!id) return new NextResponse('property_id is required', { status: 400 })
    const { address, ward, ptype, land_area, built_area, usage } = body

    // Look up ward_id and ptype_id
    const wardResult = await query('SELECT ward_id FROM ward WHERE name = $1', [ward || 'Ward 1'])
    const ptypeResult = await query('SELECT ptype_id FROM property_type WHERE name = $1', [ptype || 'Residential'])

    if (wardResult.rows.length === 0) {
      return NextResponse.json({ error: `Ward '${ward || 'Ward 1'}' not found` }, { status: 400 })
    }
    if (ptypeResult.rows.length === 0) {
      return NextResponse.json({ error: `Property type '${ptype || 'Residential'}' not found` }, { status: 400 })
    }

    const ward_id = wardResult.rows[0].ward_id
    const ptype_id = ptypeResult.rows[0].ptype_id

    // Update with foreign key IDs
    const updateData = {
      address,
      ward_id,
      ptype_id,
      land_area: land_area || 0,
      built_area: built_area || 0,
      usage: usage || 'Residential'
    }

    const result = await updateIn('property', updateData, { property_id: id })
    const updatedProperty = result.rows[0]

    // Return with names for frontend compatibility
    const wardNameResult = await query('SELECT name FROM ward WHERE ward_id = $1', [updatedProperty.ward_id])
    const ptypeNameResult = await query('SELECT name FROM property_type WHERE ptype_id = $1', [updatedProperty.ptype_id])

    return NextResponse.json({
      property_id: updatedProperty.property_id,
      address: updatedProperty.address,
      ward: wardNameResult.rows[0]?.name || 'Unknown',
      ptype: ptypeNameResult.rows[0]?.name || 'Unknown',
      land_area: updatedProperty.land_area,
      built_area: updatedProperty.built_area,
      usage: updatedProperty.usage,
      owner_id: updatedProperty.owner_id
    })
  } catch (err: any) {
    console.error('PUT /api/properties error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Database connection failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureTables()
    const requireAuth = process.env.REQUIRE_AUTH === 'true'
    if (requireAuth) {
      const authHeader = req.headers.get('authorization')
      if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
    }
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return new NextResponse('id is required', { status: 400 })

    await deleteFrom('property', { property_id: id })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('DELETE /api/properties error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Database connection failed' }, { status: 500 })
  }
}
