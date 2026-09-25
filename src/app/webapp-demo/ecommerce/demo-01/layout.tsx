import React from 'react';
import type { Metadata } from 'next';
import { CartProvider } from './_components/CartProvider';
import { storeName, storeTagline } from './_data/catalog';

/**
 * Demo root. Holds only what both the storefront and the admin panel need —
 * the cart state. Each of those two has its own layout for its own chrome.
 */

export const metadata: Metadata = {
  title: {
    default: `${storeName} — E-commerce Website Demo`,
    template: `%s | ${storeName} Demo`,
  },
  description: `Explore an interactive e-commerce website demo created by OneDot ABM. ${storeTagline}`,
  robots: { index: false, follow: false },
};

export default function Demo01Layout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
