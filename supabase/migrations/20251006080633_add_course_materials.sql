/*
  # Add Course Materials System

  ## New Tables
  
  1. **course_materials**
    - `id` (uuid, primary key)
    - `course_id` (uuid, references courses)
    - `title` (text) - Material title
    - `description` (text) - Description
    - `type` (text) - Type: exercise, solution, guide, reference
    - `file_url` (text) - URL to file (or content)
    - `file_name` (text) - Original file name
    - `file_size` (integer) - File size in bytes
    - `order` (integer) - Display order
    - `is_active` (boolean)
    - `uploaded_by` (uuid, references users)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  ## Security
  - Enable RLS
  - Students can view materials for enrolled courses
  - Instructors can manage materials for their courses
  - Admins can manage all materials
*/

-- Create material_type enum
DO $$ BEGIN
  CREATE TYPE material_type AS ENUM ('exercise', 'solution', 'guide', 'reference', 'instructor_notes');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create course_materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type material_type NOT NULL DEFAULT 'reference',
  file_url text,
  file_name text,
  file_size integer DEFAULT 0,
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_type ON course_materials(type);
CREATE INDEX IF NOT EXISTS idx_course_materials_is_active ON course_materials(is_active);

-- Enable RLS
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Students can view materials for enrolled courses"
  ON course_materials FOR SELECT
  USING (
    is_active = true AND (
      EXISTS (
        SELECT 1 FROM enrollments
        WHERE enrollments.course_id = course_materials.course_id
        AND enrollments.user_id = auth.uid()
      )
      OR type != 'instructor_notes'
    )
  );

CREATE POLICY "Instructors can manage their course materials"
  ON course_materials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM course_instructors ci
      JOIN instructors i ON i.id = ci.instructor_id
      WHERE ci.course_id = course_materials.course_id
      AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all materials"
  ON course_materials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );
