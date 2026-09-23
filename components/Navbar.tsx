'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchOverlay from './SearchOverlay';

const NAV_LINKS = [
  { href: '/#collection', label: 'Drop 01' },
  { href: '/#lookbook', label: 'Lookbook' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="-ml-2 p-2 text-zinc-300 hover:text-zinc-50 lg:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="text-xl font-black tracking-tight text-zinc-50">
          CINDER
        </Link>

        <nav className="hidden gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="rounded-full p-2 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-50"
            aria-label="Search"
          >
            <Search size={19} />
          </button>
          <Link
            href="/account"
            className="hidden rounded-full p-2 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-50 sm:inline-flex"
            aria-label="Account"
          >
            <User size={19} />
          </Link>
          <button
            onClick={toggleCart}
            className="relative rounded-full p-2 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-50"
            aria-label="Cart"
          >
            <ShoppingBag size={19} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-bronze-400 text-[10px] font-bold text-zinc-950"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-zinc-800/60 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 text-sm font-medium uppercase tracking-widest text-zinc-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
