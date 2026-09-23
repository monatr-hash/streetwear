'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LookbookItem {
  id: string;
  image: string;
  caption: string;
  aspect: 'portrait' | 'square' | 'tall';
}

// Swap these for real lifestyle photography — seeds just keep the
// placeholders stable across reloads.
const LOOKBOOK_ITEMS: LookbookItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/cinder-look-1/900/1200', caption: 'Look 01 — Ember Wool Coat', aspect: 'portrait' },
  { id: '2', image: 'https://picsum.photos/seed/cinder-look-2/900/900', caption: 'Look 02 — Relic Hoodie', aspect: 'square' },
  { id: '3', image: 'https://picsum.photos/seed/cinder-look-3/900/1400', caption: 'Look 03 — Vantablack Overshirt', aspect: 'tall' },
  { id: '4', image: 'https://picsum.photos/seed/cinder-look-4/900/1200', caption: 'Look 04 — Formless Cargo', aspect: 'portrait' },
  { id: '5', image: 'https://picsum.photos/seed/cinder-look-5/900/900', caption: 'Look 05 — Layered Study', aspect: 'square' },
  { id: '6', image: 'https://picsum.photos/seed/cinder-look-6/900/1400', caption: 'Look 06 — Studio Session', aspect: 'tall' },
];

const aspectClass: Record<LookbookItem['aspect'], string> = {
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  tall: 'aspect-[3/5]',
};

export default function LookbookGrid() {
  return (
    <section id="lookbook" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-zinc-50 sm:text-4xl">
          Lookbook
        </h2>
        <p className="hidden text-sm text-zinc-500 sm:block">Fall/Winter 2026</p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {LOOKBOOK_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative mb-4 break-inside-avoid overflow-hidden bg-zinc-900"
          >
            <div className={aspectClass[item.aspect]}>
              <Image
                src={item.image}
                alt={item.caption}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 to-transparent p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-100">
                {item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
