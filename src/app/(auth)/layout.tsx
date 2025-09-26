import type { ReactNode } from 'react'

// Make sure this layout never prerenders at build-time
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default function AuthLayout({ children }: { children: ReactNode }) { // AuthProvider is now in RootLayout
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}