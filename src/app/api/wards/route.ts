import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    try {
      const queryText = `
        SELECT
          w.ward_id,
          w.name,
          w.area_description,
          COUNT(p.property_id) as property_count,
          COALESCE(SUM(a.total_due), 0) as total_revenue
        FROM ward w
        LEFT JOIN property p ON w.ward_id = p.ward_id
        LEFT JOIN assessment a ON p.property_id = a.property_id AND a.status = 'DUE'
        GROUP BY w.ward_id, w.name, w.area_description
        ORDER BY w.name
      `

      const result = await query(queryText)
      return NextResponse.json(result.rows || result)
    } catch (dbErr) {
      console.error('Database error:', dbErr)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error fetching wards:', error)
    return NextResponse.json({ error: 'Failed to fetch wards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, ward_name, area_description, zone, population, area_sq_km } = body

    const wardName = name || ward_name

    if (!wardName) {
      return NextResponse.json({ error: 'Ward name is required' }, { status: 400 })
    }

    try {
      const queryText = `
        INSERT INTO ward (name, area_description)
        VALUES ($1, $2)
        RETURNING ward_id, name, area_description
      `

      const result = await query(queryText, [wardName, area_description])
      return NextResponse.json(result.rows[0])
    } catch (dbErr) {
      console.error('Database error:', dbErr)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error creating ward:', error)
    return NextResponse.json({ error: 'Failed to create ward' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ward_id, name, ward_name, area_description, zone, population, area_sq_km } = body

    const wId = id || ward_id
    const wardName = name || ward_name

    if (!wId || !wardName) {
      return NextResponse.json({ error: 'Ward ID and name are required' }, { status: 400 })
    }

    try {
      const queryText = `
        UPDATE ward
        SET name = $1, area_description = $2
        WHERE ward_id = $3
        RETURNING ward_id, name, area_description
      `

      const result = await query(queryText, [wardName, area_description, wId])

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Ward not found' }, { status: 404 })
      }

      return NextResponse.json(result.rows[0])
    } catch (dbErr) {
      console.error('Database error:', dbErr)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error updating ward:', error)
    return NextResponse.json({ error: 'Failed to update ward' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ward_id } = body
    const wId = id || ward_id

    if (!wId) {
      return NextResponse.json({ error: 'Ward ID is required' }, { status: 400 })
    }

    try {
      const queryText = `DELETE FROM ward WHERE ward_id = $1`
      await query(queryText, [wId])
      return NextResponse.json({ message: 'Ward deleted successfully', success: true })
    } catch (dbErr) {
      console.error('Database error:', dbErr)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting ward:', error)
    return NextResponse.json({ error: 'Failed to delete ward' }, { status: 500 })
  }
}