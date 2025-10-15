/*
  # Add Instructors Management and Enhanced Tracking

  ## New Tables
  
  1. **instructors**
    - `id` (uuid, primary key)
    - `user_id` (uuid, references users) - Link to user account
    - `bio` (text) - Instructor biography
    - `expertise` (text[]) - Areas of expertise
    - `is_active` (boolean) - Active status
    - `rating` (numeric) - Average rating
    - `total_students` (integer) - Total students taught
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  2. **course_instructors**
    - `id` (uuid, primary key)
    - `course_id` (uuid, references courses)
    - `instructor_id` (uuid, references instructors)
    - `role` (text) - Instructor role (lead, assistant)
    - `created_at` (timestamptz)
    - Junction table for many-to-many relationship
  
  3. **student_activity**
    - `id` (uuid, primary key)
    - `user_id` (uuid, references users)
    - `course_id` (uuid, references courses)
    - `lesson_id` (uuid, references lessons)
    - `activity_type` (text) - Type of activity
    - `duration` (integer) - Time spent in seconds
    - `created_at` (timestamptz)
    - Track detailed student activity
  
  ## Security
  - Enable RLS on all new tables
  - Add appropriate policies for admins and instructors
*/

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  expertise text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  rating numeric(3,2) DEFAULT 0,
  total_students integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create course_instructors junction table
CREATE TABLE IF NOT EXISTS course_instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  role text DEFAULT 'lead',
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, instructor_id)
);

-- Create student_activity table for detailed tracking
CREATE TABLE IF NOT EXISTS student_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  duration integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_instructors_user_id ON instructors(user_id);
CREATE INDEX IF NOT EXISTS idx_instructors_is_active ON instructors(is_active);
CREATE INDEX IF NOT EXISTS idx_course_instructors_course_id ON course_instructors(course_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_instructor_id ON course_instructors(instructor_id);
CREATE INDEX IF NOT EXISTS idx_student_activity_user_id ON student_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_student_activity_course_id ON student_activity(course_id);
CREATE INDEX IF NOT EXISTS idx_student_activity_created_at ON student_activity(created_at);

-- Enable RLS
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for instructors table
CREATE POLICY "Anyone can view active instructors"
  ON instructors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all instructors"
  ON instructors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

CREATE POLICY "Instructors can update own profile"
  ON instructors FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for course_instructors table
CREATE POLICY "Anyone can view course instructors"
  ON course_instructors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage course instructors"
  ON course_instructors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

-- RLS Policies for student_activity table
CREATE POLICY "Students can view own activity"
  ON student_activity FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Students can create own activity"
  ON student_activity FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all activity"
  ON student_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

CREATE POLICY "Instructors can view their course activity"
  ON student_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM course_instructors ci
      JOIN instructors i ON i.id = ci.instructor_id
      WHERE i.user_id = auth.uid()
      AND ci.course_id = student_activity.course_id
    )
  );