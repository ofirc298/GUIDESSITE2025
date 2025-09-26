```tsx
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth/options'
import { supabase } from '@/lib/supabase'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const GET = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) => {
  try {
    const session = await getServerSession(getAuthOptions())

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { courseId, lessonId } = params

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('id', lessonId)
      .single()

    if (error || !lesson) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שיעור לא נמצא' },
        { status: 404 }
      )
    }

    return NextResponse.json(lesson)

  } catch (error) {
    console.error('Admin Lesson API GET error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})

export const PATCH = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) => {
  try {
    const session = await getServerSession(getAuthOptions())

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { courseId, lessonId } = params
    const body = await request.json()
    const { title, slug, content, order, is_active } = body

    const updateData: { [key: string]: any } = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (content !== undefined) updateData.content = content
    if (order !== undefined) updateData.order = order
    if (is_active !== undefined) updateData.is_active = is_active
    updateData.updated_at = new Date().toISOString()

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'אין נתונים לעדכון' },
        { status: 400 }
      )
    }

    // Check for duplicate slug if slug is being updated
    if (slug !== undefined) {
      const { data: existingLessonWithSlug, error: slugCheckError } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)
        .eq('slug', slug)
        .neq('id', lessonId) // Exclude current lesson
        .single()

      if (slugCheckError && slugCheckError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Supabase slug check error:', slugCheckError)
        return NextResponse.json(
          { error: 'שגיאה בבדיקת סלאג קיים' },
          { status: 500 }
        )
      }
      if (existingLessonWithSlug) {
        return NextResponse.json(
          { error: 'שיעור עם כתובת זו כבר קיים בקורס זה' },
          { status: 400 }
        )
      }
    }

    const { data: updatedLesson, error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('course_id', courseId)
      .eq('id', lessonId)
      .select()
      .single()

    if (error || !updatedLesson) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה בעדכון השיעור' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedLesson)

  } catch (error) {
    console.error('Admin Lesson API PATCH error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})

export const DELETE = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) => {
  try {
    const session = await getServerSession(getAuthOptions())

    if (!session || session.user.role !== 'ADMIN') { // Only ADMIN can delete
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { courseId, lessonId } = params

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('course_id', courseId)
      .eq('id', lessonId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה במחיקת השיעור' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'השיעור נמחק בהצלחה' }, { status: 200 })

  } catch (error) {
    console.error('Admin Lesson API DELETE error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})
```