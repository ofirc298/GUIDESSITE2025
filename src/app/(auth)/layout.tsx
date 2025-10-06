"use client";

import type { ReactNode } from 'react'
import { AuthProvider } from '@/hooks/useAuth'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </AuthProvider>
  )
}