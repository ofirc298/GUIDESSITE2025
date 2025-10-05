import type { ReactNode } from 'react'
import DynamicHeader from '@/components/ui/DynamicHeader'
import Footer from '@/components/ui/Footer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DynamicHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}