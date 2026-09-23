import Link from 'next/link';
import Navbar from '@/components/Navbar';

// Stripe redirects here as `cancel_url` if the customer backs out of the
// hosted checkout page. Their cart is untouched — nothing was charged.
export default function CheckoutCancelledPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-zinc-50">
          Checkout Cancelled
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          No payment was taken. Your bag is still saved — pick up where you left off
          whenever you&apos;re ready.
        </p>
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
