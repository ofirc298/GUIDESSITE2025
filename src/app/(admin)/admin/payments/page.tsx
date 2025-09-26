'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DollarSign, Search, Filter, Calendar, User, BookOpen } from 'lucide-react'
import styles from './payments.module.css'

interface Payment {
  id: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  paypal_order_id?: string
  user_id: string
  course_id?: string
  created_at: string
  user_email: string // Mocked
  course_title: string // Mocked
}

export default function PaymentsManagement() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (authLoading) return
    
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      router.push('/signin')
      return
    }

    fetchPayments()
  }, [sessionUser, authLoading, router])

  const fetchPayments = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockPayments: Payment[] = [
        {
          id: 'pay_001', amount: 199.99, currency: 'ILS', status: 'COMPLETED',
          user_id: 'user_1', course_id: 'course_a', created_at: '2024-09-20T10:00:00Z',
          user_email: 'student1@example.com', course_title: 'פיתוח ווב למתחילים'
        },
        {
          id: 'pay_002', amount: 249.00, currency: 'ILS', status: 'PENDING',
          user_id: 'user_2', course_id: 'course_b', created_at: '2024-09-22T11:30:00Z',
          user_email: 'student2@example.com', course_title: 'מבוא לפייתון'
        },
        {
          id: 'pay_003', amount: 99.50, currency: 'ILS', status: 'FAILED',
          user_id: 'user_1', course_id: 'course_c', created_at: '2024-09-23T14:00:00Z',
          user_email: 'student1@example.com', course_title: 'עיצוב UI/UX'
        },
        {
          id: 'pay_004', amount: 300.00, currency: 'ILS', status: 'REFUNDED',
          user_id: 'user_3', course_id: 'course_d', created_at: '2024-09-18T09:00:00Z',
          user_email: 'student3@example.com', course_title: 'שיווק דיגיטלי מתקדם'
        },
      ]
      setPayments(mockPayments)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'ממתין'
      case 'COMPLETED': return 'הושלם'
      case 'FAILED': return 'נכשל'
      case 'REFUNDED': return 'הוחזר'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'var(--warning-500)'
      case 'COMPLETED': return 'var(--success-500)'
      case 'FAILED': return 'var(--error-500)'
      case 'REFUNDED': return 'var(--gray-500)'
      default: return 'var(--gray-500)'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (authLoading || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען תשלומים...</p>
      </div>
    )
  }
  
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return null
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>ניהול תשלומים</h1>
            <p>עקוב אחרי כל התשלומים וההכנסות במערכת</p>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="חפש תשלום לפי אימייל, קורס או מזהה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">כל הסטטוסים</option>
              <option value="COMPLETED">הושלם</option>
              <option value="PENDING">ממתין</option>
              <option value="FAILED">נכשל</option>
              <option value="REFUNDED">הוחזר</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>מזהה תשלום</th>
                <th>משתמש</th>
                <th>קורס</th>
                <th>סכום</th>
                <th>סטטוס</th>
                <th>תאריך</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>
                    <div className={styles.userInfo}>
                      <User size={16} />
                      <span>{payment.user_email}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.courseInfo}>
                      <BookOpen size={16} />
                      <span>{payment.course_title}</span>
                    </div>
                  </td>
                  <td>{payment.amount.toFixed(2)} {payment.currency}</td>
                  <td>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(payment.status) }}
                    >
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      <Calendar size={14} />
                      {formatDate(payment.created_at)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className={styles.emptyState}>
              <DollarSign size={64} />
              <h3>אין תשלומים</h3>
              <p>לא נמצאו תשלומים התואמים לחיפוש</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}