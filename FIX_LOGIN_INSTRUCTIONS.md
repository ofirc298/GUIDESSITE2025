# תיקון בעיית ההתחברות - הוראות

## בעיות שזוהו

1. **מדיניות RLS (Row Level Security) חוסמת גישה לטבלת users**
   - ה-RLS מגדיר שרק `auth.uid()` יכול לגשת למשתמשים
   - האפליקציה משתמשת ב-JWT מותאם אישית ולא באימות המובנה של Supabase
   - השרת לא יכול לשאול את הדאטהבייס בזמן התחברות

2. **טיפול בשגיאות חסר ב-useAuth hook**
   - ה-hook לא בודק אם ההתחברות הצליחה או נכשלה
   - השגיאות לא מוצגות למשתמש

## תיקונים שבוצעו

### 1. הוספת Logging מפורט
- נוסף logging ל-`/api/auth/signin` כדי לעקוב אחרי תהליך ההתחברות
- נוסף logging ל-`getUserByEmail` כדי לראות מה קורה בשאילתת הדאטהבייס

### 2. תיקון useAuth Hook
- נוסף בדיקת סטטוס של תגובת ה-fetch
- זריקת שגיאה אם ההתחברות נכשלה
- הודעת שגיאה מוצגת כעת למשתמש

### 3. יצירת Migration לתיקון RLS
נוצר קובץ migration חדש: `supabase/migrations/20251015070300_fix_users_rls_policies.sql`

## פתרון הבעיה - צעדים לביצוע

### אופציה 1: הרצת Migration ידנית (מומלץ)

אם יש לך גישה ל-Supabase Dashboard:

1. היכנס ל-Supabase Dashboard של הפרויקט שלך
2. עבור ל-SQL Editor
3. העתק והרץ את הקוד הבא:

```sql
-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Allow anon role to query users table for authentication
CREATE POLICY "Allow anon to read users for authentication"
  ON users
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to read their own data
CREATE POLICY "Authenticated users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update their own data
CREATE POLICY "Authenticated users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

4. לחץ על "Run"

### אופציה 2: שימוש ב-Supabase CLI

אם יש לך את Supabase CLI מותקן ומחובר לפרויקט:

```bash
supabase db push
```

## בדיקה שהתיקון עבד

אחרי הרצת ה-migration:

1. הפעל מחדש את שרת הפיתוח אם הוא רץ
2. נסה להתחבר עם המשתמש הבא:
   - **Email**: `admin@learnhub.co.il`
   - **Password**: `admin123`

3. בדוק את ה-console של השרת - אתה אמור לראות:
```
[SIGNIN] Attempting login for: admin@learnhub.co.il
[getUserByEmail] Querying for email: admin@learnhub.co.il
[getUserByEmail] User found: { id: '...', email: 'admin@learnhub.co.il', role: 'ADMIN' }
[SIGNIN] User found: YES
[SIGNIN] User role: ADMIN
[SIGNIN] Verifying password...
[SIGNIN] Password valid: true
[SIGNIN] Setting session cookie...
[SIGNIN] Login successful!
```

## בעיות נפוצות ופתרונות

### אם עדיין לא מצליח להתחבר:

#### שגיאה: "User not found"
- המשתמש לא קיים בדאטהבייס
- וודא שה-migration הראשוני רץ והוסיף את המשתמש admin
- אתה יכול ליצור משתמש חדש דרך ה-signup page

#### שגיאה: "Password invalid"
- הסיסמה שהזנת לא תואמת
- המשתמש הדמו: `admin@learnhub.co.il` / `admin123`

#### שגיאה מ-Supabase: "row-level security policy"
- ה-migration עדיין לא רץ
- עבור לאופציה 1 והרץ את ה-SQL ידנית

## המלצה לעתיד: מעבר לאימות Supabase המובנה

הגישה הנוכחית (JWT מותאם + RLS פתוח) פחות מאובטחת. מומלץ לעבור לאימות המובנה של Supabase:

### יתרונות:
- אבטחה מובנית טובה יותר
- תמיכה ב-MFA, OAuth providers
- RLS עובד מול `auth.uid()` באופן מלא
- אין צורך לחשוף את טבלת users לתפקיד anon

### שינויים נדרשים:
1. שימוש ב-`supabase.auth.signInWithPassword` במקום API route מותאם
2. שימוש ב-`supabase.auth.onAuthStateChange` ב-useAuth
3. הסרת קוד ה-JWT המותאם
4. עדכון RLS policies להשתמש ב-`auth.uid()`

## קבצים ששונו

1. `/src/app/api/auth/signin/route.ts` - הוספת logging
2. `/src/lib/auth/session.ts` - הוספת logging ל-getUserByEmail
3. `/src/hooks/useAuth.tsx` - תיקון טיפול בשגיאות
4. `/supabase/migrations/20251015070300_fix_users_rls_policies.sql` - migration חדש
5. `/scripts/test-db-connection.mjs` - סקריפט בדיקה

## שאלות ועזרה

אם הבעיה נמשכת, בדוק:
1. האם שרת הפיתוח רץ (נראה שכן מההודעות שלך)
2. האם ה-migration רץ בהצלחה
3. מה נכתב ב-console של השרת כשמנסים להתחבר
4. האם משתני הסביבה ב-.env תקינים
