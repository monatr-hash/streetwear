'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-100">{product.name}</h3>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-zinc-500">
              {product.category}
            </p>
          </div>
          <p className="text-sm font-medium text-zinc-100">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
