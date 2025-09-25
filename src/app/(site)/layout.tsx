import type { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AuthProvider from '@/components/providers/AuthProvider'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </div>
    </SessionGate>
  )
}

// Server Component that runs inside a request
async function SessionGate({ children }: { children: ReactNode }) {
  console.log('🔄 SessionGate: Fetching session at:', new Date().toISOString())
  
  // Calling getServerSession inside a request-scoped async component is valid
  const session = await getServerSession(authOptions)
  
  console.log('🔄 SessionGate: Session fetched:', {
    hasSession: !!session,
    userId: session?.user?.id,
    userRole: session?.user?.role,
    timestamp: new Date().toISOString()
  })

  return <AuthProvider session={session}>{children}</AuthProvider>
}