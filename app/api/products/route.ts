import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

// Read-only, public data — same product info anyone can already see by
// browsing the site. No auth needed, nothing sensitive to protect here.
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}
