import NextAuth from "next-auth"
import { getAuthOptions } from "@/lib/auth/options"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: Request, ctx: any) {
  const handler = NextAuth(getAuthOptions())
  return handler(req, ctx)
}

export async function POST(req: Request, ctx: any) {
  const handler = NextAuth(getAuthOptions())
  return handler(req, ctx)
}