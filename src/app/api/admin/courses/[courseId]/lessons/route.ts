```tsx
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth/options'
import { supabase } from '@/lib/supabase'
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const GET = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const session = await getServerSession(getAuthOptions())

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { courseId } = params

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת השיעורים' },
        { status: 500 }
      )
    }

    return NextResponse.json(lessons || [])

  } catch (error) {
    console.error('Admin Lessons API GET error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})

export const POST = withRouteLogging(async (
  request: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const session = await getServerSession(getAuthOptions())

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    const { courseId } = params
    const body = await request.json()
    const { title, slug, content, order } = body

    if (!title || !slug || !courseId) {
      return NextResponse.json(
        { error: 'שדות חובה חסרים: כותרת, סלאג, מזהה קורס' },
        { status: 400 }
      )
    }

    // Check if slug already exists for this course
    const { data: existingLesson } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId)
      .eq('slug', slug)
      .single()

    if (existingLesson) {
      return NextResponse.json(
        { error: 'שיעור עם כתובת זו כבר קיים בקורס זה' },
        { status: 400 }
      )
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert([{
        title,
        slug,
        content: content || '',
        order: order || 0,
        course_id: courseId,
        is_active: true,
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה ביצירת השיעור' },
        { status: 500 }
      )
    }

    return NextResponse.json(lesson, { status: 201 })

  } catch (error) {
    console.error('Admin Lessons API POST error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})
```