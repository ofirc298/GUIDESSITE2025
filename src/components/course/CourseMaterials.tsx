'use client'

import { useEffect, useState } from 'react'
import { FileText, Download, BookOpen, Code, FileQuestion, GraduationCap, Lock } from 'lucide-react'
import styles from './CourseMaterials.module.css'

interface Material {
  id: string
  title: string
  description: string
  type: 'exercise' | 'solution' | 'guide' | 'reference' | 'instructor_notes'
  file_url: string
  file_name: string
  order: number
}

interface CourseMaterialsProps {
  courseId: string
  isEnrolled: boolean
}

const materialIcons = {
  exercise: FileQuestion,
  solution: Code,
  guide: BookOpen,
  reference: FileText,
  instructor_notes: GraduationCap
}

const materialLabels = {
  exercise: 'תרגיל',
  solution: 'פתרון',
  guide: 'מדריך',
  reference: 'חומר עזר',
  instructor_notes: 'למדריכים בלבד'
}

const materialColors = {
  exercise: '#3b82f6',
  solution: '#10b981',
  guide: '#f59e0b',
  reference: '#6366f1',
  instructor_notes: '#ec4899'
}

export default function CourseMaterials({ courseId, isEnrolled }: CourseMaterialsProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null)

  useEffect(() => {
    fetchMaterials()
  }, [courseId])

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/materials`)
      if (res.ok) {
        const data = await res.json()
        setMaterials(data)
      }
    } catch (err) {
      console.error('Failed to fetch materials:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const groupedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.type]) {
      acc[material.type] = []
    }
    acc[material.type].push(material)
    return acc
  }, {} as Record<string, Material[]>)

  if (isLoading) {
    return <div className={styles.loading}>טוען חומרי קורס...</div>
  }

  if (materials.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <BookOpen size={28} />
        חומרי תרגול ולמידה
      </h2>

      {!isEnrolled && (
        <div className={styles.lockNotice}>
          <Lock size={20} />
          <p>נרשם לקורס כדי לגשת לחומרי התרגול</p>
        </div>
      )}

      <div className={styles.groups}>
        {Object.entries(groupedMaterials).map(([type, typeMaterials]) => {
          const Icon = materialIcons[type as keyof typeof materialIcons]
          const label = materialLabels[type as keyof typeof materialLabels]
          const color = materialColors[type as keyof typeof materialColors]

          return (
            <div key={type} className={styles.group}>
              <div className={styles.groupHeader} style={{ borderRightColor: color }}>
                <Icon size={24} style={{ color }} />
                <h3 style={{ color }}>{label}</h3>
                <span className={styles.count}>{typeMaterials.length}</span>
              </div>

              <div className={styles.materialsList}>
                {typeMaterials.map((material) => (
                  <div key={material.id} className={styles.materialCard}>
                    <div
                      className={styles.materialHeader}
                      onClick={() => setExpandedMaterial(
                        expandedMaterial === material.id ? null : material.id
                      )}
                      style={{ cursor: isEnrolled ? 'pointer' : 'not-allowed' }}
                    >
                      <div className={styles.materialInfo}>
                        <h4 className={styles.materialTitle}>{material.title}</h4>
                        <p className={styles.materialDescription}>{material.description}</p>
                      </div>
                      {isEnrolled ? (
                        <button className={styles.expandButton}>
                          {expandedMaterial === material.id ? 'סגור' : 'הצג'}
                        </button>
                      ) : (
                        <Lock size={20} className={styles.lockIcon} />
                      )}
                    </div>

                    {isEnrolled && expandedMaterial === material.id && (
                      <div className={styles.materialContent}>
                        <pre className={styles.contentText}>
                          {material.file_url}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
