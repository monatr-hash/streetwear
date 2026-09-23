import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Auth-aware client for Server Components, Server Actions, and Route
 * Handlers. Reads the session from the incoming request's cookies, so
 * `auth.getUser()` reflects who's actually signed in — this is what
 * app/account/page.tsx uses to decide whether to render the account
 * page or redirect to /login.
 *
 * `cookies()` is async in Next.js 15, so this helper is too.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can't set cookies on the response —
            // safe to ignore here because middleware.ts is already
            // refreshing the session on every request.
          }
        },
      },
    }
  );
}
