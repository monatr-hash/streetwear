import Link from 'next/link';
import Stripe from 'stripe';
import Navbar from '@/components/Navbar';
import ClearCartOnMount from '@/components/ClearCartOnMount';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  let amountTotal: number | null = null;
  let customerEmail: string | null = null;

  if (session_id && stripeSecretKey) {
    try {
      const stripe = new Stripe(stripeSecretKey);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      amountTotal = session.amount_total;
      customerEmail = session.customer_details?.email ?? null;
    } catch {
      // A failed lookup here shouldn't block the confirmation screen —
      // the webhook (not this page) is the source of truth for
      // fulfilment and stock, and it already ran independently of
      // whether this GET request succeeds.
    }
  }

  return (
    <>
      <Navbar />
      <ClearCartOnMount />
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-zinc-50">
          Order Confirmed
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          {customerEmail
            ? `A confirmation has been sent to ${customerEmail}.`
            : 'Thank you for your order.'}
        </p>
        {amountTotal !== null && (
          <p className="mt-4 text-lg font-medium text-zinc-100">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'usd',
            }).format(amountTotal / 100)}
          </p>
        )}
        <Link
          href="/"
          className="mt-6 text-xs font-semibold uppercase tracking-widest text-bronze-400"
        >
          Continue Shopping
        </Link>
      </main>
    </>
  );
}
