'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BarChart, LineChart, PieChart, TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react'
import styles from './analytics.module.css'

export default function AnalyticsDashboard() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!authLoading && (!sessionUser || sessionUser.role !== 'ADMIN')) {
      router.replace('/signin') // Use replace to avoid back button issues
      return
    }

    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [session, status, router])

  if (authLoading || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען נתוני אנליטיקס...</p>
      </div>
    )
  }
  
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return null
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>אנליטיקס</h1>
            <p>דוחות ונתונים מפורטים על פעילות המערכת</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>משתמשים חדשים (החודש)</h3>
              <p className={styles.statNumber}>120</p>
              <span className={styles.statChange}>+15% מהחודש הקודם</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOpen size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>הרשמות לקורסים (החודש)</h3>
              <p className={styles.statNumber}>350</p>
              <span className={styles.statChange}>+20% מהחודש הקודם</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <DollarSign size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>הכנסות (החודש)</h3>
              <p className={styles.statNumber}>₪15,200</p>
              <span className={styles.statChange}>+10% מהחודש הקודם</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>קורסים פופולריים</h3>
              <p className={styles.statNumber}>פיתוח ווב</p>
              <span className={styles.statChange}>עם 80 הרשמות</span>
            </div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h2>פעילות משתמשים</h2>
            <div className={styles.chartPlaceholder}>
              <LineChart size={64} />
              <p>גרף פעילות משתמשים (נתונים מדומים)</p>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h2>הכנסות לפי חודש</h2>
            <div className={styles.chartPlaceholder}>
              <BarChart size={64} />
              <p>גרף הכנסות חודשיות (נתונים מדומים)</p>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h2>התפלגות קורסים</h2>
            <div className={styles.chartPlaceholder}>
              <PieChart size={64} />
              <p>גרף התפלגות קורסים לפי קטגוריה (נתונים מדומים)</p>
            </div>
          </div>
        </div>

        <div className={styles.emptyState}>
          <TrendingUp size={64} />
          <h3>נתונים נוספים יגיעו בקרוב</h3>
          <p>אנו עובדים על הוספת דוחות אנליטיקס מתקדמים יותר</p>
        </div>
      </div>
    </div>
  )
}