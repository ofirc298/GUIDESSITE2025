'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Search, Plus, Edit, Trash2, Eye, EyeOff, MoreVertical, Calendar } from 'lucide-react'
import styles from './groups.module.css'

interface Group {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
  _count?: {
    members: number // Mocked
  }
}

export default function GroupsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/signin')
      return
    }

    fetchGroups()
  }, [session, status, router])

  const fetchGroups = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockGroups: Group[] = [
        {
          id: 'grp_001', name: 'קבוצת פיתוח ווב', description: 'קבוצה לסטודנטים בפיתוח ווב',
          is_active: true, created_at: '2024-08-01T10:00:00Z', _count: { members: 25 }
        },
        {
          id: 'grp_002', name: 'קבוצת עיצוב גרפי', description: 'קבוצה לסטודנטים בעיצוב',
          is_active: true, created_at: '2024-08-15T11:00:00Z', _count: { members: 18 }
        },
        {
          id: 'grp_003', name: 'קבוצת שיווק דיגיטלי', description: 'קבוצה לסטודנטים בשיווק',
          is_active: false, created_at: '2024-09-01T12:00:00Z', _count: { members: 10 }
        },
      ]
      setGroups(mockGroups)
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleGroupStatus = async (groupId: string, isActive: boolean) => {
    if (!confirm(`האם אתה בטוח שברצונך ${isActive ? 'להשבית' : 'להפעיל'} את הקבוצה?`)) return
    
    try {
      // Simulate API call
      setGroups(prev => prev.map(group =>
        group.id === groupId ? { ...group, is_active: !isActive } : group
      ))
    } catch (error) {
      console.error('Error toggling group status:', error)
    }
  }

  const deleteGroup = async (groupId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הקבוצה?')) return

    try {
      // Simulate API call
      setGroups(prev => prev.filter(group => group.id !== groupId))
    } catch (error) {
      console.error('Error deleting group:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען קבוצות...</p>
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
            <h1>ניהול קבוצות</h1>
            <p>נהל את קבוצות הסטודנטים וההרשאות</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={20} />
            קבוצה חדשה
          </button>
        </div>

        {/* Search */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="חפש קבוצות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Groups Grid */}
        <div className={styles.groupsGrid}>
          {filteredGroups.map((group) => (
            <div key={group.id} className={styles.groupCard}>
              <div className={styles.cardHeader}>
                <div className={styles.groupInfo}>
                  <div className={styles.groupIcon}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3>{group.name}</h3>
                    <p className={styles.description}>{group.description || 'אין תיאור'}</p>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionButton}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.groupStats}>
                <div className={styles.stat}>
                  <Users size={16} />
                  <span>{group._count?.members || 0} חברים</span>
                </div>
                <div className={styles.stat}>
                  <Calendar size={16} />
                  <span>נוצרה ב-{formatDate(group.created_at)}</span>
                </div>
              </div>

              <div className={styles.groupMeta}>
                <div className={styles.statusBadge}>
                  <span className={`${styles.status} ${group.is_active ? styles.active : styles.inactive}`}>
                    {group.is_active ? (
                      <>
                        <Eye size={14} />
                        פעיל
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} />
                        לא פעיל
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.actionButtons}>
                  <button className={styles.editButton}>
                    <Edit size={16} />
                    ערוך
                  </button>
                  <button
                    onClick={() => toggleGroupStatus(group.id, group.is_active)}
                    className={styles.toggleButton}
                  >
                    {group.is_active ? 'השבת' : 'הפעל'}
                  </button>
                  <button onClick={() => deleteGroup(group.id)} className={styles.deleteButton}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className={styles.emptyState}>
            <Users size={64} />
            <h3>אין קבוצות</h3>
            <p>לא נמצאו קבוצות התואמות לחיפוש שלך</p>
            <button className="btn btn-primary">
              <Plus size={20} />
              צור קבוצה ראשונה
            </button>
          </div>
        )}
      </div>
    </div>
  )
}