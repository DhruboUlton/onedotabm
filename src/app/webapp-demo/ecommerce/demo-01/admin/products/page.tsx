import React from 'react';
import type { Metadata } from 'next';
import { ProductsTable } from './ProductsTable';
import { products } from '../../_data/catalog';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Product management interface in the Kaya Supply admin demo.',
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Products</h1>
        <p className="mt-1 text-sm text-[#5A5F6B]">
          Filters and search work locally. Editing is out of scope for the demo.
        </p>
      </header>

      <ProductsTable products={products} />
    </div>
  );
}
