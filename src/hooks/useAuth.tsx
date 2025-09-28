'use client'
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

type User = { email: string; name?: string; role?: 'GUEST' | 'STUDENT' | 'CONTENT_MANAGER' | 'ADMIN' } | null

type AuthContextValue = {
  user: User
  login: (u: NonNullable<User>) => void
  logout: () => void
  loading: boolean // Add loading state
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true) // Initialize loading to true

  // Fetch session on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const sessionData = await response.json()
          if (sessionData && sessionData.user) {
            setUser(sessionData.user)
          }
        }
      } catch (error) {
      const data = await response.json()
      
      if (response.ok && data.user) {
        setUser(data.user)
        setLoading(false)
      }
    }
    fetchSession()
  }, [])

  const login = (u: NonNullable<User>) => {
    setUser(u)
    // No need for localStorage here, as session is managed by server-side cookie and fetched on mount
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      // Optionally redirect after logout
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = useMemo<AuthContextValue>(() => ({ user, login, logout, loading }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}