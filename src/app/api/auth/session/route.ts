import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const GET = withRouteLogging(async () => {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json(null)

    const payload = jwt.verify(token, JWT_SECRET) as any
    const session = {
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
      expires: new Date(payload.exp * 1000).toISOString(),
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(null)
  }
})