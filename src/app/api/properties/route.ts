import { NextResponse } from 'next/server'
import { query, ensureTables, auditLog } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await query(`
      SELECT p.property_id, p.address, w.name AS ward, pt.name AS ptype, p.land_area, p.built_area, p.usage, p.owner_id
      FROM property p
      LEFT JOIN ward w ON p.ward_id = w.ward_id
      LEFT JOIN property_type pt ON p.ptype_id = pt.ptype_id
      ORDER BY p.property_id DESC
    `)
    return NextResponse.json(res.rows)
  } catch (err: any) {
    console.error('GET /api/properties error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  let parsedBody: any = null
  try {
    await ensureTables()
  // Optional auth: set REQUIRE_AUTH=true in env to enforce Authorization header
  const requireAuth = process.env.REQUIRE_AUTH === 'true'
  if (requireAuth) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
  }
  parsedBody = await req.json()
  const { address, ward, ptype, land_area, built_area, usage, owner_id } = parsedBody
  
  // Use default owner_id if not provided (for demo purposes)
  const final_owner_id = owner_id || 1
  // Map ward and ptype names to IDs (create if missing), then insert property in a transaction
  try {
    await query('BEGIN')
    // ward
    let r = await query('SELECT ward_id FROM ward WHERE name = $1', [ward])
    let ward_id = r.rows[0]?.ward_id
    if (!ward_id) {
      r = await query('INSERT INTO ward(name) VALUES($1) RETURNING ward_id', [ward])
      ward_id = r.rows[0].ward_id
    }
    // property_type
    r = await query('SELECT ptype_id FROM property_type WHERE name = $1', [ptype])
    let ptype_id = r.rows[0]?.ptype_id
    if (!ptype_id) {
      r = await query('INSERT INTO property_type(name) VALUES($1) RETURNING ptype_id', [ptype])
      ptype_id = r.rows[0].ptype_id
    }

    const ins = await query('INSERT INTO property(owner_id, ward_id, ptype_id, address, land_area, built_area, usage) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING property_id', [final_owner_id, ward_id, ptype_id, address, land_area, built_area, usage])
    const pid = ins.rows[0].property_id
    const final = await query(`SELECT p.property_id, p.address, w.name AS ward, pt.name AS ptype, p.land_area, p.built_area, p.usage, p.owner_id FROM property p LEFT JOIN ward w ON p.ward_id = w.ward_id LEFT JOIN property_type pt ON p.ptype_id = pt.ptype_id WHERE p.property_id = $1`, [pid])
    await auditLog(null, 'CREATE', 'property', pid.toString(), `Created property: ${address}`)
    await query('COMMIT')
    return NextResponse.json(final.rows[0])
  } catch (e) {
    try { await query('ROLLBACK') } catch (_) {}
    throw e
  }
  } catch (err: any) {
  console.error('POST /api/properties error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  let parsedBody: any = null
  try {
    await ensureTables()
    parsedBody = await req.json()
    const id = parsedBody.property_id ?? parsedBody.id
    if (!id) return new NextResponse('property_id is required', { status: 400 })
    const { address, ward, ptype, land_area, built_area, usage } = parsedBody
    try {
      await query('BEGIN')
      // resolve ward
      let r = await query('SELECT ward_id FROM ward WHERE name = $1', [ward])
      let ward_id = r.rows[0]?.ward_id
      if (!ward_id) {
        r = await query('INSERT INTO ward(name) VALUES($1) RETURNING ward_id', [ward])
        ward_id = r.rows[0].ward_id
      }
      // resolve ptype
      r = await query('SELECT ptype_id FROM property_type WHERE name = $1', [ptype])
      let ptype_id = r.rows[0]?.ptype_id
      if (!ptype_id) {
        r = await query('INSERT INTO property_type(name) VALUES($1) RETURNING ptype_id', [ptype])
        ptype_id = r.rows[0].ptype_id
      }
      const updated = await query('UPDATE property SET address=$1, ward_id=$2, ptype_id=$3, land_area=$4, built_area=$5, usage=$6 WHERE property_id=$7 RETURNING property_id', [address, ward_id, ptype_id, land_area, built_area, usage, id])
      const pid = updated.rows[0].property_id
      const final = await query('SELECT p.property_id, p.address, w.name AS ward, pt.name AS ptype, p.land_area, p.built_area, p.usage, p.owner_id FROM property p LEFT JOIN ward w ON p.ward_id = w.ward_id LEFT JOIN property_type pt ON p.ptype_id = pt.ptype_id WHERE p.property_id = $1', [pid])
      await query('COMMIT')
      return NextResponse.json(final.rows[0])
    } catch (e) {
      try { await query('ROLLBACK') } catch (_) {}
      throw e
    }
  } catch (err: any) {
    console.error('PUT /api/properties error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
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
    await query('DELETE FROM property WHERE property_id = $1', [id])
    await auditLog(null, 'DELETE', 'property', id, `Deleted property ID: ${id}`)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('DELETE /api/properties error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}
