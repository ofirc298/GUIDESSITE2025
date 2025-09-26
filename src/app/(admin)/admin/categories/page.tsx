'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FolderOpen, Plus, Search, CreditCard as Edit, Trash2, Eye, EyeOff, MoreVertical, BookOpen } from 'lucide-react'
import styles from './categories.module.css'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  _count?: {
    courses: number
  }
}

export default function CategoriesManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
      router.push('/signin')
      return
    }

    fetchCategories()
  }, [session, status, router])

  const fetchCategories = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'פיתוח אתרים',
          slug: 'web-development',
          description: 'קורסים בפיתוח אתרים ואפליקציות',
          order: 1,
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          _count: { courses: 12 }
        },
        {
          id: '2',
          name: 'עיצוב גרפי',
          slug: 'graphic-design',
          description: 'קורסים בעיצוב גרפי ו-UI/UX',
          order: 2,
          is_active: true,
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
          _count: { courses: 8 }
        },
        {
          id: '3',
          name: 'שיווק דיגיטלי',
          slug: 'digital-marketing',
          description: 'קורסים בשיווק דיגיטלי ורשתות חברתיות',
          order: 3,
          is_active: false,
          created_at: '2024-01-05T10:00:00Z',
          updated_at: '2024-01-05T10:00:00Z',
          _count: { courses: 5 }
        }
      ]
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCategoryStatus = async (categoryId: string, isActive: boolean) => {
    try {
      // Mock toggle - replace with actual API call
      setCategories(categories.map(category => 
        category.id === categoryId 
          ? { ...category, is_active: !isActive }
          : category
      ))
    } catch (error) {
      console.error('Error updating category status:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען קטגוריות...</p>
      </div>
    )
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CONTENT_MANAGER')) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>ניהול קטגוריות</h1>
            <p>נהל את כל הקטגוריות במערכת</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={20} />
            קטגוריה חדשה
          </button>
        </div>

        {/* Search */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="חפש קטגוריות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className={styles.categoriesGrid}>
          {filteredCategories.map((category) => (
            <div key={category.id} className={styles.categoryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.categoryInfo}>
                  <div className={styles.categoryIcon}>
                    <FolderOpen size={24} />
                  </div>
                  <div>
                    <h3>{category.name}</h3>
                    <p className={styles.slug}>{category.slug}</p>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionButton}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {category.description && (
                <p className={styles.description}>{category.description}</p>
              )}

              <div className={styles.categoryStats}>
                <div className={styles.stat}>
                  <BookOpen size={16} />
                  <span>{category._count?.courses || 0} קורסים</span>
                </div>
                <div className={styles.stat}>
                  <span>סדר: {category.order}</span>
                </div>
              </div>

              <div className={styles.categoryMeta}>
                <div className={styles.statusBadge}>
                  <span className={`${styles.status} ${category.is_active ? styles.active : styles.inactive}`}>
                    {category.is_active ? (
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
                <span className={styles.date}>
                  {formatDate(category.created_at)}
                </span>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.actionButtons}>
                  <button className={styles.editButton}>
                    <Edit size={16} />
                    ערוך
                  </button>
                  <button
                    onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                    className={styles.toggleButton}
                  >
                    {category.is_active ? 'השבת' : 'הפעל'}
                  </button>
                  <button className={styles.deleteButton}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className={styles.emptyState}>
            <FolderOpen size={64} />
            <h3>אין קטגוריות</h3>
            <p>לא נמצאו קטגוריות התואמות לחיפוש שלך</p>
            <button className="btn btn-primary">
              <Plus size={20} />
              צור קטגוריה ראשונה
            </button>
          </div>
        )}
      </div>
    </div>
  )
}