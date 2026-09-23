'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Minus, Plus, X } from 'lucide-react';
import { useCart, FREE_SHIPPING_THRESHOLD } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, amountToFreeShipping, setQuantity, removeItem } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const shippingProgress = Math.min(
    100,
    ((FREE_SHIPPING_THRESHOLD - amountToFreeShipping) / FREE_SHIPPING_THRESHOLD) * 100
  );

  async function handleCheckout() {
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Checkout failed.');
      // Full navigation, not client-side routing — this is Stripe's own
      // hosted page, on stripe.com.
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed.');
      setIsCheckingOut(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/70"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-zinc-950 shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-100">
                Your Bag ({items.reduce((n, i) => n + i.quantity, 0)})
              </h2>
              <button
                onClick={closeCart}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            <div className="border-b border-zinc-800 px-6 py-4">
              {amountToFreeShipping > 0 ? (
                <p className="mb-2 text-xs text-zinc-400">
                  Add{' '}
                  <span className="text-bronze-400">{formatPrice(amountToFreeShipping)}</span>{' '}
                  more for free shipping
                </p>
              ) : (
                <p className="mb-2 text-xs text-bronze-400">
                  You&apos;ve unlocked free shipping
                </p>
              )}
              <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-full bg-bronze-400"
                />
              </div>
            </div>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm text-zinc-500">Your bag is empty.</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 text-xs font-semibold uppercase tracking-widest text-bronze-400"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-zinc-900">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-zinc-100">{item.name}</p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {item.color} · {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.key)}
                            className="text-zinc-600 hover:text-zinc-300"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border border-zinc-800">
                            <button
                              onClick={() => setQuantity(item.key, item.quantity - 1)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-50"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-xs text-zinc-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(item.key, item.quantity + 1)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-50"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <p className="text-sm font-medium text-zinc-100">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-zinc-800 px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-medium text-zinc-50">{formatPrice(subtotal)}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="flex w-full items-center justify-center gap-2 bg-zinc-50 py-4 text-xs font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-bronze-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCheckingOut && <Loader2 size={14} className="animate-spin" />}
                  {isCheckingOut ? 'Redirecting to Payment…' : 'Proceed to Checkout'}
                </motion.button>
                {checkoutError && (
                  <p className="mt-3 text-center text-xs text-red-400">{checkoutError}</p>
                )}
                <p className="mt-3 text-center text-[11px] text-zinc-600">
                  Taxes and duties calculated at checkout.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
