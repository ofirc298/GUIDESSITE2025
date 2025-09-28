import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret-change-me'

export type UserRole = 'GUEST' | 'STUDENT' | 'CONTENT_MANAGER' | 'ADMIN'

export interface SessionUser {
  id: string
  email: string
  name?: string
  role: UserRole
}

export interface Session {
  user: SessionUser
  expires: string
}

export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name, role, password')
    .eq('email', email)
    .single()

  if (error || !user) return null
  return user
}

export async function setSessionCookie(user: SessionUser) {
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  )
  cookies().set('auth-token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export async function clearSessionCookie() {
  cookies().delete('auth-token')
}

export async function getJwtSession(): Promise<Session | null> {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return null
    const payload = jwt.verify(token, JWT_SECRET) as any
    return {
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
      expires: new Date(payload.exp * 1000).toISOString(),
    }
  } catch {
    return null
  }
}

// Alias for consistency with existing code
export const getServerSession = getJwtSession