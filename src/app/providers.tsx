'use client'

import ErrorBoundary from './ErrorBoundary'
import { AuthProvider } from '@/hooks/useAuth'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  )
}