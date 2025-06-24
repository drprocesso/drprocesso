/*
  # Update consultas table structure

  1. Changes
    - Add cpf column to consultas table
    - Add email column to consultas table  
    - Make nome column nullable
    - Add updated_at column with default now()
    - Set created_at default to now()
    - Add total_processos_alerta column
    - Add processo_exibicao_borrado column
    - Add possui_processo_real_card column

  2. Security
    - Maintain existing RLS policies
    - Add policy for anonymous read access
*/

-- Add missing columns to consultas table
DO $$
BEGIN
  -- Add cpf column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultas' AND column_name = 'cpf'
  ) THEN
    ALTER TABLE public.consultas ADD COLUMN cpf text NOT NULL;
  END IF;

  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultas' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.consultas ADD COLUMN email text NOT NULL;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultas' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.consultas ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  -- Add total_processos_alerta column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultas' AND column_name = 'total_processos_alerta'
  ) THEN
    ALTER TABLE public.consultas ADD COLUMN total_processos_alerta smallint;
  END IF;

  -- Add processo_exibicao_borrado column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultas' AND column_name = 'processo_exibicao_borrado'
  ) THEN
    ALTER TABLE public.consultas ADD COLUMN processo_exibicao_borrado jsonb;
  END IF;

  -- Add possui_processo_real_card column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultas' AND column_name = 'possui_processo_real_card'
  ) THEN
    ALTER TABLE public.consultas ADD COLUMN possui_processo_real_card boolean;
  END IF;
END $$;

-- Make nome column nullable
ALTER TABLE public.consultas ALTER COLUMN nome DROP NOT NULL;

-- Set default for created_at if not already set
ALTER TABLE public.consultas ALTER COLUMN created_at SET DEFAULT now();

-- Add policy for anonymous read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'consultas' AND policyname = 'Allow anon read'
  ) THEN
    CREATE POLICY "Allow anon read"
      ON public.consultas
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;