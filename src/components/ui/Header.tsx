"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, User, ChevronDown, LogOut, Settings, BookOpenCheck } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <BookOpen size={24} />
            <span>LearnHub</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/courses" className={styles.navLink}>
              קורסים
            </Link>
            <Link href="/about" className={styles.navLink}>
              אודות
            </Link>
            <Link href="/contact" className={styles.navLink}>
              צור קשר
            </Link>
            <Link href="/faq" className={styles.navLink}>
              שאלות נפוצות
            </Link>
          </nav>

          <div className={styles.userSection}>
            {loading ? (
              <div className={styles.loading}>טוען...</div>
            ) : user ? (
              <div className={styles.userMenu}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={styles.userButton}
                >
                  <User size={16} />
                  <span>{user.name || user.email}</span>
                  <ChevronDown size={16} />
                </button>

                {showUserMenu && (
                  <div className={styles.userDropdown}>
                    {user.role === 'ADMIN' || user.role === 'CONTENT_MANAGER' ? (
                      <Link href="/admin" className={styles.dropdownItem}>
                        <Settings size={16} />
                        פאנל ניהול
                      </Link>
                    ) : (
                      <>
                        <Link href="/dashboard" className={styles.dropdownItem}>
                          <BookOpenCheck size={16} />
                          הדשבורד שלי
                        </Link>
                        <Link href="/my-courses" className={styles.dropdownItem}>
                          <BookOpen size={16} />
                          הקורסים שלי
                        </Link>
                      </>
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
                <Link href="/signin" className="btn btn-outline">
                  התחבר
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  הרשם
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}