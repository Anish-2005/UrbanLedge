import { NextResponse } from 'next/server'
import { selectFrom, insertInto, updateIn, deleteFrom, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    // For Supabase, we'll use a simpler query without JOINs for now
    // In production, you'd create RPC functions or views in Supabase
    const res = await selectFrom('property')
    // Transform the data to match the expected format
    const transformedRows = res.rows.map((row: any) => ({
      property_id: row.property_id || row.id,
      address: row.address,
      ward: row.ward || 'Ward 1', // Simplified - would need proper JOIN logic
      ptype: row.ptype || 'Residential', // Simplified - would need proper JOIN logic
      land_area: row.land_area,
      built_area: row.built_area,
      usage: row.usage,
      owner_id: row.owner_id
    }))
    return NextResponse.json(transformedRows)
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

    // For Supabase, simplify the insertion - store ward and ptype as strings for now
    const propertyData = {
      address,
      ward: ward || 'Ward 1',
      ptype: ptype || 'Residential',
      land_area: land_area || 0,
      built_area: built_area || 0,
      usage: usage || 'Residential',
      owner_id: final_owner_id
    }

    const result = await insertInto('property', propertyData)
    const createdProperty = result.rows[0]

    return NextResponse.json({
      property_id: createdProperty.id || createdProperty.property_id,
      address: createdProperty.address,
      ward: createdProperty.ward,
      ptype: createdProperty.ptype,
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

    // For Supabase, update the property directly
    const updateData = {
      address,
      ward: ward || 'Ward 1',
      ptype: ptype || 'Residential',
      land_area: land_area || 0,
      built_area: built_area || 0,
      usage: usage || 'Residential'
    }

    const result = await updateIn('property', updateData, { property_id: id })
    const updatedProperty = result.rows[0]

    return NextResponse.json({
      property_id: updatedProperty.id || updatedProperty.property_id,
      address: updatedProperty.address,
      ward: updatedProperty.ward,
      ptype: updatedProperty.ptype,
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
