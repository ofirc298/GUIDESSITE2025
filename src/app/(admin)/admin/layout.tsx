```tsx
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = cookies().get('auth-token')?.value
  if (!token) redirect('/signin')
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    const role = payload.role
    if (role !== 'ADMIN' && role !== 'CONTENT_MANAGER') redirect('/signin')
  } catch {
    redirect('/signin')
  }
  return <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>{children}</div>
}
```