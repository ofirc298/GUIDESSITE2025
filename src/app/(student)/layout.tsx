import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession()
  
  // Redirect if not authenticated
  if (!session) {
    redirect('/signin') // Use redirect from next/navigation
  }
  // Redirect admins to admin panel
  if (session.user.role === 'ADMIN' || session.user.role === 'CONTENT_MANAGER') {
    redirect('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}