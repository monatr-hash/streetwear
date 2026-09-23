'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="relative flex h-[92vh] min-h-[560px] w-full items-end overflow-hidden bg-zinc-950">
      <Image
        // Replace with real macro product photography for the actual site.
        src="https://picsum.photos/seed/cinder-hero/1920/2400"
        alt="CINDER Drop 01 campaign image"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-90 grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-4 text-xs font-semibold uppercase tracking-widest text-bronze-300"
        >
          Autumn / Winter
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight text-zinc-50 sm:text-6xl lg:text-8xl"
        >
          Drop 01
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-5 max-w-md text-base text-zinc-300"
        >
          Fourteen pieces built from raw-edge tailoring and heavyweight cloth. Cut for
          the city, finished by hand in small batches.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-8"
        >
          <Link href="#collection">
            <motion.span
              whileHover={{ backgroundColor: '#C08F52', color: '#09090b', borderColor: '#C08F52' }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center border border-zinc-50 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-zinc-50"
            >
              Shop the Collection
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
