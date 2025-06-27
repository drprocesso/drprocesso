import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks and better error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// More detailed error checking
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not defined in environment variables');
  console.error('Available env vars:', Object.keys(import.meta.env));
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined in environment variables');
  console.error('Available env vars:', Object.keys(import.meta.env));
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly set.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);