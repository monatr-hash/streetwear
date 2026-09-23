'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  ReactNode,
} from 'react';
import { CartItem, ProductSize } from '@/lib/types';

const STORAGE_KEY = 'cinder-cart-v1';
export const FREE_SHIPPING_THRESHOLD = 300;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; key: string }
  | { type: 'SET_QUANTITY'; key: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.key === action.item.key);
      const items = existing
        ? state.items.map((i) =>
            i.key === action.item.key
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          )
        : [...state.items, action.item];
      return { ...state, items, isOpen: true };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.key !== action.key) };
    case 'SET_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((i) => (i.key === action.key ? { ...i, quantity: action.quantity } : i))
          .filter((i) => i.quantity > 0),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  amountToFreeShipping: number;
  addItem: (item: Omit<CartItem, 'key'> & { size: ProductSize }) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load whatever was persisted, on mount only — reading localStorage
  // during render would desync server/client output and throw a
  // hydration-mismatch error.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', items: JSON.parse(raw) });
    } catch {
      // Corrupted or inaccessible storage — just start with an empty cart.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist on every change, but only once hydration has run — otherwise
  // the empty initial state would overwrite storage before it's read.
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, isHydrated]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    amountToFreeShipping,
    addItem: (item) =>
      dispatch({
        type: 'ADD_ITEM',
        item: { ...item, key: `${item.productId}-${item.size}-${item.color}` },
      }),
    removeItem: (key) => dispatch({ type: 'REMOVE_ITEM', key }),
    setQuantity: (key, quantity) => dispatch({ type: 'SET_QUANTITY', key, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    openCart: () => dispatch({ type: 'OPEN' }),
    closeCart: () => dispatch({ type: 'CLOSE' }),
    toggleCart: () => dispatch({ type: 'TOGGLE' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
