/*
  # Add Missing RLS Policies

  1. Security Enhancements
    - Add RLS policies for tables that are missing them
    - Ensure proper access control for all tables
  
  2. Tables Updated
    - `course_files` - Add policies for file access
    - `faqs` - Add policies for FAQ viewing
    - `group_memberships` - Add policies for group member management
    - `invite_codes` - Add policies for invite code management
  
  3. Access Patterns
    - Students can view FAQs for courses they're enrolled in
    - Admins and content managers can manage all content
    - Group members can view their memberships
    - Invite codes accessible only to admins
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- FAQs
  DROP POLICY IF EXISTS "Anyone can view active FAQs" ON faqs;
  DROP POLICY IF EXISTS "Admins can manage FAQs" ON faqs;
  
  -- Course Files
  DROP POLICY IF EXISTS "Enrolled students can view course files" ON course_files;
  DROP POLICY IF EXISTS "Admins can manage course files" ON course_files;
  
  -- Group Memberships
  DROP POLICY IF EXISTS "Users can view own group memberships" ON group_memberships;
  DROP POLICY IF EXISTS "Admins can manage group memberships" ON group_memberships;
  
  -- Invite Codes
  DROP POLICY IF EXISTS "Admins can view all invite codes" ON invite_codes;
  DROP POLICY IF EXISTS "Admins can manage invite codes" ON invite_codes;
  DROP POLICY IF EXISTS "Users can use invite codes" ON invite_codes;
END $$;

-- FAQs Policies
CREATE POLICY "Anyone can view active FAQs"
  ON faqs FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage FAQs"
  ON faqs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

-- Course Files Policies
CREATE POLICY "Enrolled students can view course files"
  ON course_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = course_files.course_id
      AND enrollments.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

CREATE POLICY "Admins can manage course files"
  ON course_files FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

-- Group Memberships Policies
CREATE POLICY "Users can view own group memberships"
  ON group_memberships FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

CREATE POLICY "Admins can manage group memberships"
  ON group_memberships FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

-- Invite Codes Policies
CREATE POLICY "Admins can view all invite codes"
  ON invite_codes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('ADMIN', 'CONTENT_MANAGER')
    )
  );

CREATE POLICY "Admins can manage invite codes"
  ON invite_codes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Users can use invite codes"
  ON invite_codes FOR UPDATE
  TO authenticated
  USING (
    used_by IS NULL
    AND expires_at > now()
    AND (email IS NULL OR email = (SELECT email FROM users WHERE id = auth.uid()))
  )
  WITH CHECK (
    used_by = auth.uid()
  );
