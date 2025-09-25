// Force Node runtime & disable any static render/prerender
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// IMPORTANT: Do NOT call headers()/cookies()/getServerSession() at module top-level.
// Only export the handler function returned by NextAuth(authOptions).
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }