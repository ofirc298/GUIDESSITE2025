import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail, setSessionCookie } from '@/lib/auth/session'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const POST = withRouteLogging(async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'אימייל וסיסמה נדרשים' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      )
    }

    // Create session
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }

    await setSessionCookie(sessionUser)

    return NextResponse.json({
      success: true,
      user: sessionUser
    })

  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בהתחברות' },
      { status: 500 }
    )
  }
})