```tsx
'use client'

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

type User = { id: string; email: string; name?: string; role: string }
type AuthState = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // בדיקת סשן לקוחית אחרי mount (מונע פער SSR/CSR)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) {
          setUser(data?.user ?? null)
        }
      } catch (e) {
        console.error('session check failed', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      setUser(data?.user ?? null)
      return true
    } catch {
      return false
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }

  const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// תאימות לאתרים שהשתמשו useSession
export function useSession() {
  const { user, loading } = useAuth()
  return {
    data: user ? { user } : null,
    status: loading ? 'loading' : user ? 'authenticated' : 'unauthenticated',
  }
}
```