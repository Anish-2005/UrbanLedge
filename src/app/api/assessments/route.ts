import { NextResponse } from 'next/server'
import { selectFrom, insertInto, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await selectFrom('assessment')
    return NextResponse.json(res.rows)
  } catch (err: any) {
    console.error('GET /api/assessments error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Database connection failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await ensureTables()
    const requireAuth = process.env.REQUIRE_AUTH === 'true'
    if (requireAuth) {
      const authHeader = req.headers.get('authorization')
      if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
    }
    const body = await req.json()
    const { property_id, financial_year } = body

    // Simplified tax calculation for demo
    const assessedValue = 100000
    const baseTax = 2000
    const exemptionPct = 0
    const penalty = 0
    const totalDue = 2000

    const assessmentData = {
      property_id,
      financial_year,
      assessed_value: assessedValue,
      base_tax: baseTax,
      exemption_pct: exemptionPct,
      penalty,
      total_due: totalDue,
      status: 'DUE'
    }

    const result = await insertInto('assessment', assessmentData)
    const createdAssessment = result.rows[0]

    return NextResponse.json(createdAssessment)
  } catch (err: any) {
    console.error('POST /api/assessments error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Database connection failed' }, { status: 500 })
  }
}
