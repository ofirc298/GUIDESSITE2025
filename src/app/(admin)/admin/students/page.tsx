'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Users,
  Search,
  Eye,
  TrendingUp,
  BookOpen,
  Clock,
  Award,
  X
} from 'lucide-react'
import styles from './students.module.css'

interface Student {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  enrollments: Array<{
    id: string
    status: string
    progress: number
    course: {
      title: string
    }
  }>
  total_courses: number
  completed_courses: number
  avg_progress: number
  total_time_spent: number
}

export default function StudentsTrackingPage() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    avgProgress: 0,
    totalEnrollments: 0
  })

  useEffect(() => {
    if (authLoading) return
    if (!sessionUser || (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'CONTENT_MANAGER')) {
      router.replace('/signin')
      return
    }
    fetchStudents()
  }, [sessionUser, authLoading, router])

  useEffect(() => {
    let filtered = students

    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => {
        const hasActive = student.enrollments.some(e => e.status === 'ACTIVE')
        const hasCompleted = student.enrollments.some(e => e.status === 'COMPLETED')
        if (filterStatus === 'active') return hasActive
        if (filterStatus === 'completed') return hasCompleted
        return true
      })
    }

    setFilteredStudents(filtered)
  }, [searchQuery, filterStatus, students])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students/tracking')
      if (!res.ok) throw new Error('Failed to fetch students')
      const data = await res.json()

      setStudents(data.students)
      setFilteredStudents(data.students)
      setStats(data.stats)
    } catch (err) {
      setError('שגיאה בטעינת נתוני התלמידים')
    } finally {
      setIsLoading(false)
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10b981'
    if (progress >= 50) return '#f59e0b'
    return '#ef4444'
  }

  if (authLoading || isLoading) {
    return <div className={styles.loading}>טוען נתוני תלמידים...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Users size={32} />
          מעקב אחרי תלמידים
        </h1>
        <p className={styles.subtitle}>
          צפייה והמעקב אחרי ההתקדמות של כל התלמידים במערכת
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPrimary}`}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>סה"כ תלמידים</p>
            <h3 className={styles.statValue}>{stats.totalStudents}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconSuccess}`}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>תלמידים פעילים</p>
            <h3 className={styles.statValue}>{stats.activeStudents}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconWarning}`}>
            <Award size={24} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>התקדמות ממוצעת</p>
            <h3 className={styles.statValue}>{stats.avgProgress.toFixed(0)}%</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconInfo}`}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>סה"כ רישומים</p>
            <h3 className={styles.statValue}>{stats.totalEnrollments}</h3>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="חפש תלמידים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">כל התלמידים</option>
          <option value="active">פעילים</option>
          <option value="completed">השלימו קורס</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>תלמיד</th>
              <th>קורסים</th>
              <th>השלמה</th>
              <th>התקדמות ממוצעת</th>
              <th>זמן למידה</th>
              <th>תאריך הצטרפות</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  אין תלמידים להצגה
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatar}>
                        {student.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <p className={styles.studentName}>
                          {student.name || 'ללא שם'}
                        </p>
                        <p className={styles.studentEmail}>{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeInfo}`}>
                      {student.total_courses} קורסים
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                      {student.completed_courses} הושלמו
                    </span>
                  </td>
                  <td>
                    <div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${student.avg_progress}%`,
                            background: getProgressColor(student.avg_progress)
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {student.avg_progress.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} />
                      {Math.floor(student.total_time_spent / 60)} שעות
                    </div>
                  </td>
                  <td>
                    {new Date(student.created_at).toLocaleDateString('he-IL')}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye size={16} />
                        פרטים
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  )
}

function StudentDetailModal({ student, onClose }: {
  student: Student
  onClose: () => void
}) {
  return (
    <div className={styles.detailModal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>פרטי תלמיד</h2>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.studentInfo} style={{ marginBottom: '2rem' }}>
          <div className={styles.avatar} style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
            {student.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div>
            <h3 className={styles.studentName} style={{ fontSize: '1.25rem' }}>
              {student.name || 'ללא שם'}
            </h3>
            <p className={styles.studentEmail}>{student.email}</p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>קורסים רשומים ({student.enrollments.length})</h3>
          <div className={styles.coursesList}>
            {student.enrollments.map((enrollment) => (
              <div key={enrollment.id} className={styles.courseCard}>
                <div className={styles.courseInfo}>
                  <h4>{enrollment.course.title}</h4>
                  <p>סטטוס: {enrollment.status === 'ACTIVE' ? 'פעיל' : 'הושלם'}</p>
                </div>
                <div>
                  <div className={styles.progressBar} style={{ width: '150px' }}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {enrollment.progress.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
