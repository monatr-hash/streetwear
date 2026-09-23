import { Product } from '@/lib/types';

// Demo catalog used until NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are set,
// or whenever the `products` table comes back empty. Replace freely.
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'vantablack-overshirt',
    name: 'Vantablack Overshirt',
    price: 385,
    images: [
      'https://picsum.photos/seed/cinder-01a/1200/1500',
      'https://picsum.photos/seed/cinder-01b/1200/1500',
      'https://picsum.photos/seed/cinder-01c/1200/1500',
      'https://picsum.photos/seed/cinder-01d/1200/1500',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Obsidian', hex: '#0a0a0a' },
      { name: 'Bronze Fade', hex: '#8b5e34' },
    ],
    stock: { S: 12, M: 9, L: 3, XL: 0, XXL: 6 },
    description:
      'Boxy overshirt in brushed Japanese twill, garment-dyed for a worn-in cast. Dropped shoulder, horn buttons, raw hem.',
    category: 'Outerwear',
  },
  {
    id: 'ember-wool-coat',
    name: 'Ember Wool Coat',
    price: 690,
    images: [
      'https://picsum.photos/seed/cinder-02a/1200/1500',
      'https://picsum.photos/seed/cinder-02b/1200/1500',
      'https://picsum.photos/seed/cinder-02c/1200/1500',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#27272a' },
      { name: 'Ember', hex: '#a9753f' },
    ],
    stock: { S: 4, M: 2, L: 5, XL: 8 },
    description:
      'Double-faced wool coat with a fused chest and a clean, seamless front. Cut long, worn open.',
    category: 'Outerwear',
  },
  {
    id: 'formless-cargo',
    name: 'Formless Cargo Trouser',
    price: 260,
    images: [
      'https://picsum.photos/seed/cinder-03a/1200/1500',
      'https://picsum.photos/seed/cinder-03b/1200/1500',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Onyx', hex: '#111113' }],
    stock: { S: 15, M: 20, L: 18, XL: 10, XXL: 2 },
    description:
      'Relaxed cargo trouser in enzyme-washed cotton twill, articulated knee and bellowed pockets.',
    category: 'Bottoms',
  },
  {
    id: 'relic-hoodie',
    name: 'Relic Heavyweight Hoodie',
    price: 210,
    images: [
      'https://picsum.photos/seed/cinder-04a/1200/1500',
      'https://picsum.photos/seed/cinder-04b/1200/1500',
      'https://picsum.photos/seed/cinder-04c/1200/1500',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Obsidian', hex: '#0a0a0a' },
      { name: 'Bone', hex: '#e4e4e7' },
    ],
    stock: { S: 22, M: 30, L: 4, XL: 14, XXL: 9 },
    description:
      '480gsm loopback cotton, garment-washed twice. Dropped shoulder, raw-edge hood tie.',
    category: 'Tops',
  },
];
