import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { withRouteLogging } from "@/lib/api/withRouteLogging";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withRouteLogging(async () => {
  const c = await cookies();
  const h = await headers();
  return NextResponse.json({
    ok: true,
    hasCookies: !!c,
    userAgent: h.get("user-agent") || null,
    ts: new Date().toISOString(),
  });
});