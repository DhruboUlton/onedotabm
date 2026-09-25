import React from 'react';
import type { Metadata } from 'next';
import { ProductBrowser } from './ProductBrowser';
import { getStorefrontProducts, productCategories } from '../../_data/catalog';

export const metadata: Metadata = {
  title: 'Shop all',
  description: 'Browse the full Kaya Supply catalogue in this interactive e-commerce demo.',
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const valid = productCategories.some((item) => item.slug === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <header className="mb-8">
        <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Shop all</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B6259]">
          Everything currently in production. Filters and search run instantly — this is the whole
          catalogue, not a paginated slice.
        </p>
      </header>

      <ProductBrowser
        products={getStorefrontProducts()}
        categories={productCategories}
        initialCategory={valid ? (category as string) : null}
      />
    </div>
  );
}
