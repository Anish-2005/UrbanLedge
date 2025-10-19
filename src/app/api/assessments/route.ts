import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  await ensureTables()
  const res = await query('SELECT * FROM assessment ORDER BY assess_id DESC')
  return NextResponse.json(res.rows)
}

export async function POST(req: Request) {
  await ensureTables()
  const requireAuth = process.env.REQUIRE_AUTH === 'true'
  if (requireAuth) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
  }
  const body = await req.json()
  const { property_id, financial_year, assessed_value, base_tax, exemption_pct, penalty, total_due } = body
  const res = await query(
    `INSERT INTO assessment(property_id, financial_year, assessed_value, base_tax, exemption_pct, penalty, total_due)
     VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [property_id, financial_year, assessed_value, base_tax, exemption_pct, penalty, total_due]
  )
  return NextResponse.json(res.rows[0])
}
