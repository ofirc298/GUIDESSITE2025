import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail, setSessionCookie } from '@/lib/auth/session'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const POST = withRouteLogging(async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()

    console.log('[SIGNIN] Attempting login for:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'אימייל וסיסמה נדרשים' },
        { status: 400 }
      )
    }

    // Get user from database
    console.log('[SIGNIN] Fetching user from database...')
    const user = await getUserByEmail(email)
    console.log('[SIGNIN] User found:', user ? 'YES' : 'NO')

    if (!user) {
      console.log('[SIGNIN] User not found in database')
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      )
    }

    console.log('[SIGNIN] User role:', user.role)
    console.log('[SIGNIN] Verifying password...')

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('[SIGNIN] Password valid:', isValidPassword)

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

    console.log('[SIGNIN] Setting session cookie...')
    await setSessionCookie(sessionUser)
    console.log('[SIGNIN] Login successful!')

    return NextResponse.json({
      success: true,
      user: sessionUser
    })

  } catch (error) {
    console.error('[SIGNIN] Sign in error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בהתחברות' },
      { status: 500 }
    )
  }
})