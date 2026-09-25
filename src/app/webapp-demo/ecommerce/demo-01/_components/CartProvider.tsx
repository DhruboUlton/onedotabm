'use client';

import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Product } from '../_data/catalog';

/**
 * Cart state for the Kaya Supply demo. Deliberately local: a reducer in React
 * context, scoped to this demo's layout. No persistence, no store library —
 * nothing here outlives the tab, which is what a demo needs.
 */

export interface CartLine {
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

type CartAction =
  | { type: 'add'; product: Product; quantity: number }
  | { type: 'setQuantity'; slug: string; quantity: number }
  | { type: 'remove'; slug: string }
  | { type: 'clear' };

function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const existing = lines.find((line) => line.slug === action.product.slug);
      if (existing) {
        return lines.map((line) =>
          line.slug === action.product.slug
            ? { ...line, quantity: line.quantity + action.quantity }
            : line
        );
      }
      return [
        ...lines,
        {
          slug: action.product.slug,
          name: action.product.name,
          price: action.product.price,
          quantity: action.quantity,
        },
      ];
    }
    case 'setQuantity':
      return action.quantity <= 0
        ? lines.filter((line) => line.slug !== action.slug)
        : lines.map((line) =>
            line.slug === action.slug ? { ...line, quantity: action.quantity } : line
          );
    case 'remove':
      return lines.filter((line) => line.slug !== action.slug);
    case 'clear':
      return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce((total, line) => total + line.price * line.quantity, 0);

    return {
      lines,
      itemCount,
      subtotal,
      add: (product, quantity = 1) => dispatch({ type: 'add', product, quantity }),
      setQuantity: (slug, quantity) => dispatch({ type: 'setQuantity', slug, quantity }),
      remove: (slug) => dispatch({ type: 'remove', slug }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
