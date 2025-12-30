import { NextResponse } from 'next/server'

// Neon proxy: this proxy used to call Neon admin APIs.
// It's now a no-op stub.
// If you want to re-enable a server-side write path, implement handlers here that call your server DB.

export async function POST(req: Request) {
  return NextResponse.json({ error: 'Neon proxy not implemented. Use direct API calls or implement a new server API.' }, { status: 501 })
}
