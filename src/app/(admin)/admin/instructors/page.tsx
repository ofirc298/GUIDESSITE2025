'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Search, Plus, CreditCard as Edit2, Trash2, Star, BookOpen, X } from 'lucide-react'
import styles from './instructors.module.css'

interface Instructor {
  id: string
  user_id: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  bio: string
  expertise: string[]
  is_active: boolean
  rating: number
  total_students: number
  created_at: string
}

export default function InstructorsPage() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!sessionUser || (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'CONTENT_MANAGER')) {
      router.replace('/signin')
      return
    }
    fetchInstructors()
  }, [sessionUser, authLoading, router])

  useEffect(() => {
    if (searchQuery) {
      const filtered = instructors.filter(instructor =>
        instructor.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredInstructors(filtered)
    } else {
      setFilteredInstructors(instructors)
    }
  }, [searchQuery, instructors])

  const fetchInstructors = async () => {
    try {
      const res = await fetch('/api/admin/instructors')
      if (!res.ok) throw new Error('Failed to fetch instructors')
      const data = await res.json()
      setInstructors(data)
      setFilteredInstructors(data)
    } catch (err) {
      setError('שגיאה בטעינת המדריכים')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מדריך זה?')) return

    try {
      const res = await fetch(`/api/admin/instructors/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      fetchInstructors()
    } catch (err) {
      alert('שגיאה במחיקת המדריך')
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/instructors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      })
      if (!res.ok) throw new Error('Failed to update')
      fetchInstructors()
    } catch (err) {
      alert('שגיאה בעדכון הסטטוס')
    }
  }

  if (authLoading || isLoading) {
    return <div className={styles.loading}>טוען מדריכים...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Users size={32} style={{ display: 'inline', marginLeft: '0.5rem' }} />
          ניהול מדריכים
        </h1>
        <button className="btn btn-primary" onClick={() => { setSelectedInstructor(null); setShowModal(true); }}>
          <Plus size={20} />
          הוסף מדריך חדש
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="חפש מדריכים..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredInstructors.length === 0 ? (
        <div className={styles.empty}>
          <Users className={styles.emptyIcon} size={64} />
          <p>אין מדריכים להצגה</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredInstructors.map((instructor) => (
            <div key={instructor.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {instructor.user.name?.[0]?.toUpperCase() || 'M'}
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.instructorName}>{instructor.user.name || 'ללא שם'}</h3>
                  <p className={styles.instructorEmail}>{instructor.user.email}</p>
                  <span className={instructor.is_active ? styles.statusActive : styles.statusInactive}>
                    {instructor.is_active ? 'פעיל' : 'לא פעיל'}
                  </span>
                </div>
              </div>

              {instructor.bio && (
                <p className={styles.bio}>{instructor.bio}</p>
              )}

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <Star size={16} />
                  <span>דירוג: {instructor.rating.toFixed(1)}</span>
                </div>
                <div className={styles.stat}>
                  <Users size={16} />
                  <span>{instructor.total_students} תלמידים</span>
                </div>
              </div>

              {instructor.expertise.length > 0 && (
                <div className={styles.expertise}>
                  {instructor.expertise.map((exp, idx) => (
                    <span key={idx} className={styles.tag}>{exp}</span>
                  ))}
                </div>
              )}

              <div className={styles.cardActions}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => router.push(`/admin/instructors/${instructor.id}`)}
                >
                  <BookOpen size={16} />
                  קורסים
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => { setSelectedInstructor(instructor); setShowModal(true); }}
                >
                  <Edit2 size={16} />
                  ערוך
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => toggleStatus(instructor.id, instructor.is_active)}
                >
                  {instructor.is_active ? 'השבת' : 'הפעל'}
                </button>
                <button
                  className="btn btn-outline btn-sm btn-danger"
                  onClick={() => handleDelete(instructor.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <InstructorModal
          instructor={selectedInstructor}
          onClose={() => { setShowModal(false); setSelectedInstructor(null); }}
          onSave={fetchInstructors}
        />
      )}
    </div>
  )
}

function InstructorModal({ instructor, onClose, onSave }: {
  instructor: Instructor | null
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    user_id: instructor?.user_id || '',
    bio: instructor?.bio || '',
    expertise: instructor?.expertise || [],
    is_active: instructor?.is_active ?? true
  })
  const [newExpertise, setNewExpertise] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error('Failed to fetch users')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = instructor
        ? `/api/admin/instructors/${instructor.id}`
        : '/api/admin/instructors'

      const res = await fetch(url, {
        method: instructor ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save')

      onSave()
      onClose()
    } catch (err) {
      alert('שגיאה בשמירת המדריך')
    } finally {
      setIsLoading(false)
    }
  }

  const addExpertise = () => {
    if (newExpertise && !formData.expertise.includes(newExpertise)) {
      setFormData(prev => ({ ...prev, expertise: [...prev.expertise, newExpertise] }))
      setNewExpertise('')
    }
  }

  const removeExpertise = (exp: string) => {
    setFormData(prev => ({ ...prev, expertise: prev.expertise.filter(e => e !== exp) }))
  }

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{instructor ? 'ערוך מדריך' : 'הוסף מדריך חדש'}</h2>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!instructor && (
            <div className={styles.formGroup}>
              <label className={styles.label}>בחר משתמש</label>
              <select
                className={styles.select}
                value={formData.user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                required
              >
                <option value="">בחר משתמש</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>ביוגרפיה</label>
            <textarea
              className={styles.textarea}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="ספר על המדריך..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>תחומי התמחות</label>
            <div className={styles.expertiseInput}>
              <input
                type="text"
                className={styles.input}
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                placeholder="הוסף תחום התמחות"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
              />
              <button type="button" className="btn btn-outline" onClick={addExpertise}>
                <Plus size={20} />
              </button>
            </div>
            {formData.expertise.length > 0 && (
              <div className={styles.expertiseList}>
                {formData.expertise.map((exp, idx) => (
                  <span key={idx} className={styles.expertiseTag}>
                    {exp}
                    <button type="button" onClick={() => removeExpertise(exp)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <span>פעיל</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'שומר...' : 'שמור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
