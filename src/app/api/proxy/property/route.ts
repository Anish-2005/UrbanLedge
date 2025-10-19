import { NextResponse } from 'next/server'

// Supabase removed: this proxy used to call Supabase admin APIs.
// It's now a no-op stub to avoid referencing @supabase in source.
// If you want to re-enable a server-side write path, implement handlers here that call your server DB.

export async function POST(req: Request) {
  return NextResponse.json({ error: 'Supabase proxy removed. Use mockService in the client or implement a new server API.' }, { status: 501 })
}
