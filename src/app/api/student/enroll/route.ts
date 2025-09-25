import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { supabase } from '@/lib/supabase'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const POST = withRouteLogging(async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'לא מחובר' },
        { status: 401 }
      )
    }

    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json(
        { error: 'מזהה קורס נדרש' },
        { status: 400 }
      )
    }

    // Check if course exists and is active
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, is_active')
      .eq('id', courseId)
      .single()

    if (courseError || !course || !course.is_active) {
      return NextResponse.json(
        { error: 'קורס לא נמצא או לא פעיל' },
        { status: 404 }
      )
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('course_id', courseId)
      .single()

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'כבר נרשמת לקורס זה' },
        { status: 400 }
      )
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert([{
        user_id: session.user.id,
        course_id: courseId,
        status: 'ACTIVE',
        progress: 0
      }])
      .select()
      .single()

    if (enrollmentError) {
      console.error('Enrollment error:', enrollmentError)
      return NextResponse.json(
        { error: 'שגיאה בהרשמה לקורס' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'נרשמת בהצלחה לקורס',
      enrollment
    })

  } catch (error) {
    console.error('Enroll API error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
}
)