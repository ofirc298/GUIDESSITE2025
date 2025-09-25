import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

console.log('🔧 Auth options loaded at:', new Date().toISOString())
console.log('🔧 Environment check:')
console.log('  - NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET')
console.log('  - NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')
console.log('  - NODE_ENV:', process.env.NODE_ENV)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 Authorize function called with:', {
          email: credentials?.email || 'NO EMAIL',
          hasPassword: !!credentials?.password,
          timestamp: new Date().toISOString()
        })

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        // Demo authentication - replace with real logic later
        if (
          credentials.email === 'demo@site.com' &&
          credentials.password === 'demo123'
        ) {
          console.log('✅ Demo user authenticated successfully')
          return {
            id: '1',
            email: 'demo@site.com',
            name: 'Demo User',
            role: 'STUDENT',
          }
        }

        // Admin demo user
        if (
          credentials.email === 'admin@site.com' &&
          credentials.password === 'admin123'
        ) {
          console.log('✅ Admin user authenticated successfully')
          return {
            id: '2',
            email: 'admin@site.com',
            name: 'Admin User',
            role: 'ADMIN',
          }
        }

        console.log('❌ Invalid credentials')
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎫 JWT callback called:', {
        hasToken: !!token,
        hasUser: !!user,
        tokenSub: token?.sub,
        userRole: user?.role,
        timestamp: new Date().toISOString()
      })

      if (user) {
        console.log('🎫 Adding user role to token:', user.role)
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      console.log('👤 Session callback called:', {
        hasSession: !!session,
        hasToken: !!token,
        tokenSub: token?.sub,
        tokenRole: token?.role,
        timestamp: new Date().toISOString()
      })

      if (token) {
        console.log('👤 Setting session user data from token')
        session.user.id = token.sub!
        session.user.role = token.role as string
      }

      console.log('👤 Final session:', {
        userId: session.user?.id,
        userEmail: session.user?.email,
        userRole: session.user?.role
      })

      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.log('🚨 NextAuth Error:', { code, metadata })
    },
    warn(code) {
      console.log('⚠️ NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.log('🐛 NextAuth Debug:', { code, metadata })
    }
  }
}