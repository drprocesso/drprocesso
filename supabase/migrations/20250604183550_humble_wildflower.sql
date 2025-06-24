/*
  # Create consultas table for process tracking

  1. New Table
    - `consultas`: Stores process consultation records
      - `id` (uuid, primary key)
      - `whatsapp` (text, not null)
      - `nome` (text, not null)
      - `status` (text, not null)
      - `processos` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for service role to read
    - Add policy for public to insert
*/

-- Create consultas table
CREATE TABLE IF NOT EXISTS public.consultas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp text NOT NULL,
  nome text NOT NULL,
  status text NOT NULL,
  processos jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for service role"
  ON public.consultas
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON public.consultas
  FOR INSERT
  TO public
  WITH CHECK (true);