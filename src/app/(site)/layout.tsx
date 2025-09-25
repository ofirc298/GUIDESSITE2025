import AuthProvider from '@/components/providers/AuthProvider'

export const dynamic = 'force-dynamic'
export const revalidate = 0
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
}
import { getServerSession } from 'next-auth'
    </AuthProvider>
    <AuthProvider session={session}>
}