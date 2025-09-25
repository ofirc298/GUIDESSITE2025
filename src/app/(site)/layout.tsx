import type { ReactNode } from 'react'
import { safeGetServerSession } from '@/lib/auth/safe'
import AuthProvider from '@/components/providers/AuthProvider'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { tracer } from '@/lib/debug/trace'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default async function SiteLayout({ children }: { children: ReactNode }) {
  tracer.setRequestId()
  tracer.info('site-layout', 'SiteLayout rendering started')
  
  const session = await safeGetServerSession()
  tracer.debug('site-layout', 'Session retrieved', { 
    hasSession: !!session, 
    role: (session as any)?.user?.role 
  })

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