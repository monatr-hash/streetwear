import { createBrowserClient } from '@supabase/ssr';

/**
 * Auth-aware client for Client Components ('use client'). Unlike the
 * plain client in lib/supabase.ts (which is stateless and only used for
 * public product reads), this one reads and writes the session cookie —
 * it's what makes supabase.auth.signInWithPassword / signUp / signOut
 * actually persist a session across page loads.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
