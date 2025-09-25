import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      )
    }

    // Get all active categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת הקטגוריות' },
        { status: 500 }
      )
    }

    return NextResponse.json(categories || [])

  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
}