import type { ReactNode } from 'react'
import { getServerSession } from '@/lib/auth/session'
import { AuthProvider } from '@/hooks/useAuth'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession()

  return (
    <AuthProvider>
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