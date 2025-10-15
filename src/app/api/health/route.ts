import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * Health Check Endpoint
 *
 * Tests the critical components of the application:
 * - Database connectivity
 * - Environment variables
 * - Table access
 * - RLS policies
 *
 * Useful for debugging deployment issues
 */
export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    },
    database: {
      connected: false,
      error: null as string | null,
    },
    tables: {
      users: false,
      categories: false,
      courses: false,
    },
    rls: {
      anonCanReadUsers: false,
      error: null as string | null,
    }
  }

  // Test database connection
  try {
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      checks.database.connected = false
      checks.database.error = error.message
    } else {
      checks.database.connected = true
    }
  } catch (err) {
    checks.database.connected = false
    checks.database.error = err instanceof Error ? err.message : 'Unknown error'
  }

  // Test table access
  if (checks.database.connected) {
    // Test users table
    try {
      const { error } = await supabase
        .from('users')
        .select('id')
        .limit(1)

      checks.tables.users = !error

      if (!error) {
        checks.rls.anonCanReadUsers = true
      } else {
        checks.rls.error = error.message
      }
    } catch (err) {
      checks.tables.users = false
    }

    // Test categories table
    try {
      const { error } = await supabase
        .from('categories')
        .select('id')
        .limit(1)

      checks.tables.categories = !error
    } catch (err) {
      checks.tables.categories = false
    }

    // Test courses table
    try {
      const { error } = await supabase
        .from('courses')
        .select('id')
        .limit(1)

      checks.tables.courses = !error
    } catch (err) {
      checks.tables.courses = false
    }
  }

  // Determine overall health status
  const isHealthy =
    checks.database.connected &&
    checks.tables.users &&
    checks.rls.anonCanReadUsers

  const status = isHealthy ? 'healthy' : 'unhealthy'

  // Return appropriate status code
  const statusCode = isHealthy ? 200 : 503

  return NextResponse.json(
    {
      status,
      checks,
      message: isHealthy
        ? 'All systems operational'
        : 'System experiencing issues. Check the details above.',
      recommendations: getRecommendations(checks)
    },
    { status: statusCode }
  )
}

function getRecommendations(checks: any): string[] {
  const recommendations: string[] = []

  if (!checks.environment.hasSupabaseUrl || !checks.environment.hasSupabaseKey) {
    recommendations.push('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  if (!checks.environment.hasNextAuthSecret) {
    recommendations.push('Missing NEXTAUTH_SECRET environment variable')
  }

  if (!checks.database.connected) {
    recommendations.push('Database connection failed. Verify Supabase project is active and credentials are correct')
  }

  if (checks.database.connected && !checks.tables.users) {
    recommendations.push('Users table not accessible. Run database migrations')
  }

  if (checks.database.connected && !checks.rls.anonCanReadUsers) {
    recommendations.push('RLS policies prevent authentication. Apply migration 20251015070300_fix_users_rls_policies.sql')
  }

  if (checks.database.connected && (!checks.tables.categories || !checks.tables.courses)) {
    recommendations.push('Some tables are missing. Run all database migrations in order')
  }

  if (recommendations.length === 0) {
    recommendations.push('System is healthy and ready for use')
  }

  return recommendations
}
