import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const GET = withRouteLogging(async (request: NextRequest) => {
  try {
    // Get all active courses with category info and counts
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(name),
        enrollments(count),
        lessons(count),
        ratings(rating)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת הקורסים' },
        { status: 500 }
      )
    }

    // Transform the data to include counts and average rating
    const transformedCourses = courses?.map(course => {
      const ratings = course.ratings || []
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
        : 0

      return {
        ...course,
        _count: {
          enrollments: course.enrollments?.length || 0,
          lessons: course.lessons?.length || 0
        },
        averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal
      }
    }) || []

    return NextResponse.json(transformedCourses)

  } catch (error) {
    console.error('Courses API error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
}
)