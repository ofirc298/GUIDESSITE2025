import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== 'production',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo authentication - replace with real logic later
        if (
          credentials.email === 'demo@site.com' &&
          credentials.password === 'demo123'
        ) {
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
          return {
            id: '2',
            email: 'admin@site.com',
            name: 'Admin User',
            role: 'ADMIN',
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {

      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }

      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  }
}