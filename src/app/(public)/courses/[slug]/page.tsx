'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  CheckCircle,
  Award,
  ArrowRight,
  DollarSign,
  Lock,
  User
} from 'lucide-react'
import styles from './course-detail.module.css'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  content: string
  price: number
  is_paid: boolean
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  category: {
    name: string
  }
  lessons: Array<{
    id: string
    title: string
    slug: string
    order: number
  }>
  _count: {
    enrollments: number
    lessons: number
  }
  averageRating: number
  isEnrolled: boolean
  enrollment?: {
    progress: number
    status: string
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user: sessionUser, loading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.slug) {
      fetchCourse(params.slug as string)
    }
  }, [params.slug, sessionUser])

  const fetchCourse = async (slug: string) => {
    try {
      const response = await fetch(`/api/courses/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
      } else {
        setError('קורס לא נמצא')
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      setError('שגיאה בטעינת הקורס')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!sessionUser) {
      router.push('/signin')
      return
    }

    setIsEnrolling(true)
    setError('')

    try {
      const response = await fetch('/api/student/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId: course?.id })
      })

      if (response.ok) {
        // Refresh course data to show enrollment
        fetchCourse(params.slug as string)
      } else {
        const data = await response.json()
        setError(data.error || 'שגיאה בהרשמה לקורס')
      }
    } catch (error) {
      setError('שגיאה בהרשמה לקורס')
    } finally {
      setIsEnrolling(false)
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
        <p>טוען קורס...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className={styles.error}>
        <h1>שגיאה</h1>
        <p>{error || 'קורס לא נמצא'}</p>
        <Link href="/courses" className="btn btn-primary">
          חזור לקורסים
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/courses" className={styles.breadcrumbLink}>
            קורסים
          </Link>
          <ArrowRight size={16} />
          <span>{course.category.name}</span>
          <ArrowRight size={16} />
          <span>{course.title}</span>
        </div>

        <div className={styles.courseLayout}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Course Header */}
            <div className={styles.courseHeader}>
              <div className={styles.headerContent}>
                <div className={styles.categoryBadge}>
                  {course.category.name}
                </div>
                <h1>{course.title}</h1>
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
                  <div className={styles.stat}>
                    <span 
                      className={styles.levelBadge}
                      style={{ backgroundColor: getLevelColor(course.level) }}
                    >
                      {getLevelText(course.level)}
                    </span>
                  </div>
                  {course.averageRating > 0 && (
                    <div className={styles.stat}>
                      <Star size={16} />
                      <span>{course.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {course.isEnrolled && course.enrollment && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span>ההתקדמות שלך</span>
                      <span>{Math.round(course.enrollment.progress)}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${course.enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Course Content */}
            <div className={styles.courseContent}>
              <h2>תוכן הקורס</h2>
              <div className={styles.contentText}>
                {course.content ? (
                  <div dangerouslySetInnerHTML={{ __html: course.content.replace(/\n/g, '<br>') }} />
                ) : (
                  <p>תוכן מפורט יתווסף בקרוב...</p>
                )}
              </div>
            </div>

            {/* Lessons List */}
            <div className={styles.lessonsSection}>
              <h2>שיעורי הקורס</h2>
              <div className={styles.lessonsList}>
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className={styles.lessonItem}>
                    <div className={styles.lessonNumber}>
                      {course.isEnrolled ? (
                        <Play size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                      <span>{index + 1}</span>
                    </div>
                    <div className={styles.lessonContent}>
                      <h4>{lesson.title}</h4>
                    </div>
                    {course.isEnrolled && (
                      <div className={styles.lessonStatus}>
                        <CheckCircle size={16} className={styles.completedIcon} />
                      </div>
                    )}
                  </div>
                ))}
                
                {course.lessons.length === 0 && (
                  <div className={styles.noLessons}>
                    <BookOpen size={48} />
                    <p>שיעורים יתווספו בקרוב</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.enrollmentCard}>
              <div className={styles.priceSection}>
                {course.is_paid ? (
                  <div className={styles.price}>
                    <DollarSign size={20} />
                    <span>₪{course.price}</span>
                  </div>
                ) : (
                  <div className={styles.freePrice}>
                    <Award size={20} />
                    <span>חינם</span>
                  </div>
                )}
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              {course.isEnrolled && sessionUser ? (
                <div className={styles.enrolledSection}>
                  <div className={styles.enrolledBadge}>
                    <CheckCircle size={16} />
                    <span>נרשמת לקורס</span>
                  </div>
                  <button className={styles.continueButton}>
                    <Play size={16} />
                    המשך למידה
                  </button>
                </div>
              ) : (
                <div className={styles.enrollSection}>
                  {!sessionUser ? (
                    <div className={styles.loginPrompt}>
                      <User size={16} />
                      <span>התחבר כדי להירשם לקורס</span>
                      <Link href="/signin" className={styles.loginButton}>
                        התחבר
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className={styles.enrollButton}
                    >
                      {isEnrolling ? (
                        <>
                          <div className={styles.spinner}></div>
                          נרשם...
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          הירשם לקורס
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              <div className={styles.courseFeatures}>
                <h4>מה תקבל:</h4>
                <ul>
                  <li>
                    <CheckCircle size={16} />
                    <span>גישה מלאה לכל השיעורים</span>
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    <span>מעקב התקדמות אישי</span>
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    <span>תעודת השלמה</span>
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    <span>גישה לכל החיים</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}