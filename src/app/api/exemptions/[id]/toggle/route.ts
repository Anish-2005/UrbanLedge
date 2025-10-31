import { NextRequest, NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables()
    const { id } = await params

    // First get current status
    const currentRes = await query('SELECT active FROM exemption WHERE exemp_id = $1', [id])
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Exemption not found' }, { status: 404 })
    }

    const currentActive = currentRes.rows[0].active
    const newActive = !currentActive

    // Update the active status
    const updateRes = await query(
      'UPDATE exemption SET active = $1 WHERE exemp_id = $2 RETURNING exemp_id as exemption_id, name as exemption_name, percentage as exemption_percentage, active, \'\' as description',
      [newActive, id]
    )

    return NextResponse.json(updateRes.rows[0])
  } catch (error) {
    console.error('Error toggling exemption:', error)
    return NextResponse.json({ error: 'Failed to toggle exemption' }, { status: 500 })
  }
}