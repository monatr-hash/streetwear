import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductById } from '@/lib/products';
import { ProductSize } from '@/lib/types';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Only what we need to look the real product back up — price, name,
// image and stock all come from the database, never from this payload.
interface IncomingItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

interface PurchasedItem {
  id: string;
  s: string;
  q: number;
}

export async function POST(request: NextRequest) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: 'Stripe is not configured on this server yet.' },
      { status: 500 }
    );
  }

  let items: IncomingItem[];
  try {
    const body = await request.json();
    items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('empty cart');
    }
  } catch {
    return NextResponse.json({ error: 'Invalid cart payload.' }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const purchased: PurchasedItem[] = [];

  // This loop is the actual security boundary: every price and every
  // stock check is re-derived from the database here. Nothing the
  // client sent about price or availability is trusted.
  for (const requested of items) {
    const product = await getProductById(requested.productId);
    if (!product) {
      return NextResponse.json(
        { error: `One item in your bag is no longer available.` },
        { status: 409 }
      );
    }

    const size = requested.size as ProductSize;
    const availableStock = product.stock[size] ?? 0;
    const quantity = Math.max(1, Math.floor(requested.quantity) || 1);

    if (availableStock < quantity) {
      return NextResponse.json(
        {
          error:
            availableStock === 0
              ? `${product.name} (size ${requested.size}) just sold out.`
              : `Only ${availableStock} left of ${product.name} (size ${requested.size}).`,
        },
        { status: 409 }
      );
    }

    lineItems.push({
      quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: `${product.name} — ${requested.color} / ${requested.size}`,
          images: product.images[0] ? [product.images[0]] : undefined,
        },
      },
    });

    purchased.push({ id: product.id, s: requested.size, q: quantity });
  }

  // Stripe caps each metadata value at 500 characters, so the encoded
  // cart is chunked across as many `items_N` keys as it needs. The
  // webhook reassembles them in order before decrementing stock.
  const metadata: Record<string, string> = {};
  const encoded = JSON.stringify(purchased);
  const CHUNK_SIZE = 450;
  for (let i = 0, part = 0; i < encoded.length; i += CHUNK_SIZE, part += 1) {
    metadata[`items_${part}`] = encoded.slice(i, i + CHUNK_SIZE);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout`,
    metadata,
    // Customize to the countries you actually ship to.
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'FR', 'DE', 'AU'],
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
