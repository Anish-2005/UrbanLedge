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
    const currentRes = await query('SELECT active FROM tax_slab WHERE slab_id = $1', [id])
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Tax slab not found' }, { status: 404 })
    }

    const currentActive = currentRes.rows[0].active
    const newActive = !currentActive

    // Update the active status
    const updateRes = await query(
      'UPDATE tax_slab SET active = $1 WHERE slab_id = $2 RETURNING *',
      [newActive, id]
    )

    return NextResponse.json(updateRes.rows[0])
  } catch (error) {
    console.error('Error toggling tax slab:', error)
    return NextResponse.json({ error: 'Failed to toggle tax slab' }, { status: 500 })
  }
}