import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

/**
 * Returns null when called outside a valid request scope,
 * avoiding the Next.js "headers() outside request" crash.
 */
export async function safeGetServerSession() {
  try {
    // Will throw if there is no request scope.
    await headers()
  } catch {
    console.log('⚠️ safeGetServerSession: No request scope available, returning null')
    return null
  }
  
  console.log('✅ safeGetServerSession: Request scope available, fetching session')
  return getServerSession(authOptions)
}