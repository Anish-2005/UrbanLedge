import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side proxy that uses the SUPABASE_SERVICE_ROLE_KEY to perform writes.
// Usage: POST /api/proxy/property with JSON body { address, ward or ward_id, ptype or ptype_id, land_area, built_area, usage, owner_id }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.warn('SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL not set; proxy will not function')
}

export async function POST(req: Request) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured on server. Set SUPABASE_SERVICE_ROLE_KEY in environment.' }, { status: 501 })
  }

  const supabaseAdmin = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY)

  let body: any
  try {
    body = await req.json()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const addr = body.address ?? null
  if (!addr) return NextResponse.json({ error: 'address is required' }, { status: 400 })

  // Resolve or create ward id
  let ward_id = body.ward_id ?? null
  if (!ward_id && body.ward) {
    const name = body.ward
    const { data: existing, error: e1 } = await supabaseAdmin.from('ward').select('ward_id').eq('name', name).limit(1).maybeSingle()
    if (e1) return NextResponse.json({ error: 'ward lookup failed', details: e1 }, { status: 500 })
    if (existing && (existing as any).ward_id) ward_id = (existing as any).ward_id
    else {
      const { data: createdWard, error: e2 } = await supabaseAdmin.from('ward').insert([{ name, area_description: '' }]).select('ward_id').maybeSingle()
      if (e2) return NextResponse.json({ error: 'ward create failed', details: e2 }, { status: 500 })
      ward_id = createdWard ? (createdWard as any).ward_id : null
    }
  }

  // Resolve or create ptype id
  let ptype_id = body.ptype_id ?? null
  if (!ptype_id && body.ptype) {
    const name = body.ptype
    const { data: existingP, error: e3 } = await supabaseAdmin.from('property_type').select('ptype_id').eq('name', name).limit(1).maybeSingle()
    if (e3) return NextResponse.json({ error: 'ptype lookup failed', details: e3 }, { status: 500 })
    if (existingP && (existingP as any).ptype_id) ptype_id = (existingP as any).ptype_id
    else {
      const { data: createdP, error: e4 } = await supabaseAdmin.from('property_type').insert([{ name, description: '' }]).select('ptype_id').maybeSingle()
      if (e4) return NextResponse.json({ error: 'ptype create failed', details: e4 }, { status: 500 })
      ptype_id = createdP ? (createdP as any).ptype_id : null
    }
  }

  const insertBody: any = {
    owner_id: body.owner_id ?? 1,
    ward_id: ward_id,
    ptype_id: ptype_id,
    address: addr,
    land_area: body.land_area ?? 0,
    built_area: body.built_area ?? 0,
    usage: body.usage ?? ''
  }

  try {
    const { data, error } = await supabaseAdmin.from('property').insert([insertBody]).select().maybeSingle()
    if (error) return NextResponse.json({ error: 'insert failed', details: error }, { status: 500 })
    return NextResponse.json({ property: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'unexpected server error', details: String(err) }, { status: 500 })
  }
}
