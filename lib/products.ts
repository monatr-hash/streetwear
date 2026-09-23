import { supabase } from './supabase';
import { Product } from './types';
import { MOCK_PRODUCTS } from '@/data/mock-products';

const PRODUCT_COLUMNS = 'id, name, price, images, sizes, colors, stock, description, category';

/**
 * Fetches the storefront catalog from Supabase. Falls back to local mock
 * data whenever Supabase isn't configured (or the table is empty), so the
 * app renders a full demo out of the box before you've wired up a backend.
 */
export async function getProducts(): Promise<Product[]> {
  if (!supabase) return MOCK_PRODUCTS;

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) return MOCK_PRODUCTS;
  return data as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!supabase) return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .single();

  if (error || !data) return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  return data as unknown as Product;
}
