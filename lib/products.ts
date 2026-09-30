import { supabase } from './supabase';
import { Product } from './types';
import { MOCK_PRODUCTS } from '@/data/mock-products';

const PRODUCT_COLUMNS = 'id, name, price, images, sizes, colors, stock, description, category';

// Helper function to extract a valid URL if markdown formatting slipped in
const cleanImageUrl = (url: string): string => {
  if (!url) return '';
  const match = url.match(/\((https?:\/\/[^\)]+)\)/) || url.match(/(https?:\/\/[^\s\]]+)/);
  return match ? match[1] : url;
};

// Helper function to process product images array
const sanitizeProduct = (product: Product): Product => {
  if (!product) return product;
  return {
    ...product,
    images: Array.isArray(product.images)
      ? product.images.map((img) => cleanImageUrl(img))
      : [],
  };
};

/**
 * Fetches the storefront catalog from Supabase. Falls back to local mock
 * data whenever Supabase isn't configured (or the table is empty), so the
 * app renders a full demo out of the box before you've wired up a backend.
 */
export async function getProducts(): Promise<Product[]> {
  if (!supabase) return MOCK_PRODUCTS.map(sanitizeProduct);

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return MOCK_PRODUCTS.map(sanitizeProduct);
  }

  const products = data as unknown as Product[];
  return products.map(sanitizeProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!supabase) {
    const mock = MOCK_PRODUCTS.find((p) => p.id === id);
    return mock ? sanitizeProduct(mock) : null;
  }

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .single();

  if (error || !data) {
    const mock = MOCK_PRODUCTS.find((p) => p.id === id);
    return mock ? sanitizeProduct(mock) : null;
  }

  return sanitizeProduct(data as unknown as Product);
}