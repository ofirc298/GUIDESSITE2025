import NextAuth from "next-auth"
import { getAuthOptions } from "@/lib/auth/options"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

// פונקציה ליצירת ה-NextAuth handler - נקראת רק כשיש בקשה בפועל
function getAuthHandler() {
  return NextAuth(getAuthOptions())
}

export async function GET(req: Request, ctx: any) {
  const handler = getAuthHandler()
  return handler(req, ctx)
}

export async function POST(req: Request, ctx: any) {
  const handler = getAuthHandler()
  return handler(req, ctx)
}