import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  await ensureTables()
  const res = await query('SELECT * FROM payment ORDER BY payment_id DESC')
  return NextResponse.json(res.rows)
}

export async function POST(req: Request) {
  await ensureTables()
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
  const body = await req.json()
  const { assess_id, paid_amount, payment_method, transaction_ref } = body

  // Insert payment
  const p = await query(
    `INSERT INTO payment(assess_id, paid_amount, payment_method, transaction_ref, payment_status)
     VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [assess_id, paid_amount, payment_method, transaction_ref, 'SUCCESS']
  )

  const payment = p.rows[0]

  // create receipt
  const receiptNo = 'RCPT-' + Date.now()
  const r = await query('INSERT INTO receipt(payment_id, receipt_no) VALUES($1,$2) RETURNING *', [payment.payment_id, receiptNo])

  // Optionally update assessment total_due (simple subtract)
  await query('UPDATE assessment SET total_due = GREATEST(COALESCE(total_due,0) - $1, 0) WHERE assess_id = $2', [paid_amount, assess_id])

  return NextResponse.json({ payment, receipt: r.rows[0] })
}
