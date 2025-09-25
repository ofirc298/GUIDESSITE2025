'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import styles from './signup.module.css'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('שם מלא נדרש')
      return false
    }
    if (!formData.email.trim()) {
      setError('כתובת אימייל נדרשת')
      return false
    }
    if (formData.password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'אירעה שגיאה')
      }

      setSuccess('החשבון נוצר בהצלחה! מעביר לדף התחברות...')
      setTimeout(() => {
        router.push('/signin')
      }, 2000)

    } catch (error: any) {
      setError(error.message || 'אירעה שגיאה. נסה שוב.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <BookOpen size={32} />
            <span>LearnHub</span>
          </Link>
          <h1>הרשמה</h1>
          <p>צור חשבון חדש והתחל ללמוד היום</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.success}>
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              <User size={16} />
              שם מלא
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="הכנס את השם המלא שלך"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={16} />
              כתובת אימייל
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="הכנס את כתובת האימייל שלך"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              <Lock size={16} />
              סיסמה
            </label>
            <div className={styles.passwordInput}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="בחר סיסמה חזקה"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              <Lock size={16} />
              אימות סיסמה
            </label>
            <div className={styles.passwordInput}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="הכנס את הסיסמה שוב"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.passwordToggle}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'יוצר חשבון...' : 'צור חשבון'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            כבר יש לך חשבון?{' '}
            <Link href="/signin" className={styles.link}>
              התחבר כאן
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}