import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/session' // Import from new session.ts
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const GET = withRouteLogging(async (request: NextRequest) => {
  try {
    const session = await getServerSession()
    return NextResponse.json(session)
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(null)
  }
})