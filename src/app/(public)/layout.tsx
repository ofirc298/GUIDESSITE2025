import type { ReactNode } from 'react'
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}