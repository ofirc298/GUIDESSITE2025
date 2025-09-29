'use client'
import React from 'react'
// import { AuthProvider } from '@/hooks/useAuth' // השבת זמנית

export default function Providers({ children }: { children: React.ReactNode }) {
  // החזר את הילדים ישירות, ללא AuthProvider
  return <>{children}</>
  // return <AuthProvider>{children}</AuthProvider> // השבת זמנית
}