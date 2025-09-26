```tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Save, BookOpen, AlertCircle, CheckCircle, Play } from 'lucide-react'
import MdxEditor from '@/components/ui/MdxEditor'
import styles from './new-lesson.module.css'

export default function NewLessonPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    order: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [courseTitle, setCourseTitle] = useState('')

  useEffect(() => {
    if (courseId) {
      fetchCourseTitle()
    }
  }, [courseId])

  const fetchCourseTitle = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourseTitle(data.title)
      }
    } catch (err) {
      console.error('Error fetching course title:', err)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, course_id: courseId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה ביצירת השיעור')
      }

      setSuccess('השיעור נוצר בהצלחה!')
      setTimeout(() => {
        router.push(`/admin/courses/${courseId}`)
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
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
            <Link href={`/admin/courses/${courseId}`} className={styles.breadcrumbLink}>
              {courseTitle || 'קורס'}
            </Link>
            <ArrowRight size={16} />
            <span>שיעור חדש</span>
          </div>
          <h1>יצירת שיעור חדש</h1>
          <p>צור שיעור חדש עבור הקורס "{courseTitle}"</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.alert + ' ' + styles.error}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.alert + ' ' + styles.success}>
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <div className={styles.formGrid}>
            {/* Basic Info */}
            <div className={styles.section}>
              <h2>פרטי שיעור</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  <Play size={16} />
                  כותרת השיעור *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={styles.input}
                  placeholder="הכנס כותרת לשיעור"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="slug" className={styles.label}>
                  כתובת URL
                </label>
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className={styles.input}
                  placeholder="lesson-url-slug"
                  disabled={isLoading}
                />
                <small className={styles.hint}>
                  הכתובת תיווצר אוטומטית מהכותרת
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="order" className={styles.label}>
                  סדר תצוגה
                </label>
                <input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Content */}
            <div className={styles.section}>
              <h2>תוכן השיעור</h2>
              <MdxEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Link href={`/admin/courses/${courseId}`} className={styles.cancelButton}>
              ביטול
            </Link>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  יוצר שיעור...
                </>
              ) : (
                <>
                  <Save size={16} />
                  צור שיעור
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```