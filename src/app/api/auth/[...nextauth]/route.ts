// Force dynamic rendering for NextAuth API routes
export const dynamic = 'force-dynamic'

console.log('🔧 NextAuth API route loaded at:', new Date().toISOString())

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }