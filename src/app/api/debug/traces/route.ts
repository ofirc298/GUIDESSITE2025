// Debug endpoint to view traces and diagnose issues
import { NextRequest, NextResponse } from 'next/server';
import { withRouteLogging } from '@/lib/api/withRouteLogging';
import { tracer } from '@/lib/debug/trace';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = withRouteLogging(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level') as any;
  const scope = searchParams.get('scope');
  const requestId = searchParams.get('requestId');
  const format = searchParams.get('format') || 'json';

  const traces = tracer.getTraces({ level, scope, requestId });

  if (format === 'text') {
    const textOutput = traces
      .map(trace => `[${trace.timestamp}] ${trace.level.toUpperCase()} [${trace.scope}] ${trace.message}${trace.data ? ' ' + JSON.stringify(trace.data) : ''}`)
      .join('\n');
    
    return new Response(textOutput, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  return NextResponse.json({
    traces,
    count: traces.length,
    filters: { level, scope, requestId }
  });
});

export const DELETE = withRouteLogging(async () => {
  tracer.clear();
  return NextResponse.json({ message: 'Traces cleared' });
});