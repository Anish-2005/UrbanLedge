import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
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
  } catch (error) {
    console.error('Error fetching wards:', error)
    return NextResponse.json({ error: 'Failed to fetch wards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, area_description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Ward name is required' }, { status: 400 })
    }

    const queryText = `
      INSERT INTO ward (name, area_description)
      VALUES ($1, $2)
      RETURNING ward_id, name, area_description
    `

    const result = await query(queryText, [name, area_description])
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating ward:', error)
    return NextResponse.json({ error: 'Failed to create ward' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { ward_id, name, area_description } = await request.json()

    if (!ward_id || !name) {
      return NextResponse.json({ error: 'Ward ID and name are required' }, { status: 400 })
    }

    const queryText = `
      UPDATE ward
      SET name = $1, area_description = $2
      WHERE ward_id = $3
      RETURNING ward_id, name, area_description
    `

    const result = await query(queryText, [name, area_description, ward_id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ward not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating ward:', error)
    return NextResponse.json({ error: 'Failed to update ward' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ward_id = searchParams.get('id')

    if (!ward_id) {
      return NextResponse.json({ error: 'Ward ID is required' }, { status: 400 })
    }

    const queryText = `DELETE FROM ward WHERE ward_id = $1`
    await query(queryText, [ward_id])

    return NextResponse.json({ message: 'Ward deleted successfully' })
  } catch (error) {
    console.error('Error deleting ward:', error)
    return NextResponse.json({ error: 'Failed to delete ward' }, { status: 500 })
  }
}