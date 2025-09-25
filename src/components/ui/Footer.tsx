import Link from 'next/link'
import { BookOpen, Mail, Phone } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Logo and Description */}
          <div className={styles.footerSection}>
            <Link href="/" className={styles.logo}>
              <BookOpen size={24} />
              <span>LearnHub</span>
            </Link>
            <p className={styles.description}>
              פלטפורמה מתקדמת ללמידה מקוונת עם מדריכים איכותיים ומעקב התקדמות אישי
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>קישורים מהירים</h3>
            <ul className={styles.linkList}>
              <li><Link href="/courses">קורסים</Link></li>
              <li><Link href="/about">אודות</Link></li>
              <li><Link href="/contact">צור קשר</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>תמיכה</h3>
            <ul className={styles.linkList}>
              <li><Link href="/help">עזרה</Link></li>
              <li><Link href="/faq">שאלות נפוצות</Link></li>
              <li><Link href="/privacy">מדיניות פרטיות</Link></li>
              <li><Link href="/terms">תנאי שימוש</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>צור קשר</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>info@learnhub.co.il</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>03-1234567</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2024 LearnHub. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  )
}