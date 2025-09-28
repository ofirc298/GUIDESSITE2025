import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase env vars are missing. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  name?: string
  password: string
  role: 'GUEST' | 'STUDENT' | 'CONTENT_MANAGER' | 'ADMIN'
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  price: number
  is_paid: boolean
  is_active: boolean
  order: number
  duration?: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category_id: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  title: string
  slug: string
  content?: string
  order: number
  is_active: boolean
  course_id: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED'
  progress: number
  created_at: string
  updated_at: string
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  time_spent: number
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GroupMembership {
  id: string
  user_id: string
  group_id: string
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  is_active: boolean
  course_id?: string
  created_at: string
  updated_at: string
}

export interface CourseFile {
  id: string
  name: string
  filename: string
  path: string
  size: number
  mime_type: string
  course_id: string
  created_at: string
}

export interface Comment {
  id: string
  content: string
  user_id: string
  course_id: string
  parent_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Rating {
  id: string
  rating: number
  review?: string
  user_id: string
  course_id: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  paypal_order_id?: string
  user_id: string
  course_id?: string
  created_at: string
  updated_at: string
}

export interface InviteCode {
  id: string
  code: string
  email?: string
  group_id?: string
  used_by?: string
  expires_at: string
  created_at: string
  used_at?: string
}