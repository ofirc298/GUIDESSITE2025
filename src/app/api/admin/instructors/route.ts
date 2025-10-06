import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { data: instructors, error } = await supabase
      .from('instructors')
      .select(`
        *,
        user:users!instructors_user_id_fkey(
          id,
          name,
          email,
          avatar
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(instructors)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch instructors' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, bio, expertise, is_active } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data: instructor, error } = await supabase
      .from('instructors')
      .insert({
        user_id,
        bio: bio || '',
        expertise: expertise || [],
        is_active: is_active ?? true,
        rating: 0,
        total_students: 0
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(instructor, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create instructor' },
      { status: 500 }
    )
  }
}
