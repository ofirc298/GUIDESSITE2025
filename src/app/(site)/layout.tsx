import AuthProvider from '@/components/providers/AuthProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <AuthProvider session={session}>
      {children}
    </AuthProvider>
  )
}