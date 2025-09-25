import { getServerSession } from 'next-auth'
import { authOptions } from './options'

/**
 * Returns null when called outside a valid request scope,
 * avoiding the Next.js "headers() outside request" crash.
 */
export async function safeGetServerSession() {
  try {
    return await getServerSession(authOptions)
  } catch (e) {
    console.log('⚠️ safeGetServerSession: No request scope available or error fetching session, returning null')
    return null
  }
}