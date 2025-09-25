'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowRight, 
  Save, 
  Eye, 
  BookOpen,
  DollarSign,
  Clock,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import styles from './new-course.module.css'

interface Category {
  id: string
  name: string
}

export default function NewCourse() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    price: 0,
    is_paid: false,
    level: 'BEGINNER',
    category_id: '',
    duration: 0
  })

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '') // Keep Hebrew, English, numbers, spaces, hyphens
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
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה ביצירת הקורס')
      }

      setSuccess('הקורס נוצר בהצלחה!')
      setTimeout(() => {
        router.push('/admin/courses')
      }, 2000)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Load categories on mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

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
            <span>קורס חדש</span>
          </div>
          <h1>יצירת קורס חדש</h1>
          <p>צור קורס חדש עם תוכן איכותי ומעקב התקדמות</p>
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
              <h2>מידע בסיסי</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  <BookOpen size={16} />
                  כותרת הקורס *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={styles.input}
                  placeholder="הכנס כותרת מעניינת לקורס"
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
                  placeholder="course-url-slug"
                  disabled={isLoading}
                />
                <small className={styles.hint}>
                  הכתובת תיווצר אוטומטית מהכותרת
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  תיאור קצר *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={styles.textarea}
                  placeholder="תיאור קצר ומעניין של הקורס"
                  rows={3}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="content" className={styles.label}>
                  תוכן הקורס
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className={styles.textarea}
                  placeholder="תוכן מפורט של הקורס, מטרות למידה, דרישות קדם..."
                  rows={8}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Course Settings */}
            <div className={styles.section}>
              <h2>הגדרות קורס</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="category_id" className={styles.label}>
                  קטגוריה *
                </label>
                <select
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className={styles.select}
                  required
                  disabled={isLoading}
                >
                  <option value="">בחר קטגוריה</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="level" className={styles.label}>
                  רמת קושי
                </label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className={styles.select}
                  disabled={isLoading}
                >
                  <option value="BEGINNER">מתחיל</option>
                  <option value="INTERMEDIATE">בינוני</option>
                  <option value="ADVANCED">מתקדם</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="duration" className={styles.label}>
                  <Clock size={16} />
                  משך הקורס (דקות)
                </label>
                <input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className={styles.input}
                  placeholder="120"
                  min="0"
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkbox}>
                  <input
                    id="is_paid"
                    type="checkbox"
                    checked={formData.is_paid}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_paid: e.target.checked }))}
                    disabled={isLoading}
                  />
                  <label htmlFor="is_paid">קורס בתשלום</label>
                </div>
              </div>

              {formData.is_paid && (
                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>
                    <DollarSign size={16} />
                    מחיר (₪)
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className={styles.input}
                    placeholder="299"
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/admin/courses" className={styles.cancelButton}>
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
                  יוצר קורס...
                </>
              ) : (
                <>
                  <Save size={16} />
                  צור קורס
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}