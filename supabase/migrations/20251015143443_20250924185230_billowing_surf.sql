/*
  # Initial Schema for LearnHub Platform

  1. New Tables
    - `users` - User accounts with roles and authentication
    - `categories` - Hierarchical course categories
    - `courses` - Course content and metadata
    - `lessons` - Individual lessons within courses
    - `enrollments` - User course enrollments with progress tracking
    - `progress` - Detailed lesson completion tracking
    - `groups` - User groups and classes
    - `group_memberships` - User group associations
    - `faqs` - Frequently asked questions
    - `course_files` - File attachments for courses
    - `comments` - Course comments and discussions
    - `ratings` - Course ratings and reviews
    - `payments` - Payment transactions
    - `invite_codes` - Invitation codes for registration

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure user data and course content

  3. Features
    - Hierarchical categories
    - Progress tracking
    - Group management
    - Payment integration
    - Content management
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('GUEST', 'STUDENT', 'CONTENT_MANAGER', 'ADMIN');
CREATE TYPE course_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE enrollment_status AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  password text NOT NULL,
  role user_role DEFAULT 'STUDENT',
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table (hierarchical)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id),
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  price decimal(10,2) DEFAULT 0,
  is_paid boolean DEFAULT false,
  is_active boolean DEFAULT true,
  "order" integer DEFAULT 0,
  duration integer, -- in minutes
  level course_level DEFAULT 'BEGINNER',
  category_id uuid NOT NULL REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  content text,
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  status enrollment_status DEFAULT 'ACTIVE',
  progress decimal(5,2) DEFAULT 0, -- 0-100
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  lesson_id uuid NOT NULL REFERENCES lessons(id),
  completed boolean DEFAULT false,
  time_spent integer DEFAULT 0, -- in seconds
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Group memberships table
CREATE TABLE IF NOT EXISTS group_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  group_id uuid NOT NULL REFERENCES groups(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, group_id)
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  course_id uuid REFERENCES courses(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course files table
CREATE TABLE IF NOT EXISTS course_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  filename text NOT NULL,
  path text NOT NULL,
  size integer NOT NULL,
  mime_type text NOT NULL,
  course_id uuid NOT NULL REFERENCES courses(id),
  created_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  parent_id uuid REFERENCES comments(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  user_id uuid NOT NULL REFERENCES users(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'ILS',
  status payment_status DEFAULT 'PENDING',
  paypal_order_id text,
  user_id uuid NOT NULL REFERENCES users(id),
  course_id uuid REFERENCES courses(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invite codes table
CREATE TABLE IF NOT EXISTS invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  email text,
  group_id uuid REFERENCES groups(id),
  used_by uuid REFERENCES users(id),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Only admins can manage categories" ON categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'CONTENT_MANAGER'))
);

-- Courses policies
CREATE POLICY "Active courses are viewable by everyone" ON courses FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Only admins can manage courses" ON courses FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'CONTENT_MANAGER'))
);

-- Lessons policies
CREATE POLICY "Lessons viewable by enrolled users" ON lessons FOR SELECT TO authenticated USING (
  is_active = true AND (
    EXISTS (SELECT 1 FROM enrollments WHERE user_id = auth.uid() AND course_id = lessons.course_id) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'CONTENT_MANAGER'))
  )
);

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create own enrollments" ON enrollments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Progress policies
CREATE POLICY "Users can manage own progress" ON progress FOR ALL TO authenticated USING (user_id = auth.uid());

-- Groups policies
CREATE POLICY "Group members can view groups" ON groups FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM group_memberships WHERE user_id = auth.uid() AND group_id = groups.id) OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'CONTENT_MANAGER'))
);

-- Comments policies
CREATE POLICY "Users can view active comments" ON comments FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Ratings policies
CREATE POLICY "Users can view ratings" ON ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create own ratings" ON ratings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_comments_course_id ON comments(course_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_ratings_course_id ON ratings(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Insert sample data

-- Insert sample categories
INSERT INTO categories (name, slug, description, "order") VALUES
('פיתוח תוכנה', 'software-development', 'קורסים בפיתוח תוכנה ותכנות', 1),
('עיצוב ו-UI/UX', 'design-ui-ux', 'קורסים בעיצוב ממשקי משתמש', 2),
('שיווק דיגיטלי', 'digital-marketing', 'קורסים בשיווק דיגיטלי ורשתות חברתיות', 3),
('ניהול פרויקטים', 'project-management', 'קורסים בניהול פרויקטים ומתודולוגיות', 4);

-- Insert subcategories
INSERT INTO categories (name, slug, description, parent_id, "order") VALUES
('JavaScript', 'javascript', 'קורסים בשפת JavaScript', (SELECT id FROM categories WHERE slug = 'software-development'), 1),
('Python', 'python', 'קורסים בשפת Python', (SELECT id FROM categories WHERE slug = 'software-development'), 2),
('React', 'react', 'קורסים בספריית React', (SELECT id FROM categories WHERE slug = 'software-development'), 3);

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, name, password, role) VALUES
('admin@learnhub.co.il', 'מנהל המערכת', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.hl.vHW', 'ADMIN');

-- Insert sample courses
INSERT INTO courses (title, slug, description, price, is_paid, level, category_id) VALUES
('מבוא ל-JavaScript', 'intro-to-javascript', 'קורס מקיף למתחילים בשפת JavaScript', 299.00, true, 'BEGINNER', (SELECT id FROM categories WHERE slug = 'javascript')),
('React למתקדמים', 'advanced-react', 'קורס מתקדם בפיתוח עם React', 499.00, true, 'ADVANCED', (SELECT id FROM categories WHERE slug = 'react'));

-- Insert sample lessons
INSERT INTO lessons (title, slug, content, "order", course_id) VALUES
('מה זה JavaScript?', 'what-is-javascript', 'בשיעור זה נלמד על היסודות של JavaScript', 1, (SELECT id FROM courses WHERE slug = 'intro-to-javascript')),
('משתנים ופונקציות', 'variables-and-functions', 'נלמד כיצד להגדיר משתנים ופונקציות', 2, (SELECT id FROM courses WHERE slug = 'intro-to-javascript')),
('Hooks מתקדמים', 'advanced-hooks', 'נלמד על Hooks מתקדמים ב-React', 1, (SELECT id FROM courses WHERE slug = 'advanced-react'));