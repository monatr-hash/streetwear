import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only client that bypasses Row Level Security using the
 * `service_role` key. This is what lets the Stripe webhook decrement
 * stock after a confirmed payment.
 *
 * DO NOT import this from a Client Component, or anything that ends up
 * in a browser bundle — `SUPABASE_SERVICE_ROLE_KEY` has no `NEXT_PUBLIC_`
 * prefix specifically so Next.js will refuse to expose it to the client,
 * but that protection only holds if this file is only ever imported from
 * server-only code (Route Handlers, Server Actions).
 */
export const supabaseAdmin =
  supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;
