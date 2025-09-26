// Health check endpoint with comprehensive diagnostics
import { NextRequest, NextResponse } from 'next/server';
import { withRouteLogging } from '@/lib/api/withRouteLogging';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = withRouteLogging(async (request: NextRequest) => {
  tracer.setRequestId();
  tracer.info('health-check', 'Health check started');

  const diagnostics = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      nextHeaders: false,
      nextCookies: false,
      environment: process.env.NODE_ENV,
      nextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    },
    errors: [] as string[]
  };

  // Test headers access
  try {
    const { headers } = await import('next/headers');
    const headerStore = await headers();
    diagnostics.checks.nextHeaders = true;
    tracer.info('health-check', 'Headers access successful');
  } catch (error) {
    diagnostics.checks.nextHeaders = false;
    diagnostics.errors.push(`Headers: ${(error as Error).message}`);
    tracer.error('health-check', 'Headers access failed', { error: (error as Error).message });
  }

  // Test cookies access
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    diagnostics.checks.nextCookies = true;
    tracer.info('health-check', 'Cookies access successful');
  } catch (error) {
    diagnostics.checks.nextCookies = false;
    diagnostics.errors.push(`Cookies: ${(error as Error).message}`);
    tracer.error('health-check', 'Cookies access failed', { error: (error as Error).message });
  }

  // Determine overall status
  if (diagnostics.errors.length > 0) {
    diagnostics.status = 'degraded';
  }

  tracer.info('health-check', 'Health check completed', { 
    status: diagnostics.status, 
    errorCount: diagnostics.errors.length 
  });

  return NextResponse.json(diagnostics);
});