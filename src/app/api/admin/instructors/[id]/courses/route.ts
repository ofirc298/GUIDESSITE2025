import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: assignments, error } = await supabase
      .from('course_instructors')
      .select(`
        id,
        role,
        created_at,
        course:courses(
          id,
          title,
          slug
        )
      `)
      .eq('instructor_id', params.id)

    if (error) throw error

    return NextResponse.json(assignments || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch instructor courses' },
      { status: 500 }
    )
  }
}
