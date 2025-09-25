# LearnHub - פלטפורמת למידה מתקדמת

פלטפורמה מתקדמת ללמידה מקוונת עם מדריכים איכותיים, מעקב התקדמות אישי ותמיכה מלאה בעברית.

## ✨ תכונות עיקריות

- 🎓 **קורסים איכותיים** - תוכן מקצועי ומעודכן
- 📊 **מעקב התקדמות** - מעקב אישי אחרי הלמידה
- 👥 **ניהול משתמשים** - מערכת הרשאות מתקדמת
- 🏆 **תעודות הכרה** - תעודות מוכרות בסיום קורסים
- 📱 **עיצוב רספונסיבי** - מותאם לכל המכשירים
- 🔐 **אבטחה מתקדמת** - אימות ואבטחת נתונים

## 🛠️ טכנולוגיות

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS Modules, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## 🚀 התחלה מהירה

### דרישות מוקדמות

- Node.js 18+ 
- npm או yarn
- חשבון Supabase

### התקנה

1. **שכפל את הפרויקט**
```bash
git clone https://github.com/YOUR_USERNAME/learnhub-platform.git
cd learnhub-platform
```

2. **התקן dependencies**
```bash
npm install
```

3. **הגדר משתני סביבה**
```bash
cp .env.example .env.local
```

ערוך את קובץ `.env.local` והוסף:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. **הרץ את השרת**
```bash
npm run dev
```

הפרויקט יהיה זמין בכתובת: `http://localhost:3000`

## 📁 מבנה הפרויקט

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # דפי ניהול
│   ├── (auth)/            # דפי אימות
│   ├── (public)/          # דפים ציבוריים
│   ├── (student)/         # דפי סטודנטים
│   ├── api/               # API Routes
│   └── globals.css        # סגנונות גלובליים
├── components/            # רכיבי React
│   ├── ui/               # רכיבי UI בסיסיים
│   └── providers/        # Context Providers
├── lib/                  # פונקציות עזר
│   ├── auth.ts          # הגדרות NextAuth
│   └── supabase.ts      # לקוח Supabase
└── types/               # הגדרות TypeScript
```

## 🎯 תכונות מתקדמות

### מערכת הרשאות
- **GUEST** - גישה לתוכן ציבורי
- **STUDENT** - גישה לקורסים ומעקב התקדמות
- **CONTENT_MANAGER** - ניהול תוכן וקורסים
- **ADMIN** - גישה מלאה למערכת

### מעקב התקדמות
- מעקב אחרי השלמת שיעורים
- חישוב אחוזי התקדמות
- סטטיסטיקות למידה אישיות

### ניהול תוכן
- יצירה ועריכה של קורסים
- ניהול קטגוריות
- העלאת קבצים וחומרי לימוד

## 🔧 פיתוח

### הרצת בדיקות
```bash
npm run test
```

### בניית הפרויקט
```bash
npm run build
```

### הרצה בסביבת production
```bash
npm start
```

## 📝 רישיון

MIT License - ראה קובץ [LICENSE](LICENSE) לפרטים נוספים.

## 🤝 תרומה

תרומות מתקבלות בברכה! אנא פתח issue או שלח pull request.

## 📞 יצירת קשר

- **Email**: info@learnhub.co.il
- **Website**: https://learnhub.co.il

---

נבנה עם ❤️ בישראל