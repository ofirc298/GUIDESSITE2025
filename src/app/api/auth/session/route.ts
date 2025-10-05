import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ user: null })
    }
    const payload: any = jwt.verify(token, JWT_SECRET)
    return NextResponse.json({
      user: { id: payload.sub, email: payload.email, name: payload.name, role: payload.role },
      expires: new Date(payload.exp * 1000).toISOString(),
    })
  } catch (e) {
    try { cookies().delete('auth-token') } catch {}
    return NextResponse.json({ user: null })
  }
}