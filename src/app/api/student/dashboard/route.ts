import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/session'
import { supabase } from '@/lib/supabase' // Ensure supabase is imported
import { withRouteLogging } from '@/lib/api/withRouteLogging'

export const GET = withRouteLogging(async (request: NextRequest) => {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json(
        { error: 'לא מחובר' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get enrolled courses with progress
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(
          *,
          category:categories(name),
          lessons(count)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (enrollmentsError) {
      console.error('Enrollments error:', enrollmentsError)
    }

    // Get recent activity (progress records)
    const { data: recentActivity, error: activityError } = await supabase
      .from('progress')
      .select(`
        *,
        lesson:lessons(
          title,
          course:courses(
            title,
            slug
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (activityError) {
      console.error('Activity error:', activityError)
    }

    // Calculate stats
    const totalCourses = enrollments?.length || 0
    const completedCourses = enrollments?.filter(e => e.status === 'COMPLETED').length || 0
    
    // Calculate total hours from enrolled courses
    const totalMinutes = enrollments?.reduce((sum, enrollment) => {
      return sum + (enrollment.course?.duration || 0)
    }, 0) || 0
    const totalHours = Math.round(totalMinutes / 60)

    // Simple streak calculation (days with activity in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentActivityCount = recentActivity?.filter(activity => 
      new Date(activity.created_at) >= sevenDaysAgo
    ).length || 0

    const stats = {
      totalCourses,
      completedCourses,
      totalHours,
      currentStreak: Math.min(recentActivityCount, 7) // Max 7 day streak
    }

    // Transform enrollments to include lesson count
    const transformedEnrollments = enrollments?.map(enrollment => ({
      ...enrollment,
      course: {
        ...enrollment.course,
        _count: {
          lessons: enrollment.course?.lessons?.length || 0
        }
      }
    })) || []

    const dashboardData = {
      enrolledCourses: transformedEnrollments,
      recentActivity: recentActivity || [],
      stats
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בשרת' },
      { status: 500 }
    )
  }
})