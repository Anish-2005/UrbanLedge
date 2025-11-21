import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const entity_type = searchParams.get('entity_type')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100

    const { mockService } = await import('@/lib/mockService')
    let activities = mockService.activities.list()

    // Filter by user_id if provided
    if (user_id) {
      activities = activities.filter(a => a.user_id === user_id)
    }

    // Filter by entity_type if provided
    if (entity_type) {
      activities = activities.filter(a => a.entity_type === entity_type)
    }

    // Limit results
    activities = activities.slice(0, limit)

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { mockService } = await import('@/lib/mockService')
    mockService.activities.clear()
    return NextResponse.json({ message: 'Activities cleared successfully', success: true })
  } catch (error) {
    console.error('Error clearing activities:', error)
    return NextResponse.json({ error: 'Failed to clear activities' }, { status: 500 })
  }
}
