import { NextRequest, NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    try {
      await ensureTables()
      const res = await query(`
        SELECT exemp_id as exemption_id, name as exemption_name, percentage as exemption_percentage, active, '' as description
        FROM exemption
        ORDER BY name
      `)
      return NextResponse.json(res.rows)
    } catch (dbErr) {
      console.error('Database error:', dbErr)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error fetching exemptions:', error)
    return NextResponse.json({ error: 'Failed to fetch exemptions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, exemption_name, description, discount_pct, exemption_percentage, valid_from, valid_to, active } = body

    const name = category || exemption_name
    const percentage = discount_pct || exemption_percentage

    if (!name || percentage === undefined) {
      return NextResponse.json({ error: 'Name and percentage are required' }, { status: 400 })
    }

    try {
      await ensureTables()
      const queryText = `
        INSERT INTO exemption (name, percentage, valid_from, valid_to, active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING exemp_id as exemption_id, name as exemption_name, percentage as exemption_percentage, active, '' as description
      `

      const result = await query(queryText, [name, percentage, valid_from || null, valid_to || null, active !== false])
      return NextResponse.json(result.rows[0])
    } catch (dbErr) {
      console.error('Database error:', dbErr)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error creating exemption:', error)
    return NextResponse.json({ error: 'Failed to create exemption' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, exemption_id, category, exemption_name, description, discount_pct, exemption_percentage, valid_from, valid_to, active } = body

    const exId = id || exemption_id
    const name = category || exemption_name
    const percentage = discount_pct || exemption_percentage

    if (!exId || !name) {
      return NextResponse.json({ error: 'Exemption ID and name are required' }, { status: 400 })
    }

    try {
      await ensureTables()
      const queryText = `
        UPDATE exemption
        SET name = $1, percentage = $2, valid_from = $3, valid_to = $4, active = $5
        WHERE exemp_id = $6
        RETURNING exemp_id as exemption_id, name as exemption_name, percentage as exemption_percentage, active, '' as description
      `

      const result = await query(queryText, [name, percentage, valid_from || null, valid_to || null, active !== false, exId])

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Exemption not found' }, { status: 404 })
      }

      return NextResponse.json(result.rows[0])
    } catch (dbErr) {
      console.error('Database error:', dbErr)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error updating exemption:', error)
    return NextResponse.json({ error: 'Failed to update exemption' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, exemption_id } = body
    const exId = id || exemption_id

    if (!exId) {
      return NextResponse.json({ error: 'Exemption ID is required' }, { status: 400 })
    }

    try {
      await ensureTables()
      const queryText = `DELETE FROM exemption WHERE exemp_id = $1`
      await query(queryText, [exId])
      return NextResponse.json({ message: 'Exemption deleted successfully', success: true })
    } catch (dbErr) {
      console.error('Database error:', dbErr)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting exemption:', error)
    return NextResponse.json({ error: 'Failed to delete exemption' }, { status: 500 })
  }
}