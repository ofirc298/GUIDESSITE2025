"use client";

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DynamicHeader from '@/components/ui/DynamicHeader'
import Footer from '@/components/ui/Footer'
import { AuthProvider, useAuth } from '@/hooks/useAuth'

function StudentLayoutContent({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
    if (!loading && user && (user.role === 'ADMIN' || user.role === 'CONTENT_MANAGER')) {
      router.push('/admin')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>טוען...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DynamicHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </AuthProvider>
  )
}
