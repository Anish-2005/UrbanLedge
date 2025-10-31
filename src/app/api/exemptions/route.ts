import { NextRequest, NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await query(`
      SELECT exemp_id as exemption_id, name as exemption_name, percentage as exemption_percentage, active, '' as description
      FROM exemption
      ORDER BY name
    `)
    return NextResponse.json(res.rows)
  } catch (error) {
    console.error('Error fetching exemptions:', error)
    return NextResponse.json({ error: 'Failed to fetch exemptions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTables()
    const { name, percentage, valid_from, valid_to } = await request.json()

    if (!name || percentage === undefined) {
      return NextResponse.json({ error: 'Name and percentage are required' }, { status: 400 })
    }

    const queryText = `
      INSERT INTO exemption (name, percentage, valid_from, valid_to)
      VALUES ($1, $2, $3, $4)
      RETURNING exemp_id as exemption_id, name as exemption_name, percentage as exemption_percentage, active, '' as description
    `

    const result = await query(queryText, [name, percentage, valid_from, valid_to])
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating exemption:', error)
    return NextResponse.json({ error: 'Failed to create exemption' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureTables()
    const { exemption_id, name, percentage, valid_from, valid_to, active } = await request.json()

    if (!exemption_id || !name) {
      return NextResponse.json({ error: 'Exemption ID and name are required' }, { status: 400 })
    }

    const queryText = `
      UPDATE exemption
      SET name = $1, percentage = $2, valid_from = $3, valid_to = $4, active = $5
      WHERE exemp_id = $6
      RETURNING exemp_id as exemption_id, name as exemption_name, percentage as exemption_percentage, active, '' as description
    `

    const result = await query(queryText, [name, percentage, valid_from, valid_to, active, exemption_id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Exemption not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating exemption:', error)
    return NextResponse.json({ error: 'Failed to update exemption' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureTables()
    const { searchParams } = new URL(request.url)
    const exemption_id = searchParams.get('id')

    if (!exemption_id) {
      return NextResponse.json({ error: 'Exemption ID is required' }, { status: 400 })
    }

    const queryText = `DELETE FROM exemption WHERE exemp_id = $1`
    await query(queryText, [exemption_id])

    return NextResponse.json({ message: 'Exemption deleted successfully' })
  } catch (error) {
    console.error('Error deleting exemption:', error)
    return NextResponse.json({ error: 'Failed to delete exemption' }, { status: 500 })
  }
}