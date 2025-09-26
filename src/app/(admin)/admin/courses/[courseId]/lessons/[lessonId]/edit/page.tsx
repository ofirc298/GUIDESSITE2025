'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Save, BookOpen, AlertCircle, CheckCircle, Play } from 'lucide-react'
import MdxEditor from '@/components/ui/MdxEditor'
import styles from './edit-lesson.module.css'

export default function EditLessonPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string
  const { user: sessionUser, loading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    order: 0,
    is_active: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [courseTitle, setCourseTitle] = useState('')

  useEffect(() => {
    if (!authLoading && (!sessionUser || (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'CONTENT_MANAGER'))) {
      router.replace('/signin')
      return
    }
    if (authLoading) {
      return; // Wait for auth to load
    }
    if (courseId && lessonId) {
      fetchCourseTitle()
      fetchLessonDetails()
    }
  }, [courseId, lessonId])

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

  const fetchLessonDetails = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title,
          slug: data.slug,
          content: data.content || '',
          order: data.order,
          is_active: data.is_active,
        })
      } else {
        setError('שיעור לא נמצא או שגיאה בטעינה')
      }
    } catch (err) {
      console.error('Error fetching lesson details:', err)
      setError('שגיאה בטעינת פרטי השיעור')
    } finally {
      setIsLoading(false)
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
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בעדכון השיעור')
      }

      setSuccess('השיעור עודכן בהצלחה!')
      setTimeout(() => {
        router.push(`/admin/courses/${courseId}`)
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען פרטי שיעור...</p>
      </div>
    )
  }
  
  if (error && !isSubmitting) {
    return (
      <div className={styles.error}>
        <h1>שגיאה</h1>
        <p>{error}</p>
        <Link href={`/admin/courses/${courseId}`} className="btn btn-primary">
          חזור לניהול קורס
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
            <Link href={`/admin/courses/${courseId}`} className={styles.breadcrumbLink}>
              {courseTitle || 'קורס'}
            </Link>
            <ArrowRight size={16} />
            <span>עריכת שיעור</span>
          </div>
          <h1>עריכת שיעור: {formData.title}</h1>
          <p>עדכן את פרטי השיעור עבור הקורס "{courseTitle}"</p>
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkbox}>
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="is_active">שיעור פעיל</label>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={styles.section}>
              <h2>תוכן השיעור</h2>
              <MdxEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  מעדכן שיעור...
                </>
              ) : (
                <>
                  <Save size={16} />
                  עדכן שיעור
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}