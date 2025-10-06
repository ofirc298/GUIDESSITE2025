import type { ReactNode } from 'react'
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
