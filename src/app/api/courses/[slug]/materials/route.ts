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
  { params }: { params: { slug: string } }
) {
  try {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', params.slug)
      .maybeSingle()

    if (courseError) throw courseError
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const { data: materials, error } = await supabase
      .from('course_materials')
      .select('*')
      .eq('course_id', course.id)
      .eq('is_active', true)
      .order('order', { ascending: true })

    if (error) throw error

    return NextResponse.json(materials || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}
