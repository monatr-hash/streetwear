'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

/** Empties the local cart once, after a successful Stripe redirect. */
export default function ClearCartOnMount() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (hasCleared.current) return;
    hasCleared.current = true;
    clearCart();
  }, [clearCart]);

  return null;
}
