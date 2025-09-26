import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export interface SessionUser {
  id: string
  email: string
  name?: string
  role: string
}

export interface Session {
  user: SessionUser
  expires: string
}

// Create JWT token
export function createToken(user: SessionUser): string {
  return jwt.sign(
    { 
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    JWT_SECRET
  )
}

// Verify JWT token
export function verifyToken(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
  } catch {
    return null
  }
}

// Get session from cookies (server-side)
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) return null
    
    const user = verifyToken(token)
    if (!user) return null
    
    return {
      user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  } catch {
    return null
  }
}

// Set session cookie
export async function setSessionCookie(user: SessionUser) {
  const token = createToken(user)
  const cookieStore = await cookies()
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 // 24 hours
  })
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// Get user from database
export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name, role, password')
    .eq('email', email)
    .single()

  if (error || !user) return null
  return user
}