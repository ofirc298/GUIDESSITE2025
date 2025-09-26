'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Settings, Globe, Mail, Key, Save, AlertCircle, CheckCircle } from 'lucide-react'
import styles from './settings.module.css'

export default function SystemSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    siteName: 'LearnHub',
    siteEmail: 'info@learnhub.co.il',
    adminEmail: 'admin@learnhub.co.il',
    allowRegistrations: true,
    maintenanceMode: false,
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/signin')
      return
    }

    // Simulate fetching settings
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [session, status, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you'd send formData to an API endpoint
      console.log('Saving settings:', formData)

      setSuccess('ההגדרות נשמרו בהצלחה!')
    } catch (err: any) {
      setError(err.message || 'שגיאה בשמירת ההגדרות')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען הגדרות מערכת...</p>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>הגדרות מערכת</h1>
            <p>נהל את ההגדרות הכלליות של הפלטפורמה</p>
          </div>
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
            {/* General Settings */}
            <div className={styles.section}>
              <h2>הגדרות כלליות</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="siteName" className={styles.label}>
                  <Globe size={16} />
                  שם האתר
                </label>
                <input
                  id="siteName"
                  name="siteName"
                  type="text"
                  value={formData.siteName}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="siteEmail" className={styles.label}>
                  <Mail size={16} />
                  אימייל אתר
                </label>
                <input
                  id="siteEmail"
                  name="siteEmail"
                  type="email"
                  value={formData.siteEmail}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="adminEmail" className={styles.label}>
                  <Key size={16} />
                  אימייל מנהל ראשי
                </label>
                <input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className={styles.section}>
              <h2>אפשרויות מערכת</h2>
              
              <div className={styles.formGroup}>
                <div className={styles.checkbox}>
                  <input
                    id="allowRegistrations"
                    name="allowRegistrations"
                    type="checkbox"
                    checked={formData.allowRegistrations}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="allowRegistrations">אפשר הרשמות חדשות</label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkbox}>
                  <input
                    id="maintenanceMode"
                    name="maintenanceMode"
                    type="checkbox"
                    checked={formData.maintenanceMode}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="maintenanceMode">מצב תחזוקה</label>
                </div>
                <small className={styles.hint}>
                  האתר יהיה לא זמין למשתמשים רגילים במצב זה.
                </small>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  שומר הגדרות...
                </>
              ) : (
                <>
                  <Save size={16} />
                  שמור הגדרות
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}