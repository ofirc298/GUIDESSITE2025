import type { Metadata } from 'next'
import './globals.css'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'LearnHub - פלטפורמת למידה מתקדמת',
  description: 'פלטפורמה מתקדמת ללמידה מקוונת עם מדריכים איכותיים ומעקב התקדמות אישי',
  keywords: 'למידה, קורסים, מדריכים, חינוך, טכנולוגיה',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  )
}