'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Plus, Search, Filter, CreditCard as Edit, Trash2, Eye, Users, Clock, Star, MoreVertical } from 'lucide-react'
import styles from './courses.module.css'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  price: number
  is_paid: boolean
  is_active: boolean
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  category: {
    name: string
  }
  _count: {
    enrollments: number
    lessons: number
  }
  created_at: string
}

export default function CoursesManagement() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!authLoading && (!sessionUser || (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'CONTENT_MANAGER'))) {
      router.push('/signin')
      return
    }

    fetchCourses()
  }, [session, status, router])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses')
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

  const deleteCourse = async (courseId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הקורס?')) return

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCourses(courses.filter(course => course.id !== courseId))
      }
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  const toggleCourseStatus = async (courseId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !isActive })
      })

      if (response.ok) {
        setCourses(courses.map(course => 
          course.id === courseId 
            ? { ...course, is_active: !isActive }
            : course
        ))
      }
    } catch (error) {
      console.error('Error updating course status:', error)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = !filterLevel || course.level === filterLevel
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && course.is_active) ||
                         (filterStatus === 'inactive' && !course.is_active)
    
    return matchesSearch && matchesLevel && matchesStatus
  })

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

  if (authLoading || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען קורסים...</p>
      </div>
    )
  }
  
  if (!sessionUser || (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'CONTENT_MANAGER')) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>ניהול קורסים</h1>
            <p>נהל את כל הקורסים במערכת</p>
          </div>
          <Link href="/admin/courses/new" className="btn btn-primary">
            <Plus size={20} />
            קורס חדש
          </Link>
        </div>

        {/* Filters */}
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
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">כל הרמות</option>
              <option value="BEGINNER">מתחיל</option>
              <option value="INTERMEDIATE">בינוני</option>
              <option value="ADVANCED">מתקדם</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">כל הסטטוסים</option>
              <option value="active">פעיל</option>
              <option value="inactive">לא פעיל</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className={styles.coursesGrid}>
          {filteredCourses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.cardHeader}>
                <div className={styles.courseInfo}>
                  <h3>{course.title}</h3>
                  <p className={styles.category}>{course.category.name}</p>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionButton}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <p className={styles.description}>{course.description}</p>

              <div className={styles.courseStats}>
                <div className={styles.stat}>
                  <Users size={16} />
                  <span>{course._count.enrollments} סטודנטים</span>
                </div>
                <div className={styles.stat}>
                  <BookOpen size={16} />
                  <span>{course._count.lessons} שיעורים</span>
                </div>
                <div className={styles.stat}>
                  <Clock size={16} />
                  <span>{course.duration} דקות</span>
                </div>
              </div>

              <div className={styles.courseMeta}>
                <div className={styles.badges}>
                  <span 
                    className={styles.levelBadge}
                    style={{ backgroundColor: getLevelColor(course.level) }}
                  >
                    {getLevelText(course.level)}
                  </span>
                  <span className={styles.priceBadge}>
                    {course.is_paid ? `₪${course.price}` : 'חינם'}
                  </span>
                  <span className={`${styles.statusBadge} ${course.is_active ? styles.active : styles.inactive}`}>
                    {course.is_active ? 'פעיל' : 'לא פעיל'}
                  </span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.actionButtons}>
                  <Link href={`/admin/courses/${course.id}`} className={styles.editButton}>
                    <Edit size={16} />
                    ערוך
                  </Link>
                  <Link href={`/courses/${course.slug}`} className={styles.viewButton}>
                    <Eye size={16} />
                    צפה
                  </Link>
                  <button
                    onClick={() => toggleCourseStatus(course.id, course.is_active)}
                    className={styles.toggleButton}
                  >
                    {course.is_active ? 'השבת' : 'הפעל'}
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className={styles.deleteButton}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className={styles.emptyState}>
            <BookOpen size={64} />
            <h3>אין קורסים</h3>
            <p>לא נמצאו קורסים התואמים לחיפוש שלך</p>
            <Link href="/admin/courses/new" className="btn btn-primary">
              <Plus size={20} />
              צור קורס ראשון
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}