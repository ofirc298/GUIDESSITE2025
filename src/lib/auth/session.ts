import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

// Server-side JWT session reader (safe: only inside a request scope)
export async function getJwtSession() {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return null
    const payload = jwt.verify(token, JWT_SECRET) as any
    return {
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
      expires: new Date(payload.exp * 1000).toISOString(),
    }
  } catch {
    return null
  }
}

// If NextAuth getServerSession is needed later, keep it commented to avoid circular imports now:
// import { getServerSession as nextGetServerSession } from 'next-auth'
// import { getAuthOptions } from './options'
// export async function getServerSession() {
//   return await nextGetServerSession(getAuthOptions())
// }