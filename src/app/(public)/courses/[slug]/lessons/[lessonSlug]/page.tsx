```tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BookOpen, Lock, Play } from 'lucide-react'
import MdxRenderer from '@/components/ui/MdxRenderer'
import styles from './lesson-detail.module.css'
import { MDXRemoteProps } from 'next-mdx-remote'

interface Lesson {
  id: string
  title: string
  slug: string
  content: string
  order: number
  is_active: boolean
  course_id: string
  mdxSource: MDXRemoteProps['source']
  isEnrolled: boolean
  courseSlug: string
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const courseSlug = params.slug as string
  const lessonSlug = params.lessonSlug as string

  useEffect(() => {
    if (courseSlug && lessonSlug) {
      fetchLesson()
    }
  }, [courseSlug, lessonSlug])

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/courses/${courseSlug}/lessons/${lessonSlug}`)
      if (response.ok) {
        const data = await response.json()
        setLesson(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'שיעור לא נמצא או שגיאה בטעינה')
      }
    } catch (err) {
      console.error('Error fetching lesson:', err)
      setError('שגיאה בטעינת השיעור')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען שיעור...</p>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className={styles.error}>
        <h1>שגיאה</h1>
        <p>{error || 'שיעור לא נמצא'}</p>
        <Link href={`/courses/${courseSlug}`} className="btn btn-primary">
          חזור לקורס
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
          <Link href={`/courses/${courseSlug}`} className={styles.breadcrumbLink}>
            {courseSlug} {/* Replace with actual course title if available */}
          </Link>
          <ArrowRight size={16} />
          <span>{lesson.title}</span>
        </div>

        <div className={styles.lessonLayout}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.lessonHeader}>
              <Play size={48} className={styles.lessonIcon} />
              <h1>{lesson.title}</h1>
            </div>

            <div className={styles.lessonContent}>
              <MdxRenderer source={lesson.mdxSource} />
            </div>
          </div>

          {/* Sidebar (e.g., Next/Prev Lesson, Course Progress) */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3>תוכן הקורס</h3>
              <p>כאן יופיעו שיעורים נוספים בקורס</p>
              {/* Placeholder for next/previous lesson navigation */}
              <div className={styles.navigationButtons}>
                <button className="btn btn-secondary" disabled>שיעור קודם</button>
                <button className="btn btn-primary" disabled>שיעור הבא</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```