/*
  # Make name column nullable in profiles table

  1. Changes
    - Alter the `name` column in `profiles` table to allow NULL values
    - This fixes the constraint error when creating profiles without a name field

  2. Security
    - No changes to RLS policies
    - Maintains existing security structure
*/

-- Make the name column nullable in profiles table
ALTER TABLE public.profiles 
ALTER COLUMN name DROP NOT NULL;