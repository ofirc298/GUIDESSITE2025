import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
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