'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Plus, X, Trash2 } from 'lucide-react'
import Link from 'next/link'
import styles from '../instructors.module.css'

interface Instructor {
  id: string
  user: {
    name: string
    email: string
  }
  bio: string
  expertise: string[]
  rating: number
  total_students: number
}

interface CourseAssignment {
  id: string
  role: string
  course: {
    id: string
    title: string
    slug: string
  }
}

export default function InstructorCoursesPage() {
  const { user: sessionUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [assignments, setAssignments] = useState<CourseAssignment[]>([])
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedRole, setSelectedRole] = useState('lead')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const instructorId = params.id as string

  useEffect(() => {
    if (authLoading) return
    if (!sessionUser || (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'CONTENT_MANAGER')) {
      router.replace('/signin')
      return
    }
    fetchData()
  }, [sessionUser, authLoading, router, instructorId])

  const fetchData = async () => {
    try {
      const [instructorRes, assignmentsRes, coursesRes] = await Promise.all([
        fetch(`/api/admin/instructors/${instructorId}`),
        fetch(`/api/admin/instructors/${instructorId}/courses`),
        fetch('/api/admin/courses')
      ])

      if (instructorRes.ok) {
        const data = await instructorRes.json()
        setInstructor(data)
      }

      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json()
        setAssignments(data)
      }

      if (coursesRes.ok) {
        const data = await coursesRes.json()
        setAvailableCourses(data)
      }
    } catch (err) {
      setError('שגיאה בטעינת הנתונים')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourse}/instructors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructor_id: instructorId,
          role: selectedRole
        })
      })

      if (!res.ok) throw new Error('Failed to assign')

      fetchData()
      setShowModal(false)
      setSelectedCourse('')
      setSelectedRole('lead')
    } catch (err) {
      alert('שגיאה בשיוך המדריך לקורס')
    }
  }

  const handleRemove = async (assignmentId: string, courseId: string) => {
    if (!confirm('האם אתה בטוח שברצונך להסיר את השיוך?')) return

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/instructors?id=${assignmentId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to remove')

      fetchData()
    } catch (err) {
      alert('שגיאה בהסרת השיוך')
    }
  }

  if (authLoading || isLoading) {
    return <div className={styles.loading}>טוען...</div>
  }

  if (!instructor) {
    return <div className={styles.error}>מדריך לא נמצא</div>
  }

  const assignedCourseIds = assignments.map(a => a.course.id)
  const unassignedCourses = availableCourses.filter(c => !assignedCourseIds.includes(c.id))

  return (
    <div className={styles.container}>
      <Link href="/admin/instructors" className="btn btn-ghost" style={{ marginBottom: '1rem' }}>
        <ArrowRight size={20} />
        חזרה לרשימת מדריכים
      </Link>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>קורסים של {instructor.user.name}</h1>
          <p className={styles.subtitle}>{instructor.user.email}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          שייך לקורס
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {assignments.length === 0 ? (
        <div className={styles.empty}>
          <BookOpen className={styles.emptyIcon} size={64} />
          <p>המדריך עדיין לא שויך לאף קורס</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            שייך לקורס ראשון
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {assignments.map((assignment) => (
            <div key={assignment.id} className={styles.card}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                  {assignment.course.title}
                </h3>
                <span className={styles.tag}>
                  {assignment.role === 'lead' ? 'מדריך ראשי' : 'מדריך עוזר'}
                </span>
              </div>

              <div className={styles.cardActions}>
                <Link
                  href={`/admin/courses/${assignment.course.id}`}
                  className="btn btn-outline btn-sm"
                >
                  <BookOpen size={16} />
                  צפה בקורס
                </Link>
                <button
                  className="btn btn-outline btn-sm btn-danger"
                  onClick={() => handleRemove(assignment.id, assignment.course.id)}
                >
                  <Trash2 size={16} />
                  הסר שיוך
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>שייך מדריך לקורס</h2>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAssign} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>בחר קורס</label>
                <select
                  className={styles.select}
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  <option value="">בחר קורס</option>
                  {unassignedCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>תפקיד</label>
                <select
                  className={styles.select}
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="lead">מדריך ראשי</option>
                  <option value="assistant">מדריך עוזר</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  ביטול
                </button>
                <button type="submit" className="btn btn-primary" disabled={!selectedCourse}>
                  שייך
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
