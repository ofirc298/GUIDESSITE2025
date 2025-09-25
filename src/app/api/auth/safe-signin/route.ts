// Safe sign-in endpoint that bypasses NextAuth issues
import { NextRequest, NextResponse } from 'next/server';
import { withRouteLogging } from '@/lib/api/withRouteLogging';
import { safeAuth } from '@/lib/auth/safe-auth';
import { tracer } from '@/lib/debug/trace';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = withRouteLogging(async (request: NextRequest) => {
  tracer.setRequestId();
  tracer.info('safe-signin', 'Safe sign-in endpoint called');

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      tracer.warn('safe-signin', 'Missing credentials');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const session = await safeAuth.authenticateUser(email, password);

    if (session) {
      tracer.info('safe-signin', 'Authentication successful', { 
        email, 
        role: session.user.role 
      });
      
      // In a real app, you'd set cookies here
      return NextResponse.json({
        success: true,
        user: session.user
      });
    } else {
      tracer.warn('safe-signin', 'Authentication failed', { email });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    tracer.error('safe-signin', 'Sign-in failed', {
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    
    return NextResponse.json(
      { error: 'Sign-in failed' },
      { status: 500 }
    );
  }
});