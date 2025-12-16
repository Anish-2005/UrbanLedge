import { NextResponse } from 'next/server'
import { isDbEnabled, query } from '@/lib/db'

export async function GET() {
  try {
    const enabled = await isDbEnabled()
    if (!enabled) {
      return NextResponse.json({ enabled: false, connected: false })
    }

    // Try a lightweight check
    try {
      await query('SELECT 1')
      return NextResponse.json({ enabled: true, connected: true })
    } catch (err: any) {
      console.error('DB ping failed:', err?.message ?? err)
      return NextResponse.json({ enabled: true, connected: false, error: String(err?.message ?? err) })
    }
  } catch (err) {
    console.error('DB status error:', err)
    return NextResponse.json({ enabled: false, connected: false, error: String(err) })
  }
}
