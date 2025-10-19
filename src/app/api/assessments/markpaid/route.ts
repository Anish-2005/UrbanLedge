import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function POST(req: Request) {
  await ensureTables()
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return new NextResponse('Unauthorized', { status: 401 })
  const body = await req.json()
  const { assess_id } = body
  if (!assess_id) return new NextResponse('assess_id required', { status: 400 })

  // set total_due = 0 and status = 'PAID'
  const res = await query('UPDATE assessment SET total_due = 0, status = $1 WHERE assess_id = $2 RETURNING *', ['PAID', assess_id])
  return NextResponse.json(res.rows[0])
}
