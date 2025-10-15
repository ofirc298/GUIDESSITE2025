import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envPath = join(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...\n')
  console.log('URL:', supabaseUrl)
  console.log('')

  try {
    console.log('1. Testing users table access...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(5)

    if (usersError) {
      console.error('   ERROR:', usersError.message)
      console.log('   This might be an RLS policy issue.')
      console.log('   Make sure to run the migration: supabase/migrations/20251015070300_fix_users_rls_policies.sql')
    } else {
      console.log('   SUCCESS! Found', users.length, 'users')
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`)
      })
    }

    console.log('\n2. Testing categories table access...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .limit(5)

    if (categoriesError) {
      console.error('   ERROR:', categoriesError.message)
    } else {
      console.log('   SUCCESS! Found', categories.length, 'categories')
    }

    console.log('\n3. Testing courses table access...')
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, slug')
      .limit(5)

    if (coursesError) {
      console.error('   ERROR:', coursesError.message)
    } else {
      console.log('   SUCCESS! Found', courses.length, 'courses')
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testConnection()
