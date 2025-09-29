'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { BookOpen, Menu, X, User, Settings, LogOut } from 'lucide-react'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user: sessionUser, signOut, loading } = useAuth()

  // Add logging for session state
  useEffect(() => {
    console.log('🏠 Header session state:', {
      hasSessionUser: !!sessionUser,
      userId: sessionUser?.id,
      userEmail: sessionUser?.email,
      userRole: sessionUser?.role,
      timestamp: new Date().toISOString()
    });
  }, [sessionUser]);

  const handleSignOut = () => {
    console.log('🚪 User signing out')
    signOut()
  }

  // שלד בזמן טעינה – שמור מבנה DOM זהה
  if (loading) {
    return (
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <BookOpen size={24} />
              <span>LearnHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.nav}>
              <Link href="/courses" className={styles.navLink}>
                קורסים
              </Link>
              <span className={styles.skeletonLink}></span>
            </nav>

            {/* User Section Skeleton */}
            <div className={styles.userSection}>
              <div className={styles.skeletonButtons}>
                <span className={styles.skeletonBtn}></span>
                <span className={styles.skeletonBtn}></span>
              </div>

              {/* Mobile Menu Button */}
              <button
                className={styles.mobileMenuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={styles.mobileMenu}>
              <Link href="/courses" className={styles.mobileNavLink}>
                קורסים
              </Link>
              <span className={styles.skeletonMobileLink}></span>
              <span className={styles.skeletonMobileLink}></span>
            </div>
          )}
        </div>
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <BookOpen size={24} />
            <span>LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <Link href="/courses" className={styles.navLink}>
              קורסים
            </Link>
            {sessionUser && (
            <Link href="/my-courses" className={styles.navLink}>
              הקורסים שלי
            </Link>
          )}
          </nav>

          {/* User Section */}
          <div className={styles.userSection}>
            {sessionUser ? (
              <div className={styles.userMenu}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={styles.userButton}
                >
                  <User size={20} />
                  <span>{sessionUser.name || sessionUser.email}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className={styles.userDropdown}>
                    <Link href="/dashboard" className={styles.dropdownItem}>
                      <User size={16} />
                      דשבורד
                    </Link>
                    {(sessionUser.role === 'ADMIN' || sessionUser.role === 'CONTENT_MANAGER') && (
                      <Link href="/admin" className={styles.dropdownItem}>
                        <Settings size={16} />
                        פאנל ניהול
                      </Link>
                    )}
                    <button onClick={handleSignOut} className={styles.dropdownItem}>
                      <LogOut size={16} />
                      התנתק
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link href="/signin" className="btn btn-secondary">
                  התחבר
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  הרשם
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link href="/courses" className={styles.mobileNavLink}>
              קורסים
            </Link>
            {sessionUser && (
              <Link href="/my-courses" className={styles.mobileNavLink}>
                הקורסים שלי
              </Link>
            )}
            {!sessionUser && (
              <>
                <Link href="/signin" className={styles.mobileNavLink}>
                  התחבר
                </Link>
                <Link href="/signup" className={styles.mobileNavLink}>
                  הרשם
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}