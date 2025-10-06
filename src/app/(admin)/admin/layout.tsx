"use client";

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'
import { useAuth } from '@/hooks/useAuth'

function AdminProtectedContent({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
    if (!loading && user && user.role !== 'ADMIN' && user.role !== 'CONTENT_MANAGER') {
      router.push('/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>טוען...</div>
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'CONTENT_MANAGER')) {
    return null
  }

  return <>{children}</>
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthenticatedLayout>
      <AdminProtectedContent>{children}</AdminProtectedContent>
    </AuthenticatedLayout>
  )
}