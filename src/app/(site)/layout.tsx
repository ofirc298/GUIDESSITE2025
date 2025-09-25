import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AuthProvider from '@/components/providers/AuthProvider'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('🔄 SiteLayout: Fetching session at:', new Date().toISOString())
  
  const session = await getServerSession(authOptions)
  
  console.log('🔄 SiteLayout: Session fetched:', {
    hasSession: !!session,
    userId: session?.user?.id,
    userRole: session?.user?.role,
    timestamp: new Date().toISOString()
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