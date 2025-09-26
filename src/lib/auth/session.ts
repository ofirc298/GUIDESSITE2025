import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'
import { getServerSession as nextGetServerSession } from "next-auth"
import { getAuthOptions } from './options'

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

// NextAuth session function - only call this inside request handlers
export async function getServerSession() {
  return await nextGetServerSession(getAuthOptions())
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

// Get session from cookies (server-side) - only call inside request handlers
export async function getCustomSession(): Promise<Session | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) return null
    
    const user = verifyToken(token)
    if (!user) return null
    
    return {
      user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  } catch (e) {
    console.error("Error in getCustomSession:", e);
    return null
  }
}

// Set session cookie - only call inside request handlers
export async function setSessionCookie(user: SessionUser) {
  const token = createToken(user)
  const cookieStore = cookies()
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 // 24 hours
  })
}

// Clear session cookie - only call inside request handlers
export async function clearSessionCookie() {
  const cookieStore = cookies()
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