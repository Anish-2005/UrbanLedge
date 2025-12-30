import { NextRequest, NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await ensureTables()
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const entity_type = searchParams.get('entity_type')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100

    let sql = `
      SELECT al.log_id, al.user_id, al.action, al.table_name as entity_type,
             al.record_id, al.description, al.created_at,
             ua.username, ua.full_name
      FROM audit_log al
      LEFT JOIN user_account ua ON al.user_id = ua.user_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    // Filter by user_id if provided
    if (user_id) {
      sql += ` AND al.user_id = $${paramIndex++}`
      params.push(parseInt(user_id))
    }

    // Filter by entity_type if provided
    if (entity_type) {
      sql += ` AND al.table_name = $${paramIndex++}`
      params.push(entity_type)
    }

    sql += ` ORDER BY al.created_at DESC LIMIT $${paramIndex++}`
    params.push(limit)

    const result = await query(sql, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTables()
    const body = await request.json()
    const { user_id, action, entity_type, record_id, description } = body

    if (!user_id || !action || !entity_type) {
      return NextResponse.json({ error: 'Missing required fields: user_id, action, entity_type' }, { status: 400 })
    }

    const sql = `
      INSERT INTO audit_log (user_id, action, table_name, record_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    const result = await query(sql, [user_id, action, entity_type, record_id || null, description || null])
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error logging activity:', error)
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureTables()
    await query('DELETE FROM audit_log', [])
    return NextResponse.json({ message: 'Activities cleared successfully', success: true })
  } catch (error) {
    console.error('Error clearing activities:', error)
    return NextResponse.json({ error: 'Failed to clear activities' }, { status: 500 })
  }
}
