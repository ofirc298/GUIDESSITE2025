/*
  # Create logs table for client and server logging

  1. New Tables
    - `logs`
      - `id` (bigserial, primary key)
      - `ts` (timestamptz, default now())
      - `level` (text, check constraint for valid levels)
      - `source` (text, indicates client/server/api)
      - `message` (text, log message)
      - `extra` (jsonb, additional data)

  2. Security
    - Enable RLS on `logs` table
    - Add policy for admins to read logs
    - Add policy for authenticated users to insert logs
*/

CREATE TABLE IF NOT EXISTS logs (
  id bigserial PRIMARY KEY,
  ts timestamptz NOT NULL DEFAULT now(),
  level text NOT NULL CHECK (level IN ('debug','info','warn','error')),
  source text NOT NULL,
  message text NOT NULL,
  extra jsonb
);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert logs
CREATE POLICY "Users can insert logs"
  ON logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow admins to read all logs
CREATE POLICY "Admins can read all logs"
  ON logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_logs_ts ON logs(ts DESC);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_source ON logs(source);