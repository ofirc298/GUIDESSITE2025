// Safe session endpoint that bypasses NextAuth issues
import { NextRequest, NextResponse } from 'next/server';
import { withRouteLogging } from '@/lib/api/withRouteLogging';
import { safeAuth } from '@/lib/auth/safe-auth';
import { tracer } from '@/lib/debug/trace';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = withRouteLogging(async (request: NextRequest) => {
  tracer.setRequestId();
  tracer.info('safe-session', 'Safe session endpoint called');

  try {
    const session = await safeAuth.getSafeSession();
    
    if (session) {
      tracer.info('safe-session', 'Session found', { userId: session.user.id, role: session.user.role });
      return NextResponse.json(session);
    } else {
      tracer.info('safe-session', 'No session found');
      return NextResponse.json(null);
    }
  } catch (error) {
    tracer.error('safe-session', 'Session retrieval failed', {
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    
    return NextResponse.json(
      { error: 'Session retrieval failed' },
      { status: 500 }
    );
  }
});