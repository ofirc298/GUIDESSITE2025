import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/session'
import { supabase } from '@/lib/supabase'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const GET = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { courseId } = params

    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(name),
        enrollments(count),
        lessons(count)
      `)
      .eq('id', courseId)
      .single()

    if (error || !course) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'קורס לא נמצא' },
        { status: 404 }
      )
    }

    const transformedCourse = {
      ...course,
      _count: {
        enrollments: course.enrollments?.length || 0,
        lessons: course.lessons?.length || 0
      }
    }

    return NextResponse.json(transformedCourse)

  } catch (error) {
    console.error('Admin Course Detail API GET error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})

export const PATCH = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { courseId } = params
    const body = await request.json()
    const { title, slug, description, content, price, is_paid, is_active, order, duration, level, category_id } = body

    const updateData: { [key: string]: any } = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (content !== undefined) updateData.content = content
    if (price !== undefined) updateData.price = price
    if (is_paid !== undefined) updateData.is_paid = is_paid
    if (is_active !== undefined) updateData.is_active = is_active
    if (order !== undefined) updateData.order = order
    if (duration !== undefined) updateData.duration = duration
    if (level !== undefined) updateData.level = level
    if (category_id !== undefined) updateData.category_id = category_id
    updateData.updated_at = new Date().toISOString()

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'אין נתונים לעדכון' },
        { status: 400 }
      )
    }

    // Check for duplicate slug if slug is being updated
    if (slug !== undefined) {
      const { data: existingCourseWithSlug, error: slugCheckError } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .neq('id', courseId) // Exclude current course
        .single()

      if (slugCheckError && slugCheckError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Supabase slug check error:', slugCheckError)
        return NextResponse.json(
          { error: 'שגיאה בבדיקת סלאג קיים' },
          { status: 500 }
        )
      }
      if (existingCourseWithSlug) {
        return NextResponse.json(
          { error: 'קורס עם כתובת זו כבר קיים' },
          { status: 400 }
        )
      }
    }

    const { data: updatedCourse, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId)
      .select()
      .single()

    if (error || !updatedCourse) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה בעדכון הקורס' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedCourse)

  } catch (error) {
    console.error('Admin Course API PATCH error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})

export const DELETE = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const session = await getServerSession()

    if (!session || session.user.role !== 'ADMIN') { // Only ADMIN can delete
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { courseId } = params

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה במחיקת הקורס' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'הקורס נמחק בהצלחה' }, { status: 200 })

  } catch (error) {
    console.error('Admin Course API DELETE error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})