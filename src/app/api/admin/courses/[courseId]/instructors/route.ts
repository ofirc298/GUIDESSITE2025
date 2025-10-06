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
  { params }: { params: { courseId: string } }
) {
  try {
    const { data: courseInstructors, error } = await supabase
      .from('course_instructors')
      .select(`
        id,
        role,
        created_at,
        instructor:instructors(
          id,
          bio,
          expertise,
          rating,
          user:users!instructors_user_id_fkey(
            id,
            name,
            email,
            avatar
          )
        )
      `)
      .eq('course_id', params.courseId)

    if (error) throw error

    return NextResponse.json(courseInstructors || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch course instructors' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const body = await req.json()
    const { instructor_id, role } = body

    if (!instructor_id) {
      return NextResponse.json(
        { error: 'Instructor ID is required' },
        { status: 400 }
      )
    }

    const { data: exists, error: checkError } = await supabase
      .from('course_instructors')
      .select('id')
      .eq('course_id', params.courseId)
      .eq('instructor_id', instructor_id)
      .maybeSingle()

    if (checkError) throw checkError

    if (exists) {
      return NextResponse.json(
        { error: 'Instructor already assigned to this course' },
        { status: 400 }
      )
    }

    const { data: courseInstructor, error } = await supabase
      .from('course_instructors')
      .insert({
        course_id: params.courseId,
        instructor_id,
        role: role || 'lead'
      })
      .select(`
        id,
        role,
        created_at,
        instructor:instructors(
          id,
          bio,
          expertise,
          rating,
          user:users!instructors_user_id_fkey(
            id,
            name,
            email,
            avatar
          )
        )
      `)
      .single()

    if (error) throw error

    return NextResponse.json(courseInstructor, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to assign instructor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const assignmentId = searchParams.get('id')

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('course_instructors')
      .delete()
      .eq('id', assignmentId)
      .eq('course_id', params.courseId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to remove instructor' },
      { status: 500 }
    )
  }
}
