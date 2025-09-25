import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { slug } = params

    // Get course with all related data
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(name),
        lessons(id, title, slug, "order"),
        enrollments(count),
        ratings(rating)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !course) {
      return NextResponse.json(
        { error: 'קורס לא נמצא' },
        { status: 404 }
      )
    }

    // Check if user is enrolled (if logged in)
    let isEnrolled = false
    let enrollment = null

    if (session) {
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('progress, status')
        .eq('user_id', session.user.id)
        .eq('course_id', course.id)
        .single()

      if (enrollmentData) {
        isEnrolled = true
        enrollment = enrollmentData
      }
    }

    // Calculate average rating
    const ratings = course.ratings || []
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
      : 0

    // Sort lessons by order
    const sortedLessons = (course.lessons || []).sort((a: any, b: any) => a.order - b.order)

    const transformedCourse = {
      ...course,
      lessons: sortedLessons,
      _count: {
        enrollments: course.enrollments?.length || 0,
        lessons: course.lessons?.length || 0
      },
      averageRating: Math.round(averageRating * 10) / 10,
      isEnrolled,
      enrollment
    }

    return NextResponse.json(transformedCourse)

  } catch (error) {
    console.error('Course detail API error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
}