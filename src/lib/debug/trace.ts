// Advanced debugging and tracing utilities
type TraceLevel = 'debug' | 'info' | 'warn' | 'error' | 'trace';

interface TraceEntry {
  timestamp: string;
  level: TraceLevel;
  scope: string;
  message: string;
  data?: any;
  stack?: string;
  requestId?: string;
}

class AdvancedTracer {
  private traces: TraceEntry[] = [];
  private maxTraces = 1000;
  private requestId: string | null = null;

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  setRequestId(id?: string) {
    this.requestId = id || this.generateRequestId();
  }

  private addTrace(level: TraceLevel, scope: string, message: string, data?: any) {
    const entry: TraceEntry = {
      timestamp: new Date().toISOString(),
      level,
      scope,
      message,
      data,
      requestId: this.requestId,
    };

    if (level === 'error' || level === 'trace') {
      entry.stack = new Error().stack;
    }

    this.traces.push(entry);
    
    // Keep only recent traces
    if (this.traces.length > this.maxTraces) {
      this.traces = this.traces.slice(-this.maxTraces);
    }

    // Console output with enhanced formatting
    const prefix = `[${entry.timestamp}] ${level.toUpperCase()} [${scope}]${this.requestId ? ` [${this.requestId}]` : ''}`;
    const output = data ? `${prefix} ${message}` : `${prefix} ${message}`;
    
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_TRACE === 'true') {
      switch (level) {
        case 'error':
          console.error(output, data || '');
          if (entry.stack) console.error('Stack:', entry.stack);
          break;
        case 'warn':
          console.warn(output, data || '');
          break;
        case 'trace':
          console.trace(output, data || '');
          break;
        default:
          console.log(output, data || '');
      }
    }
  }

  debug(scope: string, message: string, data?: any) {
    this.addTrace('debug', scope, message, data);
  }

  info(scope: string, message: string, data?: any) {
    this.addTrace('info', scope, message, data);
  }

  warn(scope: string, message: string, data?: any) {
    this.addTrace('warn', scope, message, data);
  }

  error(scope: string, message: string, data?: any) {
    this.addTrace('error', scope, message, data);
  }

  trace(scope: string, message: string, data?: any) {
    this.addTrace('trace', scope, message, data);
  }

  // Get traces for debugging
  getTraces(filter?: { level?: TraceLevel; scope?: string; requestId?: string }): TraceEntry[] {
    if (!filter) return [...this.traces];
    
    return this.traces.filter(trace => {
      if (filter.level && trace.level !== filter.level) return false;
      if (filter.scope && trace.scope !== filter.scope) return false;
      if (filter.requestId && trace.requestId !== filter.requestId) return false;
      return true;
    });
  }

  // Clear traces
  clear() {
    this.traces = [];
  }

  // Export traces for analysis
  export(): string {
    return JSON.stringify(this.traces, null, 2);
  }
}

export const tracer = new AdvancedTracer();

// Enhanced error boundary for catching NextAuth issues
export function withErrorBoundary<T extends (...args: any[]) => any>(
  fn: T,
  scope: string
): T {
  return ((...args: any[]) => {
    try {
      tracer.trace(scope, 'Function called', { args: args.length });
      const result = fn(...args);
      
      // Handle promises
      if (result && typeof result.then === 'function') {
        return result.catch((error: Error) => {
          tracer.error(scope, 'Async function failed', {
            error: error.message,
            stack: error.stack,
            name: error.name
          });
          throw error;
        });
      }
      
      tracer.debug(scope, 'Function completed successfully');
      return result;
    } catch (error) {
      tracer.error(scope, 'Function failed', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        name: (error as Error).name
      });
      throw error;
    }
  }) as T;
}

// Request scope detector
export function detectRequestScope(): boolean {
  try {
    // Try to access headers without actually calling it
    const headersModule = require('next/headers');
    tracer.debug('scope-detector', 'Headers module accessible', { available: !!headersModule });
    return true;
  } catch (error) {
    tracer.warn('scope-detector', 'No request scope available', { error: (error as Error).message });
    return false;
  }
}