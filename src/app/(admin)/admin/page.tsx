'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  Activity,
  Calendar,
  Award,
  MessageSquare
} from 'lucide-react'
import styles from './admin.module.css'

interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalRevenue: number
  activeUsers: number
  completedCourses: number
  averageRating: number
  totalComments: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      router.push('/signin')
      return
    }

    fetchDashboardStats()
  }, [session, status, router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען נתונים...</p>
      </div>
    )
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
    return null
  }

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>פאנל ניהול</h1>
            <p>ברוך הבא, {session.user.name || session.user.email}</p>
          </div>
          <div className={styles.userBadge}>
            <span className={styles.role}>
              {session.user.role === 'ADMIN' ? 'מנהל מערכת' : 'מנהל תוכן'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>סה"כ משתמשים</h3>
              <p className={styles.statNumber}>{stats?.totalUsers || 0}</p>
              <span className={styles.statChange}>+12% מהחודש הקודם</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOpen size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>סה"כ קורסים</h3>
              <p className={styles.statNumber}>{stats?.totalCourses || 0}</p>
              <span className={styles.statChange}>+3 קורסים חדשים</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>הרשמות לקורסים</h3>
              <p className={styles.statNumber}>{stats?.totalEnrollments || 0}</p>
              <span className={styles.statChange}>+25% מהחודש הקודם</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <DollarSign size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>הכנסות החודש</h3>
              <p className={styles.statNumber}>₪{stats?.totalRevenue || 0}</p>
              <span className={styles.statChange}>+18% מהחודש הקודם</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Activity size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>משתמשים פעילים</h3>
              <p className={styles.statNumber}>{stats?.activeUsers || 0}</p>
              <span className={styles.statChange}>השבוע</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Award size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>קורסים שהושלמו</h3>
              <p className={styles.statNumber}>{stats?.completedCourses || 0}</p>
              <span className={styles.statChange}>החודש</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Calendar size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>דירוג ממוצע</h3>
              <p className={styles.statNumber}>{stats?.averageRating || 0}/5</p>
              <span className={styles.statChange}>מכל הקורסים</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <MessageSquare size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>תגובות</h3>
              <p className={styles.statNumber}>{stats?.totalComments || 0}</p>
              <span className={styles.statChange}>החודש</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2>פעולות מהירות</h2>
          <div className={styles.actionsGrid}>
            <a href="/admin/courses" className={styles.actionCard}>
              <BookOpen size={32} />
              <h3>ניהול קורסים</h3>
              <p>צור, ערוך ונהל קורסים</p>
            </a>

            <a href="/admin/users" className={styles.actionCard}>
              <Users size={32} />
              <h3>ניהול משתמשים</h3>
              <p>נהל משתמשים והרשאות</p>
            </a>

            <a href="/admin/categories" className={styles.actionCard}>
              <TrendingUp size={32} />
              <h3>ניהול קטגוריות</h3>
              <p>ארגן קטגוריות וקורסים</p>
            </a>

            <a href="/admin/analytics" className={styles.actionCard}>
              <Activity size={32} />
              <h3>אנליטיקס</h3>
              <p>דוחות ונתונים מפורטים</p>
            </a>

            {session.user.role === 'ADMIN' && (
              <>
                <a href="/admin/payments" className={styles.actionCard}>
                  <DollarSign size={32} />
                  <h3>ניהול תשלומים</h3>
                  <p>עקוב אחרי תשלומים והכנסות</p>
                </a>

                <a href="/admin/settings" className={styles.actionCard}>
                  <Award size={32} />
                  <h3>הגדרות מערכת</h3>
                  <p>הגדרות כלליות ותצורה</p>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}