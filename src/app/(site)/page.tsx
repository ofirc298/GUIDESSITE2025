import Link from 'next/link'
import { BookOpen, Users, Award, TrendingUp, ArrowLeft } from 'lucide-react'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                למד, התקדם, והצליח עם
                <span className={styles.brandName}>LearnHub</span>
              </h1>
              <p className={styles.heroDescription}>
                פלטפורמה מתקדמת ללמידה מקוונת עם מדריכים איכותיים, 
                מעקב התקדמות אישי ותמיכה מלאה בדרך להצלחה
              </p>
              <div className={styles.heroButtons}>
                <Link href="/courses" className="btn btn-primary">
                  התחל ללמוד עכשיו
                  <ArrowLeft size={20} />
                </Link>
                <Link href="/about" className="btn btn-outline">
                  למד עוד
                </Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              <div className={styles.heroCard}>
                <BookOpen size={48} className={styles.heroIcon} />
                <h3>למידה חכמה</h3>
                <p>מדריכים מותאמים אישית לקצב הלמידה שלך</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>למה לבחור ב-LearnHub?</h2>
            <p>הפלטפורמה המתקדמת ביותר ללמידה מקוונת בישראל</p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BookOpen size={32} />
              </div>
              <h3>מדריכים איכותיים</h3>
              <p>תוכן מקצועי ומעודכן שנכתב על ידי מומחים בתחום</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <TrendingUp size={32} />
              </div>
              <h3>מעקב התקדמות</h3>
              <p>עקוב אחרי ההתקדמות שלך וקבל תובנות על הלמידה</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Users size={32} />
              </div>
              <h3>קהילה תומכת</h3>
              <p>הצטרף לקהילה של לומדים ושתף ידע וניסיון</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Award size={32} />
              </div>
              <h3>תעודות הכרה</h3>
              <p>קבל תעודות מוכרות בסיום קורסים ובניית פורטפוליו</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1,000+</div>
              <div className={styles.statLabel}>סטודנטים פעילים</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>קורסים איכותיים</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>שביעות רצון</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>תמיכה טכנית</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>מוכן להתחיל את המסע שלך?</h2>
            <p>הצטרף אלינו היום וקבל גישה למאות מדריכים איכותיים</p>
            <Link href="/signup" className="btn btn-primary">
              הרשם בחינם
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}