"use client";

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Search, 
  Filter,
  Clock,
  Users,
  Star,
  Play,
  Award,
  TrendingUp
} from 'lucide-react'
import styles from './courses.module.css'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  price: number
  is_paid: boolean
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  category: {
    name: string
  }
  _count: {
    enrollments: number
    lessons: number
  }
  averageRating: number
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [priceFilter, setPriceFilter] = useState('')

  useEffect(() => {
    fetchCourses()
    fetchCategories()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'מתחיל'
      case 'INTERMEDIATE': return 'בינוני'
      case 'ADVANCED': return 'מתקדם'
      default: return level
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'var(--success-500)'
      case 'INTERMEDIATE': return 'var(--warning-500)'
      case 'ADVANCED': return 'var(--error-500)'
      default: return 'var(--gray-500)'
    }
  }

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || course.category.name === selectedCategory
    const matchesLevel = !selectedLevel || course.level === selectedLevel
    const matchesPrice = !priceFilter || 
                        (priceFilter === 'free' && !course.is_paid) ||
                        (priceFilter === 'paid' && course.is_paid)
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice
  })

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען קורסים...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>גלה את הקורסים שלנו</h1>
            <p>למד מהמומחים הטובים ביותר עם קורסים איכותיים ומעודכנים</p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <BookOpen size={20} />
                <span>{courses.length} קורסים</span>
              </div>
              <div className={styles.statItem}>
                <Users size={20} />
                <span>{courses.reduce((sum, course) => sum + course._count.enrollments, 0)} סטודנטים</span>
              </div>
              <div className={styles.statItem}>
                <Award size={20} />
                <span>תעודות מוכרות</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="חפש קורסים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">כל הקטגוריות</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">כל הרמות</option>
              <option value="BEGINNER">מתחיל</option>
              <option value="INTERMEDIATE">בינוני</option>
              <option value="ADVANCED">מתקדם</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">כל המחירים</option>
              <option value="free">חינם</option>
              <option value="paid">בתשלום</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className={styles.coursesGrid}>
            {filteredCourses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.courseInfo}>
                    <h3>{course.title}</h3>
                    <p className={styles.category}>{course.category.name}</p>
                  </div>
                  <div className={styles.badges}>
                    <span 
                      className={styles.levelBadge}
                      style={{ backgroundColor: getLevelColor(course.level) }}
                    >
                      {getLevelText(course.level)}
                    </span>
                  </div>
                </div>

                <p className={styles.description}>{course.description}</p>

                <div className={styles.courseStats}>
                  <div className={styles.stat}>
                    <Users size={16} />
                    <span>{course._count.enrollments} סטודנטים</span>
                  </div>
                  <div className={styles.stat}>
                    <BookOpen size={16} />
                    <span>{course._count.lessons} שיעורים</span>
                  </div>
                  <div className={styles.stat}>
                    <Clock size={16} />
                    <span>{course.duration} דקות</span>
                  </div>
                  {course.averageRating > 0 && (
                    <div className={styles.stat}>
                      <Star size={16} />
                      <span>{course.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.price}>
                    {course.is_paid ? (
                      <span className={styles.paidPrice}>₪{course.price}</span>
                    ) : (
                      <span className={styles.freePrice}>חינם</span>
                    )}
                  </div>
                  <Link 
                    href={`/courses/${course.slug}`}
                    className={styles.enrollButton}
                  >
                    <Play size={16} />
                    צפה בקורס
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen size={64} />
            <h3>לא נמצאו קורסים</h3>
            <p>נסה לשנות את הפילטרים או החיפוש</p>
          </div>
        )}
      </div>
    </div>
  )
}