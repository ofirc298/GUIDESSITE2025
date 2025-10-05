import '@/lib/server-hooks'

import { NextRequest, NextResponse } from "next/server";
import { log } from "@/lib/log";

export function withRouteLogging<T = any>(handler: (req: NextRequest, context?: T) => Promise<Response>) {
  return async (req: NextRequest, context?: T) => {
    const start = Date.now();
    const url = req.nextUrl.pathname + req.nextUrl.search;
    try {
      log.info("api", `→ ${req.method} ${url}`);
      const res = await handler(req, context);
      const ms = Date.now() - start;
      log.info("api", `← ${req.method} ${url} ${res.status} in ${ms}ms`);
      return res;
    } catch (e) {
      const ms = Date.now() - start;
      log.error("api", `✖ ${req.method} ${url} failed in ${ms}ms`, (e as Error)?.stack || e);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
}