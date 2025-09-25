import type { Metadata } from 'next'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import './globals.css'


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

  return (
    <html lang="he" dir="rtl">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}