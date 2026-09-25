import React from 'react';
import type { Metadata } from 'next';
import { CartView } from './CartView';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Cart and checkout interface in the Kaya Supply e-commerce demo.',
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Cart</h1>
      <p className="mt-2 text-sm text-[#6B6259]">
        Quantities and totals update live. Checkout is frontend only.
      </p>

      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
