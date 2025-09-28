import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth/session'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const POST = withRouteLogging(async (request: NextRequest) => {
  try {
    await clearSessionCookie()
    
    return NextResponse.json({
      success: true,
      message: 'התנתקת בהצלחה'
    })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בהתנתקות' },
      { status: 500 }
    )
  }
})