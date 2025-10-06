import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: instructor, error } = await supabase
      .from('instructors')
      .select(`
        *,
        user:users!instructors_user_id_fkey(
          id,
          name,
          email,
          avatar
        ),
        courses:course_instructors(
          course:courses(*)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(instructor)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch instructor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { bio, expertise, is_active } = body

    const { data: instructor, error } = await supabase
      .from('instructors')
      .update({
        bio,
        expertise,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(instructor)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update instructor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const { data: instructor, error } = await supabase
      .from('instructors')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(instructor)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update instructor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('instructors')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete instructor' },
      { status: 500 }
    )
  }
}
