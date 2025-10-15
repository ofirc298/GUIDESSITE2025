#!/usr/bin/env node
/**
 * Comprehensive Authentication System Test
 *
 * This script tests the entire authentication flow to ensure everything works correctly.
 * Run this after fixing the Supabase connection.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
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
  console.error('❌ Missing Supabase environment variables!')
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(emoji, message, details = '') {
  console.log(`${emoji} ${message}`)
  if (details) console.log(`   ${colors.cyan}${details}${colors.reset}`)
}

function success(message, details = '') {
  log('✅', `${colors.green}${message}${colors.reset}`, details)
}

function error(message, details = '') {
  log('❌', `${colors.red}${message}${colors.reset}`, details)
}

function info(message, details = '') {
  log('ℹ️ ', `${colors.blue}${message}${colors.reset}`, details)
}

function warn(message, details = '') {
  log('⚠️ ', `${colors.yellow}${message}${colors.reset}`, details)
}

function section(title) {
  console.log(`\n${colors.bright}${colors.cyan}═══ ${title} ═══${colors.reset}\n`)
}

async function testDatabaseConnection() {
  section('1. Database Connection Test')

  try {
    // Test basic connectivity
    const { error: pingError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (pingError) {
      error('Database connection failed', pingError.message)
      return false
    }

    success('Database is reachable')
    return true
  } catch (err) {
    error('Connection error', err.message)
    return false
  }
}

async function testTableAccess() {
  section('2. Table Access Test')

  const tables = [
    'users',
    'categories',
    'courses',
    'lessons',
    'enrollments',
    'progress',
    'groups',
    'faqs',
    'logs'
  ]

  let allPassed = true

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        error(`Table '${table}' access failed`, error.message)
        allPassed = false
      } else {
        success(`Table '${table}' is accessible`)
      }
    } catch (err) {
      error(`Table '${table}' query error`, err.message)
      allPassed = false
    }
  }

  return allPassed
}

async function testRLSPolicies() {
  section('3. RLS Policies Test')

  // Test anon role can read users (required for authentication)
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(1)

    if (error) {
      error('Anon role cannot read users table', error.message)
      warn('This will prevent authentication from working!')
      warn('Make sure migration 20251015070300 has been applied.')
      return false
    }

    success('Anon role can read users table (required for auth)')
    return true
  } catch (err) {
    error('RLS policy test failed', err.message)
    return false
  }
}

async function testAdminUser() {
  section('4. Admin User Test')

  try {
    const { data: adminUser, error } = await supabase
      .from('users')
      .select('id, email, name, role, password')
      .eq('email', 'admin@learnhub.co.il')
      .maybeSingle()

    if (error) {
      error('Query for admin user failed', error.message)
      return false
    }

    if (!adminUser) {
      warn('Admin user not found in database')
      warn('Create admin user or run initial migration')
      info('Expected email: admin@learnhub.co.il')
      return false
    }

    success('Admin user exists', `Email: ${adminUser.email}, Role: ${adminUser.role}`)

    // Test password hash
    if (!adminUser.password || !adminUser.password.startsWith('$2a$') && !adminUser.password.startsWith('$2b$')) {
      error('Password hash invalid or missing')
      return false
    }

    success('Password hash format is valid')

    // Test password verification (password should be: admin123)
    try {
      const isValid = await bcrypt.compare('admin123', adminUser.password)
      if (isValid) {
        success('Demo password verification works', 'Password: admin123')
      } else {
        warn('Demo password does not match', 'Expected: admin123')
      }
    } catch (err) {
      error('Password verification failed', err.message)
      return false
    }

    return true
  } catch (err) {
    error('Admin user test failed', err.message)
    return false
  }
}

async function testCategoriesAndCourses() {
  section('5. Sample Data Test')

  try {
    // Test categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .limit(5)

    if (catError) {
      error('Failed to fetch categories', catError.message)
      return false
    }

    if (categories && categories.length > 0) {
      success(`Found ${categories.length} categories`)
      categories.forEach(cat => {
        info(`  - ${cat.name} (${cat.slug})`)
      })
    } else {
      warn('No categories found', 'Run initial migration to seed data')
    }

    // Test courses
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, title, slug')
      .limit(5)

    if (courseError) {
      error('Failed to fetch courses', courseError.message)
      return false
    }

    if (courses && courses.length > 0) {
      success(`Found ${courses.length} courses`)
      courses.forEach(course => {
        info(`  - ${course.title} (${course.slug})`)
      })
    } else {
      warn('No courses found', 'Run initial migration to seed data')
    }

    return true
  } catch (err) {
    error('Sample data test failed', err.message)
    return false
  }
}

async function testAuthenticationFlow() {
  section('6. Authentication Flow Simulation')

  info('Simulating signin flow for admin@learnhub.co.il...')

  try {
    // Step 1: Fetch user by email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, name, role, password')
      .eq('email', 'admin@learnhub.co.il')
      .maybeSingle()

    if (fetchError) {
      error('Step 1: Failed to fetch user', fetchError.message)
      return false
    }

    if (!user) {
      error('Step 1: User not found')
      return false
    }

    success('Step 1: User fetched successfully', `ID: ${user.id}`)

    // Step 2: Verify password
    const testPassword = 'admin123'
    const isValidPassword = await bcrypt.compare(testPassword, user.password)

    if (!isValidPassword) {
      error('Step 2: Password verification failed')
      warn('The demo password might have changed')
      return false
    }

    success('Step 2: Password verified successfully')

    // Step 3: Simulate JWT creation
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }

    success('Step 3: Session data prepared', JSON.stringify(sessionData, null, 2))

    info('Authentication flow simulation completed successfully!')
    info('The actual API route should work the same way.')

    return true
  } catch (err) {
    error('Authentication flow simulation failed', err.message)
    return false
  }
}

async function runAllTests() {
  console.log(`${colors.bright}${colors.blue}`)
  console.log('╔═══════════════════════════════════════════════════════╗')
  console.log('║  LearnHub Authentication System Comprehensive Test   ║')
  console.log('╚═══════════════════════════════════════════════════════╝')
  console.log(colors.reset)

  info('Supabase URL', supabaseUrl)
  info('Testing anon role access...')

  const results = {
    connection: await testDatabaseConnection(),
    tables: false,
    rls: false,
    admin: false,
    data: false,
    auth: false
  }

  if (results.connection) {
    results.tables = await testTableAccess()
    results.rls = await testRLSPolicies()
    results.admin = await testAdminUser()
    results.data = await testCategoriesAndCourses()

    if (results.rls && results.admin) {
      results.auth = await testAuthenticationFlow()
    }
  }

  // Summary
  section('Test Summary')

  const passed = Object.values(results).filter(Boolean).length
  const total = Object.keys(results).length

  console.log(`Tests Passed: ${passed}/${total}\n`)

  Object.entries(results).forEach(([test, passed]) => {
    const emoji = passed ? '✅' : '❌'
    const status = passed ? `${colors.green}PASSED${colors.reset}` : `${colors.red}FAILED${colors.reset}`
    console.log(`${emoji} ${test.padEnd(20)} ${status}`)
  })

  console.log('')

  if (passed === total) {
    success('All tests passed! Authentication system is ready to use.')
    console.log('')
    info('Demo Credentials:')
    console.log(`   Email:    ${colors.bright}admin@learnhub.co.il${colors.reset}`)
    console.log(`   Password: ${colors.bright}admin123${colors.reset}`)
    console.log('')
    info('Next Steps:')
    console.log('   1. Start the dev server: npm run dev')
    console.log('   2. Go to: http://localhost:3000/signin')
    console.log('   3. Login with the demo credentials')
    console.log('   4. Verify you can access /dashboard')
  } else {
    error('Some tests failed. Please review the output above.')
    console.log('')

    if (!results.connection) {
      warn('Critical: Database connection failed')
      info('Action: Check Supabase credentials and project status')
    }

    if (!results.rls) {
      warn('Critical: RLS policies not configured correctly')
      info('Action: Apply migration 20251015070300_fix_users_rls_policies.sql')
    }

    if (!results.admin) {
      warn('Warning: Admin user not found or invalid')
      info('Action: Apply initial migration 20250924185230_billowing_surf.sql')
    }
  }

  process.exit(passed === total ? 0 : 1)
}

// Run tests
runAllTests().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
