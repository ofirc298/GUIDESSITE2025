'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Clock, 
  Play,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react'
import styles from './my-courses.module.css'

interface EnrolledCourse {
  id: string
  progress: number
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED'
  created_at: string
  course: {
    id: string
    title: string
    slug: string
    description: string
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration: number
    category: {
      name: string
    }
    _count: {
      lessons: number
    }
  }
}

export default function MyCourses() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!authLoading && !sessionUser) {
      router.push('/signin')
      return
    }

    if (sessionUser && (sessionUser.role === 'ADMIN' || sessionUser.role === 'CONTENT_MANAGER')) {
      router.push('/admin')
      return
    }

    fetchMyCourses()
  }, [session, status, router])

  const fetchMyCourses = async () => {
    try {
      const response = await fetch('/api/student/my-courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'פעיל'
      case 'COMPLETED': return 'הושלם'
      case 'SUSPENDED': return 'מושהה'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'var(--primary-500)'
      case 'COMPLETED': return 'var(--success-500)'
      case 'SUSPENDED': return 'var(--warning-500)'
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

  // Filter and sort courses
  const filteredAndSortedCourses = courses
    .filter(enrollment => {
      const matchesSearch = enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           enrollment.course.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !filterStatus || enrollment.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'progress':
          return b.progress - a.progress
        case 'title':
          return a.course.title.localeCompare(b.course.title, 'he')
        default:
          return 0
      }
    })

  if (authLoading || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען קורסים...</p>
      </div>
    )
  }
  
  if (!sessionUser) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>הקורסים שלי</h1>
            <p>עקוב אחרי ההתקדמות שלך בכל הקורסים</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <BookOpen size={20} />
              <span>{courses.length} קורסים</span>
            </div>
            <div className={styles.statItem}>
              <Award size={20} />
              <span>{courses.filter(c => c.status === 'COMPLETED').length} הושלמו</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="חפש קורסים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">כל הסטטוסים</option>
              <option value="ACTIVE">פעיל</option>
              <option value="COMPLETED">הושלם</option>
              <option value="SUSPENDED">מושהה</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="recent">לפי תאריך</option>
              <option value="progress">לפי התקדמות</option>
              <option value="title">לפי שם</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredAndSortedCourses.length > 0 ? (
          <div className={styles.coursesGrid}>
            {filteredAndSortedCourses.map((enrollment) => (
              <div key={enrollment.id} className={styles.courseCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.courseInfo}>
                    <h3>{enrollment.course.title}</h3>
                    <p className={styles.category}>{enrollment.course.category.name}</p>
                  </div>
                  <div className={styles.badges}>
                    <span 
                      className={styles.levelBadge}
                      style={{ backgroundColor: getLevelColor(enrollment.course.level) }}
                    >
                      {getLevelText(enrollment.course.level)}
                    </span>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(enrollment.status) }}
                    >
                      {getStatusText(enrollment.status)}
                    </span>
                  </div>
                </div>

                <p className={styles.description}>{enrollment.course.description}</p>

                <div className={styles.courseStats}>
                  <div className={styles.stat}>
                    <BookOpen size={16} />
                    <span>{enrollment.course._count.lessons} שיעורים</span>
                  </div>
                  <div className={styles.stat}>
                    <Clock size={16} />
                    <span>{enrollment.course.duration} דקות</span>
                  </div>
                  <div className={styles.stat}>
                    <Calendar size={16} />
                    <span>נרשמת ב-{formatDate(enrollment.created_at)}</span>
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

                <div className={styles.cardFooter}>
                  <Link 
                    href={`/courses/${enrollment.course.slug}`}
                    className={styles.continueButton}
                  >
                    {enrollment.status === 'COMPLETED' ? (
                      <>
                        <CheckCircle size={16} />
                        סקור שוב
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        {enrollment.progress > 0 ? 'המשך למידה' : 'התחל קורס'}
                      </>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen size={64} />
            <h3>
              {searchTerm || filterStatus 
                ? 'לא נמצאו קורסים התואמים לחיפוש'
                : 'עדיין לא נרשמת לקורסים'
              }
            </h3>
            <p>
              {searchTerm || filterStatus
                ? 'נסה לשנות את הפילטרים או החיפוש'
                : 'התחל את מסע הלמידה שלך עם הקורסים המגוונים שלנו'
              }
            </p>
            {!searchTerm && !filterStatus && (
              <Link href="/courses" className="btn btn-primary">
                עיין בקורסים
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}