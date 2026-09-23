export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  /** Units remaining per size, e.g. { S: 12, M: 0, L: 3 }. Missing keys read as 0. */
  stock: Partial<Record<ProductSize, number>>;
  description: string;
  category?: string;
}

export interface CartItem {
  /** Unique per product + size + color combination. */
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: ProductSize;
  color: string;
  quantity: number;
}
