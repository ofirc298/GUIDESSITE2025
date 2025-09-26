'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Gift, Search, Plus, CreditCard as Edit, Trash2, User, Mail, Calendar, Clock } from 'lucide-react'
import styles from './invite-codes.module.css'

interface InviteCode {
  id: string
  code: string
  email?: string
  group_id?: string
  used_by?: string
  expires_at: string
  created_at: string
  used_at?: string
  group_name?: string // Mocked
  used_by_email?: string // Mocked
}

export default function InviteCodesManagement() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!authLoading && (!sessionUser || sessionUser.role !== 'ADMIN')) {
      router.push('/signin')
      return
    }

    fetchInviteCodes()
  }, [session, status, router])

  const fetchInviteCodes = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockInviteCodes: InviteCode[] = [
        {
          id: 'inv_001', code: 'WELCOME2024', email: 'newuser@example.com',
          expires_at: '2025-12-31T23:59:59Z', created_at: '2024-09-01T10:00:00Z',
          group_id: 'grp_001', group_name: 'קבוצת פיתוח ווב'
        },
        {
          id: 'inv_002', code: 'FREEMDX',
          expires_at: '2024-10-31T23:59:59Z', created_at: '2024-09-10T11:00:00Z',
          used_by: 'user_1', used_at: '2024-09-15T12:00:00Z', used_by_email: 'student1@example.com'
        },
        {
          id: 'inv_003', code: 'ADMINACCESS',
          expires_at: '2025-01-01T00:00:00Z', created_at: '2024-09-20T13:00:00Z',
          group_id: 'grp_002', group_name: 'קבוצת עיצוב גרפי'
        },
      ]
      setInviteCodes(mockInviteCodes)
    } catch (error) {
      console.error('Error fetching invite codes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteInviteCode = async (codeId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את קוד ההזמנה?')) return

    try {
      // Simulate API call
      setInviteCodes(prev => prev.filter(code => code.id !== codeId))
    } catch (error) {
      console.error('Error deleting invite code:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isCodeExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const filteredInviteCodes = inviteCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (code.email && code.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (code.group_name && code.group_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (code.used_by_email && code.used_by_email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = !filterStatus ||
                          (filterStatus === 'active' && !code.used_at && !isCodeExpired(code.expires_at)) ||
                          (filterStatus === 'used' && code.used_at) ||
                          (filterStatus === 'expired' && isCodeExpired(code.expires_at))
    return matchesSearch && matchesStatus
  })

  if (authLoading || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען קודי הזמנה...</p>
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
            <h1>ניהול קודי הזמנה</h1>
            <p>צור ונהל קודי הזמנה למשתמשים וקבוצות</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={20} />
            קוד חדש
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="חפש קוד, אימייל או קבוצה..."
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
              <option value="active">פעיל</option>
              <option value="used">נוצל</option>
              <option value="expired">פג תוקף</option>
            </select>
          </div>
        </div>

        {/* Invite Codes Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>קוד</th>
                <th>מיועד ל</th>
                <th>קבוצה</th>
                <th>נוצל על ידי</th>
                <th>תוקף</th>
                <th>סטטוס</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredInviteCodes.map((code) => (
                <tr key={code.id}>
                  <td>{code.code}</td>
                  <td>
                    {code.email ? (
                      <div className={styles.userInfo}>
                        <Mail size={14} />
                        <span>{code.email}</span>
                      </div>
                    ) : 'כללי'}
                  </td>
                  <td>
                    {code.group_name ? (
                      <div className={styles.groupInfo}>
                        <Users size={14} />
                        <span>{code.group_name}</span>
                      </div>
                    ) : 'אין'}
                  </td>
                  <td>
                    {code.used_by_email ? (
                      <div className={styles.userInfo}>
                        <User size={14} />
                        <span>{code.used_by_email}</span>
                      </div>
                    ) : 'טרם נוצל'}
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      <Clock size={14} />
                      <span>{formatDate(code.expires_at)}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className={styles.statusBadge}
                      style={{ 
                        backgroundColor: code.used_at ? 'var(--gray-500)' : 
                                         isCodeExpired(code.expires_at) ? 'var(--error-500)' : 
                                         'var(--success-500)' 
                      }}
                    >
                      {code.used_at ? 'נוצל' : isCodeExpired(code.expires_at) ? 'פג תוקף' : 'פעיל'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionButton}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteInviteCode(code.id)} className={styles.actionButton}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInviteCodes.length === 0 && (
            <div className={styles.emptyState}>
              <Gift size={64} />
              <h3>אין קודי הזמנה</h3>
              <p>לא נמצאו קודי הזמנה התואמים לחיפוש</p>
              <button className="btn btn-primary">
                <Plus size={20} />
                צור קוד הזמנה ראשון
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}