'use client';

import { cn } from '@/lib/utils';
import { Product, ProductSize } from '@/lib/types';

interface VariantSelectorProps {
  product: Product;
  selectedColor: string;
  selectedSize: ProductSize | null;
  onSelectColor: (name: string) => void;
  onSelectSize: (size: ProductSize) => void;
}

export default function VariantSelector({
  product,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
}: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Color — <span className="text-zinc-300">{selectedColor}</span>
        </p>
        <div className="flex gap-2.5">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onSelectColor(color.name)}
              aria-label={color.name}
              aria-pressed={selectedColor === color.name}
              className={cn(
                'h-8 w-8 rounded-full ring-1 ring-inset ring-zinc-700 transition-all',
                selectedColor === color.name &&
                  'ring-2 ring-bronze-400 ring-offset-2 ring-offset-zinc-950'
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Size
        </p>
        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((size) => {
            const stock = product.stock[size] ?? 0;
            const isOut = stock === 0;
            return (
              <button
                key={size}
                disabled={isOut}
                onClick={() => onSelectSize(size)}
                className={cn(
                  'border py-2.5 text-sm font-medium uppercase transition-colors',
                  isOut
                    ? 'cursor-not-allowed border-zinc-800 text-zinc-700 line-through'
                    : selectedSize === size
                    ? 'border-zinc-50 bg-zinc-50 text-zinc-950'
                    : 'border-zinc-700 text-zinc-200 hover:border-zinc-400'
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
