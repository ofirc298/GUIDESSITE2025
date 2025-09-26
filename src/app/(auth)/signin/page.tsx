'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import styles from './signin.module.css'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Keep local loading state for form submission
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Call the login function from AuthContext to update client-side state
        signIn(data.user) // Assuming data.user contains { id, email, name, role }
        router.push('/dashboard') // Redirect to dashboard after successful login
      } else {
        setError(data.error || 'אימייל או סיסמה שגויים')
        // Clear password on failed login attempt for security
        setPassword('');
      }
    } catch (error) {
      setError('אירעה שגיאה. נסה שוב.')
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
          <h1>התחברות</h1>
          <p>ברוך הבא חזרה! התחבר לחשבון שלך</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={16} />
              כתובת אימייל
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="הכנס את הסיסמה שלך"
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

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            אין לך חשבון?{' '}
            <Link href="/signup" className={styles.link}>
              הרשם כאן
            </Link>
          </p>
          <Link href="/forgot-password" className={styles.link}>
            שכחת סיסמה?
          </Link>
        </div>
      </div>
    </div>
  )
}