import type { ReactNode } from 'react'
import { safeGetServerSession } from '@/lib/auth/safe'
import AuthProvider from '@/components/providers/AuthProvider'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { log } from '@/lib/log'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const session = await safeGetServerSession()
  log.debug('layout', 'session', { has: !!session, role: (session as any)?.role })

  return (
    <AuthProvider session={session}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}