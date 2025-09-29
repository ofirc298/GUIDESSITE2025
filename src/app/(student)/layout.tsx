import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StudentLayout({ children }: { children: ReactNode }) {
  let role: string | null = null
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) throw 0
    const payload = jwt.verify(token, JWT_SECRET) as any
    role = payload.role
  } catch {
    redirect('/signin')
  }

  if (role === 'ADMIN' || role === 'CONTENT_MANAGER') {
    redirect('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}