'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'
import styles from './contact.module.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>צור קשר</h1>
            <p>
              יש לך שאלות? רוצה לדעת עוד? אנחנו כאן בשבילך!
              צור קשר ונחזור אליך בהקדם האפשרי.
            </p>
          </div>
        </div>

        <div className={styles.contactLayout}>
          {/* Contact Form */}
          <div className={styles.formSection}>
            <div className={styles.formCard}>
              <h2>שלח לנו הודעה</h2>
              
              {submitted && (
                <div className={styles.successMessage}>
                  <MessageSquare size={20} />
                  <span>ההודעה נשלחה בהצלחה! נחזור אליך בקרוב.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    שם מלא *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="הכנס את השם המלא שלך"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    כתובת אימייל *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="הכנס את כתובת האימייל שלך"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    נושא
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={styles.select}
                    disabled={isSubmitting}
                  >
                    <option value="">בחר נושא</option>
                    <option value="general">שאלה כללית</option>
                    <option value="course">שאלה על קורס</option>
                    <option value="technical">תמיכה טכנית</option>
                    <option value="billing">שאלה על תשלום</option>
                    <option value="partnership">שיתוף פעולה</option>
                    <option value="other">אחר</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    הודעה *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="כתוב את ההודעה שלך כאן..."
                    rows={6}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.spinner}></div>
                      שולח...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      שלח הודעה
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h2>פרטי התקשרות</h2>
              
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <Mail size={24} />
                  </div>
                  <div className={styles.contactDetails}>
                    <h3>אימייל</h3>
                    <p>info@learnhub.co.il</p>
                    <p>support@learnhub.co.il</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <Phone size={24} />
                  </div>
                  <div className={styles.contactDetails}>
                    <h3>טלפון</h3>
                    <p>03-1234567</p>
                    <p>050-1234567</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <MapPin size={24} />
                  </div>
                  <div className={styles.contactDetails}>
                    <h3>כתובת</h3>
                    <p>רחוב הטכנולוגיה 123</p>
                    <p>תל אביב, ישראל</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <Clock size={24} />
                  </div>
                  <div className={styles.contactDetails}>
                    <h3>שעות פעילות</h3>
                    <p>ראשון - חמישי: 9:00-18:00</p>
                    <p>שישי: 9:00-14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className={styles.faqCard}>
              <h3>שאלות נפוצות</h3>
              <p>לפני שתשלח הודעה, אולי תמצא את התשובה כאן:</p>
              <div className={styles.faqLinks}>
                <a href="/faq" className={styles.faqLink}>
                  איך נרשמים לקורס?
                </a>
                <a href="/faq" className={styles.faqLink}>
                  איך מתבצע התשלום?
                </a>
                <a href="/faq" className={styles.faqLink}>
                  מה כלול בקורס?
                </a>
                <a href="/faq" className={styles.faqLink}>
                  איך מקבלים תעודה?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}