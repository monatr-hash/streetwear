'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import ProductGallery from './ProductGallery';
import VariantSelector from './VariantSelector';
import { Product, ProductSize } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const LOW_STOCK_THRESHOLD = 5;

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? '');
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'added'>('idle');

  const selectedStock = selectedSize ? product.stock[selectedSize] ?? 0 : null;

  const stockMessage = useMemo(() => {
    if (!selectedSize || selectedStock === null) return null;
    if (selectedStock === 0) return `Out of stock in size ${selectedSize}`;
    if (selectedStock <= LOW_STOCK_THRESHOLD)
      return `Low stock — only ${selectedStock} left in size ${selectedSize}`;
    return null;
  }, [selectedSize, selectedStock]);

  const canAdd = Boolean(selectedSize) && selectedStock !== 0 && status === 'idle';

  function handleAddToCart() {
    if (!selectedSize || !canAdd) return;
    setStatus('loading');
    // Simulated latency for the loading state. Swap this for a real
    // inventory-reservation call once stock is written server-side.
    setTimeout(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      });
      setStatus('added');
      setTimeout(() => setStatus('idle'), 1500);
    }, 550);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {product.category}
        </p>
        <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight text-zinc-50 sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-3 text-xl font-medium text-zinc-100">{formatPrice(product.price)}</p>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
          {product.description}
        </p>

        <div className="mt-8">
          <VariantSelector
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onSelectColor={setSelectedColor}
            onSelectSize={setSelectedSize}
          />
        </div>

        {stockMessage && (
          <p
            className={cn(
              'mt-4 text-xs font-medium uppercase tracking-wide',
              selectedStock === 0 ? 'text-zinc-500' : 'text-bronze-400'
            )}
          >
            {stockMessage}
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={!canAdd}
          className={cn(
            'mt-6 flex w-full items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest transition-colors',
            status === 'added'
              ? 'bg-bronze-400 text-zinc-950'
              : canAdd
              ? 'bg-zinc-50 text-zinc-950 hover:bg-bronze-400'
              : 'cursor-not-allowed bg-zinc-800 text-zinc-500'
          )}
        >
          {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
          {status === 'added' && <Check size={16} />}
          {status === 'idle' && !selectedSize
            ? 'Select a Size'
            : status === 'added'
            ? 'Added to Bag'
            : 'Add to Cart'}
        </motion.button>

        <p className="mt-4 text-xs text-zinc-600">
          Free shipping on orders over {formatPrice(300)}. Cut and sewn in limited runs —
          restocks are not guaranteed.
        </p>
      </div>
    </div>
  );
}
