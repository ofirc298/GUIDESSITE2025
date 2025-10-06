"use client";

import { BookOpen, Users, Award, Target, Heart, Lightbulb } from 'lucide-react'
import styles from './about.module.css'

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>אודות LearnHub</h1>
            <p>
              אנחנו מאמינים שלמידה היא המפתח להצלחה בעולם המודרני. 
              LearnHub נוצרה כדי לספק פלטפורמה מתקדמת ונגישה ללמידה מקוונת.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className={styles.section}>
          <div className={styles.sectionContent}>
            <div className={styles.textContent}>
              <h2>המשימה שלנו</h2>
              <p>
                להפוך למידה איכותית לנגישה לכולם. אנחנו מספקים קורסים מקצועיים,
                מדריכים מנוסים וכלים מתקדמים שיעזרו לך להשיג את המטרות שלך.
              </p>
              <p>
                הפלטפורמה שלנו מיועדת לכל מי שרוצה ללמוד, להתפתח ולהשיג הצלחה
                בתחום שהוא בחר.
              </p>
            </div>
            <div className={styles.iconGrid}>
              <div className={styles.iconItem}>
                <Target size={48} />
                <h3>מטרה ברורה</h3>
                <p>כל קורס בנוי עם מטרות למידה ברורות</p>
              </div>
              <div className={styles.iconItem}>
                <Heart size={48} />
                <h3>תשוקה ללמידה</h3>
                <p>אנחנו אוהבים את מה שאנחנו עושים</p>
              </div>
              <div className={styles.iconItem}>
                <Lightbulb size={48} />
                <h3>חדשנות</h3>
                <p>תמיד מחפשים דרכים חדשות ללמד</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className={styles.valuesSection}>
          <h2>הערכים שלנו</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <BookOpen size={32} />
              <h3>איכות</h3>
              <p>כל התוכן שלנו נבדק ומאושר על ידי מומחים</p>
            </div>
            <div className={styles.valueCard}>
              <Users size={32} />
              <h3>קהילה</h3>
              <p>בונים קהילה תומכת של לומדים ומורים</p>
            </div>
            <div className={styles.valueCard}>
              <Award size={32} />
              <h3>הצלחה</h3>
              <p>מחויבים להצלחה של כל סטודנט</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection}>
          <h2>המספרים מדברים בעד עצמם</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>5,000+</div>
              <div className={styles.statLabel}>סטודנטים מרוצים</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100+</div>
              <div className={styles.statLabel}>קורסים איכותיים</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>מדריכים מומחים</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>98%</div>
              <div className={styles.statLabel}>שביעות רצון</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className={styles.teamSection}>
          <h2>הצוות שלנו</h2>
          <p className={styles.teamDescription}>
            צוות מקצועי ומנוסה שמחויב להצלחה שלכם
          </p>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <Users size={48} />
              </div>
              <h3>דני כהן</h3>
              <p>מייסד ומנכ"ל</p>
              <p>15 שנות ניסיון בחינוך טכנולוגי</p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <BookOpen size={48} />
              </div>
              <h3>שרה לוי</h3>
              <p>מנהלת תוכן</p>
              <p>מומחית בפיתוח תוכניות לימוד</p>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <Award size={48} />
              </div>
              <h3>מיכאל רוזן</h3>
              <p>מנהל טכנולוגיות</p>
              <p>מפתח פלטפורמות למידה מתקדמות</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}