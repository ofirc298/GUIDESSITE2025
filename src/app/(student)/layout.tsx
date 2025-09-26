import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { AuthProvider } from '@/hooks/useAuth'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession()
  
  // Redirect if not authenticated
  if (!session) {
    redirect('/signin')
  }

  // Redirect admins to admin panel
  if (session.user.role === 'ADMIN' || session.user.role === 'CONTENT_MANAGER') {
    redirect('/admin')
  }

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