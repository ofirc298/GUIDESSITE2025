"use client";

import type { ReactNode } from 'react'
import DynamicHeader from '@/components/ui/DynamicHeader'
import Footer from '@/components/ui/Footer'
import { AuthProvider } from '@/hooks/useAuth'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <DynamicHeader />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
