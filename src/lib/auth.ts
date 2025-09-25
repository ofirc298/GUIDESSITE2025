import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

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

        // Query user from Supabase
        let user, error
        try {
          console.log('🔍 Querying Supabase for user:', credentials.email)
          const result = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()
          
          user = result.data
          error = result.error
          console.log('📊 Supabase query result:', {
            hasUser: !!user,
            error: error?.message || 'none',
            userId: user?.id || 'none'
          })
        } catch (supabaseError) {
          console.log('❌ Supabase error:', supabaseError)
          return null
        }

        if (error || !user) {
          console.log('❌ User not found or error occurred')
          return null
        }

        // Verify password
        let isPasswordValid
        try {
          console.log('🔒 Verifying password for user:', user.id)
          isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )
          console.log('🔒 Password verification result:', isPasswordValid)
        } catch (bcryptError) {
          console.log('❌ Bcrypt error:', bcryptError)
          return null
        }

        if (!isPasswordValid) {
          console.log('❌ Invalid password')
          return null
        }

        console.log('✅ User authenticated successfully:', {
          id: user.id,
          email: user.email,
          role: user.role
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
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