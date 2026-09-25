'use client';

import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../../_components/ProductCard';
import { Product, ProductCategory } from '../../_data/catalog';

type SortKey = 'featured' | 'price-asc' | 'price-desc';

const sortLabels: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
};

/**
 * Catalogue filtering runs entirely in the browser over the static product
 * list — no query, no API. The server component passes the data in.
 */
export function ProductBrowser({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: ProductCategory[];
  initialCategory: string | null;
}) {
  const [category, setCategory] = useState<string>(initialCategory ?? 'all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesQuery =
        term === '' ||
        product.name.toLowerCase().includes(term) ||
        product.blurb.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });

    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, category, query, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 border-b border-[#E7E2DA] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
            All
          </FilterChip>
          {categories.map((item) => (
            <FilterChip
              key={item.slug}
              active={category === item.slug}
              onClick={() => setCategory(item.slug)}
            >
              {item.name}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9189]"
              aria-hidden="true"
            />
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-[#E7E2DA] bg-white py-2.5 pl-10 pr-4 text-sm text-[#2B2620] placeholder:text-[#9A9189] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2B2620] sm:w-56"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9189]"
              aria-hidden="true"
            />
            <label htmlFor="product-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="product-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full appearance-none rounded-full border border-[#E7E2DA] bg-white py-2.5 pl-10 pr-8 text-sm text-[#2B2620] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2B2620] sm:w-auto"
            >
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="pt-6 text-xs text-[#6B6259]" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'product' : 'products'}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visible.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-[#D6CFC4] bg-white p-10 text-center">
          <p className="font-medium">Nothing matches that</p>
          <p className="mt-1 text-sm text-[#6B6259]">
            Try a different search, or clear the filters to see everything.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-5 inline-flex rounded-full border border-[#D6CFC4] bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#F3EFE9] active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm transition-colors active:scale-[0.97] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620] ${
        active
          ? 'border-[#2B2620] bg-[#2B2620] text-white'
          : 'border-[#E7E2DA] bg-white text-[#6B6259] hover:text-[#2B2620]'
      }`}
    >
      {children}
    </button>
  );
}
