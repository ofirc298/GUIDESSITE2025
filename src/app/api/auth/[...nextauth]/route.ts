// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// הכרחי ל-NextAuth: לא לרוץ ב-Edge, לא להיבנות סטטי
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// אין שום קריאות לטופ-לבל של cookies()/headers()/getServerSession().
// רק מייצרים handler ומייצאים GET/POST.
const handler = NextAuth(authOptions)

export async function GET(req: Request, ctx: { params: any }) {
  return handler(req, ctx)
}

export async function POST(req: Request, ctx: { params: any }) {
  return handler(req, ctx)
}