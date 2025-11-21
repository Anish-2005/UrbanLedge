import { NextResponse } from 'next/server'
import { query, ensureTables } from '@/lib/db'

export async function GET() {
  try {
    await ensureTables()
    const res = await query(`
      SELECT ua.user_id, ua.username, ua.full_name, ua.email, ua.phone, ua.status, ua.created_at,
             array_agg(r.name) as roles
      FROM user_account ua
      LEFT JOIN user_role ur ON ua.user_id = ur.user_id
      LEFT JOIN role r ON ur.role_id = r.role_id
      GROUP BY ua.user_id
      ORDER BY ua.user_id DESC
    `)
    return NextResponse.json(res.rows)
  } catch (err: any) {
    console.error('GET /api/users error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await ensureTables()
    const body = await req.json()
    const { username, password_hash, full_name, email, phone, roles, status } = body

    // Insert user
    const userRes = await query(
      'INSERT INTO user_account(username, password_hash, full_name, email, phone, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [username, password_hash || 'changeme', full_name, email, phone, status || 'ACTIVE']
    )
    const user = userRes.rows[0]

    // Assign roles
    if (roles && roles.length > 0) {
      for (const roleName of roles) {
        const roleRes = await query('SELECT role_id FROM role WHERE name = $1', [roleName])
        if (roleRes.rows.length > 0) {
          await query('INSERT INTO user_role(user_id, role_id) VALUES($1,$2)', [user.user_id, roleRes.rows[0].role_id])
        }
      }
    }

    return NextResponse.json(user)
  } catch (err: any) {
    console.error('POST /api/users error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    await ensureTables()
    const body = await req.json()
    const { user_id, username, full_name, email, phone, roles, status } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    // Update user
    const userRes = await query(
      'UPDATE user_account SET username=$1, full_name=$2, email=$3, phone=$4, status=$5 WHERE user_id=$6 RETURNING *',
      [username, full_name, email, phone, status || 'ACTIVE', user_id]
    )
    
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update roles
    if (roles) {
      // Delete existing roles
      await query('DELETE FROM user_role WHERE user_id = $1', [user_id])
      
      // Add new roles
      for (const roleName of roles) {
        const roleRes = await query('SELECT role_id FROM role WHERE name = $1', [roleName])
        if (roleRes.rows.length > 0) {
          await query('INSERT INTO user_role(user_id, role_id) VALUES($1,$2)', [user_id, roleRes.rows[0].role_id])
        }
      }
    }

    return NextResponse.json(userRes.rows[0])
  } catch (err: any) {
    console.error('PUT /api/users error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureTables()
    const body = await req.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    // Delete user roles first
    await query('DELETE FROM user_role WHERE user_id = $1', [user_id])
    
    // Delete user
    await query('DELETE FROM user_account WHERE user_id = $1', [user_id])
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/users error', err?.message || err)
    return NextResponse.json({ error: err?.message || 'internal error' }, { status: 500 })
  }
}