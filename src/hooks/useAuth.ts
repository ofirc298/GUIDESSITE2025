'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { SessionUser, Session } from '@/lib/auth/session'

interface AuthContextType {
  session: Session | null
  user: SessionUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function useSession() {
  const { session, loading } = useAuth()
  return {
    data: session,
    status: loading ? 'loading' : session ? 'authenticated' : 'unauthenticated'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const sessionData = await response.json()
      setSession(sessionData)
    } catch (error) {
      console.error('Error fetching session:', error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        await fetchSession()
        return true
      }
      return false
    } catch (error) {
      console.error('Sign in error:', error)
      return false
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setSession(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const refreshSession = async () => {
    await fetchSession()
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const value: AuthContextType = {
    session,
    user: session?.user || null,
    loading,
    signIn,
    signOut,
    refreshSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}