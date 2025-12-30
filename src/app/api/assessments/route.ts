import { NextResponse } from 'next/server'
import { query, ensureTables, calculateTax } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await query('SELECT * FROM assessment ORDER BY assess_id DESC')
    return NextResponse.json(res.rows)
  } catch (err: any) {
    console.error('GET /api/assessments error', err?.message || err)
    // If database is not available, return empty array so frontend falls back to mock data
    if (err?.code === 'ENOTFOUND' || err?.message?.includes('getaddrinfo ENOTFOUND')) {
      console.log('Database not available, returning empty array for mock fallback')
      return NextResponse.json([])
    }
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  await ensureTables()
  const requireAuth = process.env.REQUIRE_AUTH === 'true'
  if (requireAuth) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
  }
  const body = await req.json()
  const { property_id, financial_year } = body

  try {
    const taxDetails = await calculateTax(property_id, financial_year)

    const res = await query(
      `INSERT INTO assessment(property_id, financial_year, assessed_value, base_tax, exemption_pct, penalty, total_due)
       VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [property_id, financial_year, taxDetails.assessedValue, taxDetails.baseTax, taxDetails.exemptionPct, taxDetails.penalty, taxDetails.totalDue]
    )
    return NextResponse.json(res.rows[0])
  } catch (err: any) {
    console.error('Tax calculation error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
