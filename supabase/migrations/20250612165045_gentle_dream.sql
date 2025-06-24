/*
  # Add anonymous insert policy for consultas table

  1. Security Changes
    - Add policy to allow anonymous users to insert into consultas table
    - This enables the contact forms on the website to work properly
    
  2. Policy Details
    - Allows INSERT operations for anonymous (public) role
    - Required for the consultation forms to function without authentication
*/

-- Add policy to allow anonymous users to insert into consultas table
CREATE POLICY "Allow anonymous insert into consultas"
  ON consultas
  FOR INSERT
  TO anon
  WITH CHECK (true);