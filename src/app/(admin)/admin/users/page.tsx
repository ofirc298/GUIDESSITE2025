'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Search, Filter, CreditCard as Edit, Trash2, UserPlus, Shield, Mail, Calendar, MoreVertical } from 'lucide-react'
import styles from './users.module.css'

interface User {
  id: string
  name: string
  email: string
  role: 'GUEST' | 'STUDENT' | 'CONTENT_MANAGER' | 'ADMIN'
  avatar?: string
  created_at: string
  updated_at: string
  _count?: {
    enrollments: number
  }
}

export default function UsersManagement() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')

  useEffect(() => {
    if (authLoading) return
    
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      router.push('/signin')
      return
    }

    fetchUsers()
  }, [sessionUser, authLoading, router])

  const fetchUsers = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'דני כהן',
          email: 'danny@example.com',
          role: 'STUDENT',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          _count: { enrollments: 3 }
        },
        {
          id: '2',
          name: 'שרה לוי',
          email: 'sarah@example.com',
          role: 'CONTENT_MANAGER',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
          _count: { enrollments: 0 }
        },
        {
          id: '3',
          name: 'מיכאל רוזן',
          email: 'michael@example.com',
          role: 'ADMIN',
          created_at: '2024-01-05T10:00:00Z',
          updated_at: '2024-01-05T10:00:00Z',
          _count: { enrollments: 0 }
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'מנהל מערכת'
      case 'CONTENT_MANAGER': return 'מנהל תוכן'
      case 'STUDENT': return 'סטודנט'
      case 'GUEST': return 'אורח'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'var(--error-500)'
      case 'CONTENT_MANAGER': return 'var(--warning-500)'
      case 'STUDENT': return 'var(--primary-500)'
      case 'GUEST': return 'var(--gray-500)'
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

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || user.role === filterRole
    return matchesSearch && matchesRole
  })

  if (authLoading || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען משתמשים...</p>
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
            <h1>ניהול משתמשים</h1>
            <p>נהל את כל המשתמשים במערכת</p>
          </div>
          <button className="btn btn-primary">
            <UserPlus size={20} />
            משתמש חדש
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="חפש משתמשים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">כל התפקידים</option>
              <option value="ADMIN">מנהל מערכת</option>
              <option value="CONTENT_MANAGER">מנהל תוכן</option>
              <option value="STUDENT">סטודנט</option>
              <option value="GUEST">אורח</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>משתמש</th>
                <th>תפקיד</th>
                <th>הרשמות</th>
                <th>תאריך הצטרפות</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.userAvatar}>
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <Users size={20} />
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userEmail}>
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className={styles.roleBadge}
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      <Shield size={14} />
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={styles.enrollmentCount}>
                      {user._count?.enrollments || 0} קורסים
                    </span>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      <Calendar size={14} />
                      {formatDate(user.created_at)}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionButton}>
                        <Edit size={16} />
                      </button>
                      <button className={styles.actionButton}>
                        <Trash2 size={16} />
                      </button>
                      <button className={styles.actionButton}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className={styles.emptyState}>
              <Users size={64} />
              <h3>אין משתמשים</h3>
              <p>לא נמצאו משתמשים התואמים לחיפוש</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}