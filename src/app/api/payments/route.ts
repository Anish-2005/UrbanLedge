import { NextResponse } from 'next/server'
import { selectFrom, insertInto, updateIn, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await selectFrom('payment')
    return NextResponse.json(res.rows)
  } catch (err: any) {
    console.error('GET /api/payments error', err?.message || err)
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
    const { assess_id, paid_amount, payment_method, transaction_ref } = body

    // Insert payment
    const paymentData = {
      assess_id,
      paid_amount,
      payment_method: payment_method || 'CASH',
      transaction_ref,
      payment_status: 'SUCCESS'
    }

    const paymentResult = await insertInto('payment', paymentData)
    const payment = paymentResult.rows[0]

    // Create receipt
    const receiptNo = 'RCPT-' + toISOStringCompact(new Date()) + '-' + payment.id
    const receiptData = {
      payment_id: payment.id,
      receipt_no: receiptNo
    }

    const receiptResult = await insertInto('receipt', receiptData)
    const receipt = receiptResult.rows[0]

    // Update assessment status (simplified for Supabase)
    try {
      await updateIn('assessment', { status: 'PAID' }, { assess_id })
    } catch (updateError) {
      console.warn('Could not update assessment status:', updateError)
    }

    return NextResponse.json({ payment, receipt })
  } catch (err: any) {
    console.error('POST /api/payments error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Database connection failed' }, { status: 500 })
  }
}

function toISOStringCompact(d: Date) {
  return d.toISOString().replace(/[:-]|\.|Z/g, '')
}
