/*
  # Initial schema setup for Dr. Processo

  1. New Tables
    - `users`: Stores user information for process consultation
      - `id` (uuid, primary key)
      - `name` (text)
      - `whatsapp` (text)
      - `email` (text)
      - `document` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `contact_messages`: Stores contact form submissions
      - `id` (uuid, primary key)
      - `name` (text)
      - `whatsapp` (text)
      - `email` (text)
      - `question` (text)
      - `created_at` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users and service role
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  whatsapp text NOT NULL,
  email text NOT NULL,
  document text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  whatsapp text NOT NULL,
  email text NOT NULL,
  question text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Enable read access for service role" ON users
  FOR SELECT TO service_role
  USING (true);

CREATE POLICY "Enable insert access for all users" ON users
  FOR INSERT
  WITH CHECK (true);

-- Create policies for contact_messages table
CREATE POLICY "Enable read access for service role" ON contact_messages
  FOR SELECT TO service_role
  USING (true);

CREATE POLICY "Enable insert access for all users" ON contact_messages
  FOR INSERT
  WITH CHECK (true);