'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the catalog once, the first time the overlay opens — not on
  // every keystroke. All filtering below happens client-side against
  // this cached copy.
  useEffect(() => {
    if (!isOpen || products.length > 0) return;
    setIsLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setIsLoading(false));
  }, [isOpen, products.length]);

  const results =
    query.trim().length === 0
      ? []
      : products.filter((p) => {
          const haystack = `${p.name} ${p.category ?? ''} ${p.description}`.toLowerCase();
          return haystack.includes(query.trim().toLowerCase());
        });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex flex-col bg-zinc-950/98 backdrop-blur-sm"
          role="dialog"
          aria-label="Search products"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pt-24 sm:px-6">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
              <SearchIcon size={20} className="shrink-0 text-zinc-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent text-xl text-zinc-50 placeholder:text-zinc-600 focus:outline-none"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="shrink-0 rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="scrollbar-thin flex-1 overflow-y-auto py-8">
              {isLoading && <p className="text-sm text-zinc-500">Loading catalog…</p>}

              {!isLoading && query.trim().length > 0 && results.length === 0 && (
                <p className="text-sm text-zinc-500">
                  No results for <span className="text-zinc-300">{query}</span>.
                </p>
              )}

              <ul className="space-y-1">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-zinc-900"
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-zinc-900">
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-100">{product.name}</p>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          {product.category}
                        </p>
                      </div>
                      <p className="text-sm text-zinc-300">{formatPrice(product.price)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
