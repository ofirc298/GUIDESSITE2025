import { getServerSession } from 'next-auth'
import { getAuthOptions } from './options'
import { log } from '@/lib/log'

/**
 * Returns null when called outside a valid request scope,
 * avoiding the Next.js "headers() outside request" crash.
 */
export async function safeGetServerSession() {
  try {
    return await getServerSession(getAuthOptions())
  } catch (e) {
    log.warn('auth', 'safeGetServerSession: No request scope available or error fetching session, returning null', (e as Error)?.message)
    return null
  }
}