import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession()
  
  // Redirect if not authenticated or not admin/content manager
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
    redirect('/signin') // Use redirect from next/navigation
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}