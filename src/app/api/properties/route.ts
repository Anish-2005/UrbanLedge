import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  await ensureTables()
  const res = await query('SELECT property_id, address, ward, ptype, land_area, built_area, usage FROM property ORDER BY property_id DESC')
  return NextResponse.json(res.rows)
}

export async function POST(req: Request) {
  await ensureTables()
  // require auth token presence (prototype) - TODO: verify with firebase-admin
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
  const body = await req.json()
  const { address, ward, ptype, land_area, built_area, usage } = body
  const res = await query(
    'INSERT INTO property(address, ward, ptype, land_area, built_area, usage) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [address, ward, ptype, land_area, built_area, usage]
  )
  return NextResponse.json(res.rows[0])
}

export async function DELETE(req: Request) {
  await ensureTables()
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return new NextResponse('id is required', { status: 400 })
  await query('DELETE FROM property WHERE property_id = $1', [id])
  return NextResponse.json({ ok: true })
}
