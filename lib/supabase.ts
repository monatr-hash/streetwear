import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Public, read-only client for storefront data (products, stock, etc).
 * Safe to import from both Server and Client Components — it only ever
 * uses the anon key and never touches authenticated/user data.
 *
 * Returns `null` when env vars aren't set yet, so the app can fall back
 * to local mock data instead of crashing during setup.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
