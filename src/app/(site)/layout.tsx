import type { ReactNode } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}