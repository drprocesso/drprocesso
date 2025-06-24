/*
  # Add INSERT policy for profiles table

  1. Changes
    - Add new RLS policy to allow authenticated users to create their own profile
  
  2. Security
    - Policy ensures users can only create their own profile
    - Validates that the user_id matches the authenticated user's ID
*/

CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);