import { getSafeSession } from '@/lib/auth/safe-auth'
import { tracer } from '@/lib/debug/trace'

/**
 * Returns null when called outside a valid request scope,
 * avoiding the Next.js "headers() outside request" crash.
 */
export async function safeGetServerSession() {
  try {
    tracer.debug('safe-session-legacy', 'Legacy safeGetServerSession called')
    return await getSafeSession()
  } catch (e) {
    tracer.warn('safe-session-legacy', 'Legacy session retrieval failed', { error: (e as Error)?.message })
    return null
  }
}