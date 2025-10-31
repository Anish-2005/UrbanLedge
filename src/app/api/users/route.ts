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
    const { username, password_hash, full_name, email, phone, roles } = body

    // Insert user
    const userRes = await query(
      'INSERT INTO user_account(username, password_hash, full_name, email, phone) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [username, password_hash, full_name, email, phone]
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