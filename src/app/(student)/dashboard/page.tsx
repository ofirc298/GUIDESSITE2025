'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp,
  Play,
  CheckCircle,
  Calendar,
  Target,
  Users,
  Star
} from 'lucide-react'
import styles from './dashboard.module.css'

interface DashboardData {
  enrolledCourses: Array<{
    id: string
    title: string
    slug: string
    description: string
    progress: number
    status: string
    course: {
      title: string
      slug: string
      description: string
      level: string
      duration: number
      category: {
        name: string
      }
      _count: {
        lessons: number
      }
    }
    created_at: string
  }>
  recentActivity: Array<{
    id: string
    lesson: {
      title: string
      course: {
        title: string
        slug: string
      }
    }
    completed: boolean
    created_at: string
  }>
  stats: {
    totalCourses: number
    completedCourses: number
    totalHours: number
    currentStreak: number
  }
}

export default function StudentDashboard() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!authLoading && !sessionUser) {
      router.push('/signin')
      return
    }

    if (sessionUser && (sessionUser.role === 'ADMIN' || sessionUser.role === 'CONTENT_MANAGER')) {
      router.replace('/admin') // Use replace to avoid back button issues
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/student/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'מתחיל'
      case 'INTERMEDIATE': return 'בינוני'
      case 'ADVANCED': return 'מתקדם'
      default: return level
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'var(--success-500)'
      case 'INTERMEDIATE': return 'var(--warning-500)'
      case 'ADVANCED': return 'var(--error-500)'
      default: return 'var(--gray-500)'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (authLoading || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען דשבורד...</p>
      </div>
    )
  }
  
  if (!sessionUser) {
    return null
  }

  return (
    <div className={styles.dashboard}>
      <div className="container">
        {/* Welcome Header */}
        <div className={styles.welcomeHeader}>
          <div>
            <h1>שלום, {sessionUser.name || 'סטודנט'}! 👋</h1>
            <p>ברוך הבא חזרה למסע הלמידה שלך</p>
          </div>
          <div className={styles.quickActions}>
            <Link href="/courses" className="btn btn-primary">
              <BookOpen size={20} />
              עיין בקורסים
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOpen size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>קורסים פעילים</h3>
              <p className={styles.statNumber}>{dashboardData?.stats.totalCourses || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Award size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>קורסים שהושלמו</h3>
              <p className={styles.statNumber}>{dashboardData?.stats.completedCourses || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Clock size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>שעות למידה</h3>
              <p className={styles.statNumber}>{dashboardData?.stats.totalHours || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Target size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>רצף יומי</h3>
              <p className={styles.statNumber}>{dashboardData?.stats.currentStreak || 0}</p>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* My Courses */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>הקורסים שלי</h2>
              <Link href="/my-courses" className={styles.sectionLink}>
                צפה בכל הקורסים
              </Link>
            </div>

            {dashboardData?.enrolledCourses && dashboardData.enrolledCourses.length > 0 ? (
              <div className={styles.coursesGrid}>
                {dashboardData.enrolledCourses.slice(0, 4).map((enrollment) => (
                  <div key={enrollment.id} className={styles.courseCard}>
                    <div className={styles.courseHeader}>
                      <div className={styles.courseInfo}>
                        <h3>{enrollment.course.title}</h3>
                        <p className={styles.category}>{enrollment.course.category.name}</p>
                      </div>
                      <span 
                        className={styles.levelBadge}
                        style={{ backgroundColor: getLevelColor(enrollment.course.level) }}
                      >
                        {getLevelText(enrollment.course.level)}
                      </span>
                    </div>

                    <p className={styles.courseDescription}>
                      {enrollment.course.description}
                    </p>

                    <div className={styles.courseStats}>
                      <div className={styles.stat}>
                        <BookOpen size={16} />
                        <span>{enrollment.course._count.lessons} שיעורים</span>
                      </div>
                      <div className={styles.stat}>
                        <Clock size={16} />
                        <span>{enrollment.course.duration} דקות</span>
                      </div>
                    </div>

                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span>התקדמות</span>
                        <span>{Math.round(enrollment.progress)}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className={styles.courseActions}>
                      <Link 
                        href={`/courses/${enrollment.course.slug}`}
                        className={styles.continueButton}
                      >
                        <Play size={16} />
                        {enrollment.progress > 0 ? 'המשך למידה' : 'התחל קורס'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <BookOpen size={64} />
                <h3>עדיין לא נרשמת לקורסים</h3>
                <p>התחל את מסע הלמידה שלך עם הקורסים המגוונים שלנו</p>
                <Link href="/courses" className="btn btn-primary">
                  עיין בקורסים
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>פעילות אחרונה</h2>
            </div>

            {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
              <div className={styles.activityList}>
                {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {activity.completed ? (
                        <CheckCircle size={20} className={styles.completedIcon} />
                      ) : (
                        <Play size={20} className={styles.inProgressIcon} />
                      )}
                    </div>
                    <div className={styles.activityContent}>
                      <h4>{activity.lesson.title}</h4>
                      <p>
                        {activity.lesson.course.title} • 
                        {activity.completed ? ' הושלם' : ' בתהליך'}
                      </p>
                      <span className={styles.activityDate}>
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                    <Link 
                      href={`/courses/${activity.lesson.course.slug}`}
                      className={styles.activityAction}
                    >
                      צפה
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyActivity}>
                <Calendar size={48} />
                <p>אין פעילות אחרונה</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}