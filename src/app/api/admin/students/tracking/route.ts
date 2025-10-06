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
    const { data: students, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        created_at,
        enrollments:enrollments(
          id,
          status,
          progress,
          course:courses(
            title
          )
        )
      `)
      .eq('role', 'STUDENT')
      .order('created_at', { ascending: false })

    if (error) throw error

    const enrichedStudents = students.map((student: any) => {
      const totalCourses = student.enrollments?.length || 0
      const completedCourses = student.enrollments?.filter((e: any) => e.status === 'COMPLETED').length || 0
      const avgProgress = totalCourses > 0
        ? student.enrollments.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / totalCourses
        : 0

      return {
        ...student,
        total_courses: totalCourses,
        completed_courses: completedCourses,
        avg_progress: avgProgress,
        total_time_spent: 0
      }
    })

    const stats = {
      totalStudents: enrichedStudents.length,
      activeStudents: enrichedStudents.filter((s: any) =>
        s.enrollments?.some((e: any) => e.status === 'ACTIVE')
      ).length,
      avgProgress: enrichedStudents.length > 0
        ? enrichedStudents.reduce((sum: number, s: any) => sum + s.avg_progress, 0) / enrichedStudents.length
        : 0,
      totalEnrollments: enrichedStudents.reduce((sum: number, s: any) => sum + s.total_courses, 0)
    }

    return NextResponse.json({
      students: enrichedStudents,
      stats
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch student tracking data' },
      { status: 500 }
    )
  }
}
