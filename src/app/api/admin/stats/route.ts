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

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get total courses
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get total enrollments
    const { count: totalEnrollments } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })

    // Get total revenue (sum of completed payments)
    const { data: revenueData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'COMPLETED')

    const totalRevenue = revenueData?.reduce((sum, payment) => sum + payment.amount, 0) || 0

    // Get active users (users with enrollments in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: activeUsers } = await supabase
      .from('enrollments')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get completed courses (enrollments with 100% progress)
    const { count: completedCourses } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'COMPLETED')

    // Get average rating
    const { data: ratingsData } = await supabase
      .from('ratings')
      .select('rating')

    const averageRating = ratingsData?.length 
      ? (ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length).toFixed(1)
      : 0

    // Get total comments
    const { count: totalComments } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const stats = {
      totalUsers: totalUsers || 0,
      totalCourses: totalCourses || 0,
      totalEnrollments: totalEnrollments || 0,
      totalRevenue: Math.round(totalRevenue),
      activeUsers: activeUsers || 0,
      completedCourses: completedCourses || 0,
      averageRating: parseFloat(averageRating as string) || 0,
      totalComments: totalComments || 0
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'אירעה שגיאה בטעינת הנתונים' },
      { status: 500 }
    )
  }
}
)