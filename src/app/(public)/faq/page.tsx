'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react'
import styles from './faq.module.css'

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "איך נרשמים לקורס?",
    answer: "ההרשמה לקורס פשוטה מאוד: בחר את הקורס הרצוי, לחץ על 'הירשם לקורס', צור חשבון או התחבר לחשבון הקיים, ובצע תשלום אם הקורס בתשלום. לאחר ההרשמה תקבל גישה מיידית לכל התוכן.",
    category: "הרשמה"
  },
  {
    id: 2,
    question: "איך מתבצע התשלום?",
    answer: "אנחנו מקבלים תשלום באמצעות כרטיסי אשראי (ויזה, מאסטרקארד), PayPal והעברה בנקאית. כל התשלומים מאובטחים ומוצפנים. לאחר התשלום תקבל אישור במייל ותוכל להתחיל ללמוד מיד.",
    category: "תשלום"
  },
  {
    id: 3,
    question: "מה כלול בקורס?",
    answer: "כל קורס כולל: שיעורי וידאו איכותיים, חומרי לימוד להורדה, תרגילים מעשיים, מעקב התקדמות אישי, גישה לקהילת הלומדים, תמיכה טכנית ותעודת השלמה. הגישה היא לכל החיים.",
    category: "תוכן"
  },
  {
    id: 4,
    question: "איך מקבלים תעודה?",
    answer: "תעודת השלמה מונפקת אוטומטית לאחר השלמת 100% מתוכן הקורס ועמידה בכל הדרישות. התעודה דיגיטלית, ניתנת להורדה ולשיתוף ברשתות החברתיות ובקורות חיים.",
    category: "תעודות"
  },
  {
    id: 5,
    question: "האם יש תמיכה טכנית?",
    answer: "כן! אנחנו מספקים תמיכה טכנית מלאה 24/7. ניתן לפנות אלינו דרך המייל, הצ'אט באתר או טלפון. הצוות שלנו יעזור לך עם כל בעיה טכנית או שאלה על התוכן.",
    category: "תמיכה"
  },
  {
    id: 6,
    question: "האם אפשר לקבל החזר כספי?",
    answer: "כן, אנחנו מציעים החזר כספי מלא תוך 30 יום מרכישת הקורס, ללא שאלות. אם אתה לא מרוצה מהקורס מכל סיבה שהיא, פשוט צור איתנו קשר ונחזיר לך את הכסף.",
    category: "תשלום"
  },
  {
    id: 7,
    question: "כמה זמן לוקח להשלים קורס?",
    answer: "זה תלוי בקורס ובקצב הלמידה שלך. רוב הקורסים נעים בין 10-50 שעות תוכן. אתה יכול ללמוד בקצב שלך - יש לך גישה לכל החיים ללא הגבלת זמן.",
    category: "תוכן"
  },
  {
    id: 8,
    question: "האם הקורסים מתאימים למתחילים?",
    answer: "כן! יש לנו קורסים לכל הרמות - מתחילים מוחלטים ועד מתקדמים. כל קורס מסומן ברמת הקושי שלו, ואנחנו ממליצים על נתיב למידה מתאים לכל סטודנט.",
    category: "תוכן"
  },
  {
    id: 9,
    question: "האם אפשר ללמוד מהטלפון?",
    answer: "בהחלט! הפלטפורמה שלנו מותאמת לכל המכשירים - מחשב, טאבלט וטלפון נייד. אתה יכול ללמוד בכל מקום ובכל זמן שנוח לך.",
    category: "טכני"
  },
  {
    id: 10,
    question: "איך יוצרים קשר עם המדריכים?",
    answer: "ניתן ליצור קשר עם המדריכים דרך פורום הקורס, הודעות פרטיות בפלטפורמה או במהלך שיעורים חיים. המדריכים זמינים לענות על שאלות ולתת הכוונה אישית.",
    category: "תמיכה"
  }
]

const categories = ["הכל", "הרשמה", "תשלום", "תוכן", "תעודות", "תמיכה", "טכני"]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('הכל')
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'הכל' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <HelpCircle size={64} />
            <h1>שאלות נפוצות</h1>
            <p>
              מצא תשובות לשאלות הנפוצות ביותר על הפלטפורמה, הקורסים והשירותים שלנו
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="חפש שאלה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.categories}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${styles.categoryButton} ${
                  selectedCategory === category ? styles.active : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className={styles.faqSection}>
          {filteredFAQs.length > 0 ? (
            <div className={styles.faqList}>
              {filteredFAQs.map(item => (
                <div key={item.id} className={styles.faqItem}>
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={styles.faqQuestion}
                  >
                    <span>{item.question}</span>
                    {openItems.includes(item.id) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  
                  {openItems.includes(item.id) && (
                    <div className={styles.faqAnswer}>
                      <p>{item.answer}</p>
                      <span className={styles.category}>{item.category}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <HelpCircle size={64} />
              <h3>לא נמצאו תוצאות</h3>
              <p>נסה לשנות את החיפוש או הקטגוריה</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className={styles.contactCTA}>
          <h2>לא מצאת את מה שחיפשת?</h2>
          <p>אנחנו כאן לעזור! צור איתנו קשר ונענה על כל שאלה</p>
          <a href="/contact" className="btn btn-primary">
            צור קשר
          </a>
        </div>
      </div>
    </div>
  )
}