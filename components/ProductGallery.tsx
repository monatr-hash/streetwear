'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className={cn(
              'relative h-20 w-16 shrink-0 overflow-hidden bg-zinc-900 ring-1 ring-inset transition-all',
              active === i ? 'ring-bronze-400' : 'ring-zinc-800 hover:ring-zinc-600'
            )}
            aria-label={`Show image ${i + 1}`}
            aria-pressed={active === i}
          >
            <Image src={src} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="group relative aspect-[4/5] flex-1 overflow-hidden bg-zinc-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
