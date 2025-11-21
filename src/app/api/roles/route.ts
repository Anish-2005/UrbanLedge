import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    try {
      await ensureTables()
      const res = await query('SELECT * FROM role ORDER BY role_id')
      return NextResponse.json(res.rows)
    } catch (dbErr) {
      // Fallback to mock service
      const { mockService } = await import('@/lib/mockService')
      const roles = mockService.roles.list()
      return NextResponse.json(roles.map(r => ({
        id: r.id,
        role_id: r.id,
        name: r.role_name,
        role_name: r.role_name,
        description: r.description
      })))
    }
  } catch (err: any) {
    console.error('GET /api/roles error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}