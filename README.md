# CINDER — luxury streetwear storefront

Next.js 15 (App Router) + Tailwind CSS + Framer Motion + Supabase + Stripe.

Dark-mode, editorial street-luxury commerce build: sticky glass nav, full-bleed
hero, product detail with gallery/variants/stock, a slide-over cart with a
free-shipping progress bar, a masonry lookbook grid, and a real Stripe
Checkout flow with server-side stock/price validation.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the keys below
npm run dev
```

The app runs fully **without** Supabase or Stripe configured — `lib/products.ts`
falls back to the demo catalog in `data/mock-products.ts`, and the cart drawer
will just show a "Stripe is not configured" error until `STRIPE_SECRET_KEY` is
set. Everything else (browsing, variants, the cart itself) works immediately.

## Supabase schema

Run this in the Supabase SQL editor:

```sql
create table products (
  id text primary key,
  name text not null,
  price numeric not null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors jsonb not null default '[]', -- [{ "name": "Obsidian", "hex": "#0a0a0a" }]
  stock jsonb not null default '{}',  -- { "S": 12, "M": 9, "L": 3, "XL": 0 }
  description text,
  category text,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Public read access"
  on products for select
  using (true);

-- Called by the Stripe webhook after a confirmed payment. Runs as a single
-- UPDATE so concurrent orders for the same size can't race each other into
-- an incorrect count, and security definer lets it bypass RLS safely —
-- only the webhook (using the service_role key) ever calls it.
create or replace function decrement_stock(p_product_id text, p_size text, p_qty int)
returns void as $$
begin
  update products
  set stock = jsonb_set(
    stock,
    array[p_size],
    to_jsonb(greatest(0, coalesce((stock ->> p_size)::int, 0) - p_qty))
  )
  where id = p_product_id;
end;
$$ language plpgsql security definer;
```

`stock` is a JSON object keyed by size so the low-stock badge — and the
server-side check at checkout — can work per size/variant rather than for
the product as a whole.

### User accounts

Auth reuses the same `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
you already have — no new secret is needed. Run this in addition to the
`products` table above:

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Runs automatically whenever someone signs up, so a profiles row
-- always exists alongside the auth.users row Supabase creates for you.
-- security definer is load-bearing here (unlike decrement_stock) —
-- without it, the trigger can't write into public.profiles.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

The `/account` page today only reads `user.email` straight from
`auth.getUser()` — it doesn't query `profiles` yet. The table exists so
you have somewhere to add a name, shipping address, or order history
later without restructuring anything.

**Supabase's default "Confirm email" setting is on.** After signing up,
a user can't actually sign in until they click the confirmation link in
their inbox — `AuthForm` shows a "check your email" message rather than
logging them in immediately. Turn this off in Authentication → Providers
→ Email in the Supabase dashboard if you want instant sign-in during
development.

## Stripe setup

1. Create a [Stripe account](https://dashboard.stripe.com/register) and grab
   your **test-mode** secret key from the Dashboard → set it as
   `STRIPE_SECRET_KEY`.
2. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and forward
   webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   It prints a `whsec_...` value the first time you run it — set that as
   `STRIPE_WEBHOOK_SECRET`.
3. In production, add a webhook endpoint in the Stripe Dashboard pointing at
   `https://yourdomain.com/api/webhooks/stripe`, subscribed to
   `checkout.session.completed`, and use *that* endpoint's signing secret
   instead.
4. Set `NEXT_PUBLIC_SITE_URL` to `http://localhost:3000` in dev, and your
   real domain in production — it's used to build the Checkout
   success/cancel URLs.

### How a purchase actually flows

1. **`components/CartDrawer.tsx`** sends only `{ productId, size, color,
   quantity }` per line item to `POST /api/checkout` — never a price.
2. **`app/api/checkout/route.ts`** looks up each product server-side,
   re-checks `stock[size]` against the requested quantity, and builds the
   Stripe line items from the **database's** price — not anything the
   client sent. If a size sold out between page load and checkout, it
   returns a `409` with a message the cart drawer surfaces inline.
3. The customer pays on Stripe's own hosted page (card numbers never touch
   this app).
4. **`app/api/webhooks/stripe/route.ts`** verifies the event's signature,
   and only then calls the `decrement_stock` RPC for each purchased size.
   This — not the browser reaching `/success` — is the authoritative,
   un-spoofable record that a payment actually happened.
5. `/success` clears the local cart and shows a confirmation; `/checkout`
   (Stripe's `cancel_url`) is shown if the customer backs out, with the cart
   left untouched.

## Architecture notes

- **Cart state** (`context/CartContext.tsx`) — `useReducer` + Context, no
  external state library. Persists to `localStorage` after mount only, to
  avoid a server/client hydration mismatch on first paint.
- **Data layer** (`lib/products.ts`) — thin wrapper around the Supabase
  client with a graceful fallback to mock data.
- **Four Supabase clients, each with a different job**: `lib/supabase.ts`
  (anon key, stateless, public product reads only), `lib/supabase-admin.ts`
  (service-role key, bypasses RLS, imported **only** by the webhook —
  never by anything that ships to the browser), `lib/supabase-browser.ts`
  (anon key + cookies, for auth calls from Client Components), and
  `lib/supabase-server.ts` (anon key + cookies, for reading the signed-in
  user in Server Components like `/account`).
- **`middleware.ts`** — refreshes the auth session cookie on every
  request. Server Components can read cookies but not write new ones
  back; middleware is what keeps a session from going stale mid-visit.
- **Routing** — `/` (hero + grid + lookbook), `/product/[id]` (detail page),
  `/success` and `/checkout` (Stripe's success/cancel landing pages),
  `/login`, `/signup`, `/account` (redirects to `/login` if signed out),
  `/about`.
- **Images** — hero/lookbook/product photography is stubbed with
  `picsum.photos` placeholders (seeded, so they're stable across reloads).
  Swap in real product photography and update `next.config.mjs`
  `images.remotePatterns` for whatever CDN/bucket you use.
- **Colors** — the palette maps directly onto Tailwind's built-in `zinc`
  scale (`zinc-950` ≈ `#09090b`, `zinc-900` ≈ `#18181b`, `zinc-50` ≈
  `#fafafa`), so only the `bronze` accent scale is added in
  `tailwind.config.ts`.

## Extending

- **Order records**: nothing is persisted per-order yet beyond the stock
  decrement. Add an `orders` table and insert a row from the webhook
  handler if you need order history or a customer-facing "my orders" page.
- **Per-color imagery**: `images` is currently one flat array per product;
  if you need different photos per color, key it as
  `Record<colorName, string[]>` instead and update
  `ProductGallery`/`ProductDetail` accordingly.
- **Auth extras**: OAuth providers (Google, Apple) are a couple of lines
  in the Supabase dashboard plus a redirect handler; password reset needs
  its own page and a Supabase `resetPasswordForEmail` call.
- **Email receipts**: Stripe can send its own receipt emails (toggle in
  Dashboard → Settings → Emails), or trigger your own from the webhook
  once you add order records.
