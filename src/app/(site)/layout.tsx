import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AuthSessionProvider from '@/components/providers/AuthSessionProvider'

export const dynamic = 'force-dynamic'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <AuthSessionProvider session={session}>
      {children}
    </AuthSessionProvider>
  )
}