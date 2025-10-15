# Setting Up Supabase for LearnHub

This guide will help you set up a new Supabase project or connect to an existing one.

## Option 1: Create New Supabase Project

### Step 1: Create Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `learnhub-platform` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your location
4. Click **"Create new project"**
5. Wait ~2 minutes for the project to be created

### Step 2: Get API Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Find these values:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Copy both values

### Step 3: Update Environment Variables

1. Open `.env` file in your project root
2. Update the following lines:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Save the file

### Step 4: Apply Database Migrations

You need to run the SQL migrations to create all tables and policies.

#### Method A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase project
2. Run each migration file **in order**:

**Migration 1: Initial Schema** (20250924185230_billowing_surf.sql)
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20250924185230_billowing_surf.sql
-- Then click "Run"
```

**Migration 2: Logs Table** (20250929065848_maroon_dawn.sql)
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20250929065848_maroon_dawn.sql
-- Then click "Run"
```

**Migration 3: Instructors and Tracking** (20251006074841_add_instructors_and_tracking.sql)
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20251006074841_add_instructors_and_tracking.sql
-- Then click "Run"
```

**Migration 4: Course Materials** (20251006080633_add_course_materials.sql)
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20251006080633_add_course_materials.sql
-- Then click "Run"
```

**Migration 5: Fix RLS Policies** (20251015070300_fix_users_rls_policies.sql)
```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20251015070300_fix_users_rls_policies.sql
-- Then click "Run"
```

#### Method B: Using Supabase CLI (Advanced)

If you have Supabase CLI installed and linked:

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push
```

### Step 5: Verify Setup

Run the comprehensive test script:

```bash
node scripts/test-auth-complete.mjs
```

If all tests pass, you're ready to go!

### Step 6: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000/signin and login with:
- **Email**: admin@learnhub.co.il
- **Password**: admin123

---

## Option 2: Restore Existing Project

If your project was paused:

### Step 1: Check Project Status

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Look for your project in the list
3. If it shows **"Paused"**, click on it

### Step 2: Restore Project

1. Click **"Restore project"** or **"Unpause"**
2. Wait for the project to become active
3. The URL and API keys should remain the same

### Step 3: Verify Connection

```bash
node scripts/test-db-connection.mjs
```

If this works, your existing setup should work without changes!

---

## Option 3: Use Different Supabase Account

If you need to use a different Supabase account:

### Step 1: Get Credentials from Owner

Ask the project owner for:
- Project URL
- Anon/public API key

### Step 2: Update .env File

Replace the values in `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=<provided-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<provided-key>
```

### Step 3: Test Connection

```bash
node scripts/test-auth-complete.mjs
```

---

## Troubleshooting

### Issue: "Could not resolve host"

**Problem**: The Supabase URL doesn't exist or is incorrect

**Solution**:
1. Double-check the URL in `.env` matches your Supabase dashboard
2. Ensure there are no extra spaces or characters
3. Verify the project hasn't been deleted

### Issue: "Row level security policy"

**Problem**: RLS policies are blocking access

**Solution**:
1. Make sure you've run all migrations in order
2. Specifically ensure migration `20251015070300_fix_users_rls_policies.sql` has been applied
3. This migration allows the anon role to read from users table (required for auth)

### Issue: "User not found"

**Problem**: Admin user doesn't exist in database

**Solution**:
1. Run the initial migration (`20250924185230_billowing_surf.sql`)
2. This creates the admin user with credentials:
   - Email: admin@learnhub.co.il
   - Password: admin123

### Issue: "Authentication failed"

**Problem**: Multiple possible causes

**Solution**:
1. Run the comprehensive test: `node scripts/test-auth-complete.mjs`
2. This will identify exactly what's wrong
3. Follow the suggestions in the test output

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## Need Help?

If you're still having issues:

1. Run the diagnostic: `node scripts/test-auth-complete.mjs`
2. Check the detailed report: `AUTHENTICATION_DIAGNOSIS.md`
3. Review server logs when attempting to login
4. Check browser console for any frontend errors

The authentication system is well-tested and should work once the database connection is established!
