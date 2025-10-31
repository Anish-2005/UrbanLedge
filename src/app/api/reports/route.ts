import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET(req: Request) {
  try {
    await ensureTables()
    const url = new URL(req.url)
    const type = url.searchParams.get('type')

    let result
    if (type === 'total_collected') {
      result = await query(`
        SELECT SUM(paid_amount) as total_collected
        FROM payment
        WHERE payment_status = 'SUCCESS'
      `)
    } else if (type === 'pending_payments') {
      result = await query(`
        SELECT COUNT(*) as pending_count, SUM(total_due) as pending_amount
        FROM assessment
        WHERE status = 'DUE'
      `)
    } else if (type === 'property_stats') {
      result = await query(`
        SELECT pt.name as type, COUNT(p.property_id) as count
        FROM property p
        JOIN property_type pt ON p.ptype_id = pt.ptype_id
        GROUP BY pt.name
      `)
    } else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error('GET /api/reports error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}