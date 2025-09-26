'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { ArrowRight, BookOpen, Plus, CreditCard as Edit, Trash2, Eye, EyeOff, Clock, Users, MoreVertical, CheckCircle, Play } from 'lucide-react'
import styles from './course-detail-admin.module.css'

interface Course {
  id: string
  title: string
  slug: string
  description: string
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
}

interface Lesson {
  id: string
  title: string
  slug: string
  order: number
  is_active: boolean
}

export default function AdminCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user: sessionUser, loading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const courseId = params.courseId as string

  useEffect(() => {
    if (status === 'loading') return
    
    if (!authLoading && (!sessionUser || (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'CONTENT_MANAGER'))) {
      router.push('/signin')
      return
    }

    if (courseId) {
      fetchCourseDetails()
      fetchLessons()
    }
  }, [courseId, session, status, router])

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
      } else {
        setError('קורס לא נמצא או שגיאה בטעינה')
      }
    } catch (err) {
      console.error('Error fetching course details:', err)
      setError('שגיאה בטעינת פרטי הקורס')
    }
  }

  const fetchLessons = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons`)
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      }
    } catch (err) {
      console.error('Error fetching lessons:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLessonStatus = async (lessonId: string, isActive: boolean) => {
    if (!confirm(`האם אתה בטוח שברצונך ${isActive ? 'להשבית' : 'להפעיל'} את השיעור?`)) return

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        setLessons(prev => prev.map(lesson =>
          lesson.id === lessonId ? { ...lesson, is_active: !isActive } : lesson
        ))
      } else {
        alert('שגיאה בעדכון סטטוס השיעור')
      }
    } catch (err) {
      console.error('Error toggling lesson status:', err)
      alert('שגיאה בעדכון סטטוס השיעור')
    }
  }

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את השיעור?')) return

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLessons(prev => prev.filter(lesson => lesson.id !== lessonId))
      } else {
        alert('שגיאה במחיקת השיעור')
      }
    } catch (err) {
      console.error('Error deleting lesson:', err)
      alert('שגיאה במחיקת השיעור')
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

  if (authLoading || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען פרטי קורס...</p>
      </div>
    )
  }
  
  if (error || !course || !sessionUser) {
    return (
      <div className={styles.error}>
        <h1>שגיאה</h1>
        <p>{error || 'קורס לא נמצא'}</p>
        <Link href="/admin/courses" className="btn btn-primary">
          חזור לניהול קורסים
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/admin" className={styles.breadcrumbLink}>
              פאנל ניהול
            </Link>
            <ArrowRight size={16} />
            <Link href="/admin/courses" className={styles.breadcrumbLink}>
              ניהול קורסים
            </Link>
            <ArrowRight size={16} />
            <span>{course.title}</span>
          </div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className={styles.courseMeta}>
            <span className={styles.category}>{course.category.name}</span>
            <span 
              className={styles.levelBadge}
              style={{ backgroundColor: getLevelColor(course.level) }}
            >
              {getLevelText(course.level)}
            </span>
            <span className={`${styles.statusBadge} ${course.is_active ? styles.active : styles.inactive}`}>
              {course.is_active ? 'פעיל' : 'לא פעיל'}
            </span>
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* Course Details Section */}
          <div className={styles.section}>
            <h2>פרטי קורס</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <strong>Slug:</strong> {course.slug}
              </div>
              <div className={styles.detailItem}>
                <strong>משך:</strong> {course.duration} דקות
              </div>
              <div className={styles.detailItem}>
                <strong>סטודנטים:</strong> {course._count.enrollments}
              </div>
              <div className={styles.detailItem}>
                <strong>שיעורים:</strong> {course._count.lessons}
              </div>
            </div>
            <div className={styles.actions}>
              <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-secondary">
                <Edit size={16} />
                ערוך קורס
              </Link>
              <Link href={`/courses/${course.slug}`} className="btn btn-outline">
                <Eye size={16} />
                צפה בקורס
              </Link>
            </div>
          </div>

          {/* Lessons Management Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>שיעורים</h2>
              <Link href={`/admin/courses/${courseId}/lessons/new`} className="btn btn-primary">
                <Plus size={16} />
                הוסף שיעור
              </Link>
            </div>

            {lessons.length > 0 ? (
              <div className={styles.lessonsList}>
                {lessons.map((lesson) => (
                  <div key={lesson.id} className={styles.lessonItem}>
                    <div className={styles.lessonInfo}>
                      <Play size={20} className={styles.lessonIcon} />
                      <div>
                        <h3>{lesson.title}</h3>
                        <p className={styles.lessonSlug}>{lesson.slug}</p>
                      </div>
                    </div>
                    <div className={styles.lessonActions}>
                      <span className={`${styles.lessonStatus} ${lesson.is_active ? styles.active : styles.inactive}`}>
                        {lesson.is_active ? 'פעיל' : 'לא פעיל'}
                      </span>
                      <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}/edit`} className={styles.actionButton}>
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => toggleLessonStatus(lesson.id, lesson.is_active)} className={styles.actionButton}>
                        {lesson.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => deleteLesson(lesson.id)} className={styles.actionButton}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <BookOpen size={64} />
                <h3>אין שיעורים בקורס זה</h3>
                <p>הוסף שיעורים כדי לבנות את תוכן הקורס</p>
                <Link href={`/admin/courses/${courseId}/lessons/new`} className="btn btn-primary">
                  <Plus size={20} />
                  הוסף שיעור ראשון
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}