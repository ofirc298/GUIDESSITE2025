import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/session'
import { supabase } from '@/lib/supabase'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const GET = withRouteLogging(async (request: NextRequest) => {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json(
        { error: 'לא מחובר' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get enrolled courses with course details
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(
          *,
          category:categories(name),
          lessons(count)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת הקורסים' },
        { status: 500 }
      )
    }

    // Transform the data to include lesson count
    const transformedEnrollments = enrollments?.map(enrollment => ({
      ...enrollment,
      course: {
        ...enrollment.course,
        _count: {
          lessons: enrollment.course?.lessons?.length || 0
        }
      }
    })) || []

    return NextResponse.json(transformedEnrollments)

  } catch (error) {
    console.error('My courses API error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
}
)