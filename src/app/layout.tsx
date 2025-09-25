import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AuthSessionProvider from '@/components/providers/AuthSessionProvider'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'LearnHub - פלטפורמת למידה מתקדמת',
  description: 'פלטפורמה מתקדמת ללמידה מקוונת עם מדריכים איכותיים ומעקב התקדמות אישי',
  keywords: 'למידה, קורסים, מדריכים, חינוך, טכנולוgia',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="he" dir="rtl">
      <body>
        <AuthSessionProvider session={session}>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  )
}