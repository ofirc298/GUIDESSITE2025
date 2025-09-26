import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import { getUserByEmail } from './session'

export function getAuthOptions(): NextAuthOptions {
  return {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Get user from database
          const user = await getUserByEmail(credentials.email)
          if (!user) return null

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          if (!isValidPassword) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }
      })
    ],
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
          session.user.role = token.role
        }
        return session
      }
    },
    pages: {
      signIn: '/signin'
    }
  }
}