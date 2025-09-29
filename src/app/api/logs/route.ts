// src/app/api/logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

// אם קיים supabase client מקומי בפרויקט:
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const POST = withRouteLogging(async (req: NextRequest) => {
  const body = await req.json().catch(() => null)
  if (!body || !body.message) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  const { level = 'error', source = 'client', message, extra = null } = body

  // אם יש Supabase מוכן – שמור לטבלה `logs` (ראה סעיף 5.4)
  try {
    if (supabase) {
      await supabase.from('logs').insert({ level, source, message, extra })
    } else {
      console[level === 'error' ? 'error' : 'log']('[logs-api]', { level, source, message, extra })
    }
  } catch (e) {
    console.error('[logs-api] insert failed', e)
  }

  return NextResponse.json({ ok: true })
})