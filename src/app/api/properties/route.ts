import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await query('SELECT property_id, address, ward, ptype, land_area, built_area, usage, owner_id FROM property ORDER BY property_id DESC')
    return NextResponse.json(res.rows)
  } catch (err: any) {
    console.error('GET /api/properties error', err?.message || err)
    const msg = String(err?.message || '')
    if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo') || msg.includes('ECONNREFUSED')) {
      console.warn('Falling back to in-memory mock data for /api/properties due to DB connectivity error')
      const mock = [
        { property_id: 1, address: '123 Main St, Apt 4', ward: 'Ward 1', ptype: 'Residential', land_area: 200.00, built_area: 120.00, usage: 'Residential', owner_id: null },
        { property_id: 2, address: '45 Market Rd', ward: 'Ward 2', ptype: 'Commercial', land_area: 500.00, built_area: 350.00, usage: 'Commercial', owner_id: null }
      ]
      return new NextResponse(JSON.stringify(mock), { status: 200, headers: { 'Content-Type': 'application/json', 'x-mock-data': '1' } })
    }
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
  const { address, ward, ptype, land_area, built_area, usage } = parsedBody
  const res = await query(
    'INSERT INTO property(address, ward, ptype, land_area, built_area, usage) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [address, ward, ptype, land_area, built_area, usage]
  )
    return NextResponse.json(res.rows[0])
  } catch (err: any) {
  console.error('POST /api/properties error', err?.message || err)
  const msg = String(err?.message || '')
    // return a mock created object when DB host is not reachable so the prototype can continue
    if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo') || msg.includes('ECONNREFUSED')) {
      console.warn('Returning mock created property due to DB connectivity error')
  const createdMock = { property_id: Date.now(), address: parsedBody?.address || 'New Property', ward: parsedBody?.ward || 'Ward 1', ptype: parsedBody?.ptype || 'Residential', land_area: parsedBody?.land_area || 0, built_area: parsedBody?.built_area || 0, usage: parsedBody?.usage || '' }
      return new NextResponse(JSON.stringify(createdMock), { status: 200, headers: { 'Content-Type': 'application/json', 'x-mock-data': '1' } })
    }
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
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('DELETE /api/properties error', err?.message || err)
    const msg = String(err?.message || '')
    if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo') || msg.includes('ECONNREFUSED')) {
      console.warn('Pretending delete succeeded (mock) due to DB connectivity error')
      return NextResponse.json({ ok: true, _mock: true })
    }
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}
