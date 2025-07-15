/*
  # Add User Sessions Table for Cart Persistence

  1. New Tables
    - `user_sessions` - Store user session data including cart items
      - `user_id` (uuid, primary key, references customers)
      - `cart_data` (jsonb) - Stores cart items and state
      - `last_activity` (timestamptz) - Last activity timestamp
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_sessions` table
    - Add policies for users to manage their own session data
*/

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  user_id uuid PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
  cart_data jsonb DEFAULT '{}'::jsonb,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own session data"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session data"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own session data"
  ON user_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own session data"
  ON user_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO authenticated;