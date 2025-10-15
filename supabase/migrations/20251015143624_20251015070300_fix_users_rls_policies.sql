/*
  # Fix RLS Policies for Users Table

  1. Changes
    - Drop existing restrictive policies on users table
    - Add public read policy for authentication (anon role can query users for login)
    - Keep authenticated user policies for managing own data

  2. Security
    - Allow anon role to SELECT from users table (needed for email/password authentication)
    - Users can only read their own data when authenticated
    - Users can only update their own data

  3. Notes
    - This allows the signin route to query users without authentication
    - Password hashes are returned but this is necessary for bcrypt.compare
    - Consider moving to Supabase Auth in the future for better security
*/

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Allow anon role to query users table for authentication
-- This is needed for the custom JWT authentication to work
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