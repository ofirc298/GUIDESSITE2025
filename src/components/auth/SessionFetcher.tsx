import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AuthProvider from '@/components/providers/AuthProvider'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SessionFetcherProps {
  children: React.ReactNode
}

export default async function SessionFetcher({ children }: SessionFetcherProps) {
  console.log('🔄 SessionFetcher: Fetching session at:', new Date().toISOString())
  
  const session = await getServerSession(authOptions)
  
  console.log('🔄 SessionFetcher: Session fetched:', {
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