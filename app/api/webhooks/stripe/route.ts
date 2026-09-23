import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface PurchasedItem {
  id: string;
  s: string;
  q: number;
}

export async function POST(request: NextRequest) {
  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured.' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = request.headers.get('stripe-signature');
  // Signature verification needs the raw, untouched request body — do
  // not JSON.parse this before calling constructEvent.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error('Missing stripe-signature header');
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    // This check is what stops anyone from POSTing a fake
    // "checkout.session.completed" body straight to this endpoint and
    // getting stock decremented (or fulfilment triggered) for free.
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await decrementStockFromSession(session);
  }

  return NextResponse.json({ received: true });
}

async function decrementStockFromSession(session: Stripe.Checkout.Session) {
  if (!supabaseAdmin) {
    console.error(
      'SUPABASE_SERVICE_ROLE_KEY is not set — payment succeeded but stock was not decremented.'
    );
    return;
  }

  const metadata = session.metadata ?? {};
  const encoded = Object.keys(metadata)
    .filter((key) => key.startsWith('items_'))
    .sort((a, b) => Number(a.split('_')[1]) - Number(b.split('_')[1]))
    .map((key) => metadata[key])
    .join('');

  if (!encoded) return;

  let items: PurchasedItem[];
  try {
    items = JSON.parse(encoded);
  } catch (err) {
    console.error('Could not parse purchased items from session metadata:', err);
    return;
  }

  // Each call is a single atomic UPDATE (see decrement_stock in the
  // Supabase schema) so concurrent orders for the same size can't race
  // each other into an incorrect stock count.
  for (const item of items) {
    const { error } = await supabaseAdmin.rpc('decrement_stock', {
      p_product_id: item.id,
      p_size: item.s,
      p_qty: item.q,
    });
    if (error) {
      console.error(`Failed to decrement stock for ${item.id} (${item.s}):`, error);
    }
  }
}
