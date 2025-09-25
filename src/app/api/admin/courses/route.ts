import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { supabase } from '@/lib/supabase'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const GET = withRouteLogging(async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    // Get courses with category info and counts
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(name),
        enrollments(count),
        lessons(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת הקורסים' },
        { status: 500 }
      )
    }

    // Transform the data to include counts
    const transformedCourses = courses?.map(course => ({
      ...course,
      _count: {
        enrollments: course.enrollments?.length || 0,
        lessons: course.lessons?.length || 0
      }
    })) || []

    return NextResponse.json(transformedCourses)

  } catch (error) {
    console.error('Courses API error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})

export const POST = withRouteLogging(async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, slug, description, content, price, is_paid, level, category_id, duration } = body

    // Validate required fields
    if (!title || !slug || !category_id) {
      return NextResponse.json(
        { error: 'שדות חובה חסרים' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingCourse) {
      return NextResponse.json(
        { error: 'קורס עם כתובת זו כבר קיים' },
        { status: 400 }
      )
    }

    // Create course
    const { data: course, error } = await supabase
      .from('courses')
      .insert([{
        title,
        slug,
        description: description || '',
        content: content || '',
        price: price || 0,
        is_paid: is_paid || false,
        level: level || 'BEGINNER',
        category_id,
        duration: duration || 0,
        is_active: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה ביצירת הקורס' },
        { status: 500 }
      )
    }

    return NextResponse.json(course, { status: 201 })

  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }