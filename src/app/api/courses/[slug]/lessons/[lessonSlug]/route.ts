import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/session'
import { supabase } from '@/lib/supabase'
import { withRouteLogging } from '@/lib/api/withRouteLogging'
import { serialize } from 'next-mdx-remote/serialize'

export const GET = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { slug: string; lessonSlug: string } }
) => {
  try {
    const session = await getServerSession()
    const { slug, lessonSlug } = params

    // First, get the course to ensure it exists and is active
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, is_paid, is_active')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'קורס לא נמצא או לא פעיל' },
        { status: 404 }
      )
    }

    // Then, get the lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, slug, content, order, is_active, course_id')
      .eq('course_id', course.id)
      .eq('slug', lessonSlug)
      .eq('is_active', true)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'שיעור לא נמצא או לא פעיל' },
        { status: 404 }
      )
    }

    // Check enrollment for paid courses
    let isEnrolled = false
    if (session) {
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('course_id', course.id)
        .single()

      if (enrollmentError && enrollmentError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Supabase enrollment check error:', enrollmentError)
        return NextResponse.json(
          { error: 'שגיאה בבדיקת הרשמה' },
          { status: 500 }
        )
      }
      isEnrolled = !!enrollment
    }

    // If course is paid and user is not enrolled, restrict content
    if (course.is_paid && !isEnrolled) {
      return NextResponse.json(
        { error: 'אין גישה לשיעור זה. אנא הירשם לקורס.' },
        { status: 403 }
      )
    }

    // Serialize MDX content
    const mdxSource = lesson.content ? await serialize(lesson.content) : null

    return NextResponse.json({
      ...lesson,
      mdxSource,
      isEnrolled,
      courseSlug: slug,
    })

  } catch (error) {
    console.error('Public Lesson API GET error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})