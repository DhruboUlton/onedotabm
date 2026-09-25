'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Product, formatPrice } from '../../_data/catalog';

type StatusFilter = 'all' | Product['status'];

const statusStyles: Record<Product['status'], string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-slate-50 text-slate-600 border-slate-200',
  archived: 'bg-rose-50 text-rose-700 border-rose-200',
};

const filters: StatusFilter[] = ['all', 'active', 'draft', 'archived'];

/** Filtering is local state over the static list — no backend behind it. */
export function ProductsTable({ products }: { products: Product[] }) {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesStatus = status === 'all' || product.status === status;
      const matchesQuery =
        term === '' ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [products, status, query]);

  return (
    <div className="rounded-xl border border-[#E3E5EB] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#E3E5EB] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              aria-pressed={status === item}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors active:scale-[0.97] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                status === item
                  ? 'bg-[#1B1F27] text-white'
                  : 'border border-[#E3E5EB] text-[#5A5F6B] hover:bg-[#F1F2F6]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A90A0]"
            aria-hidden="true"
          />
          <label htmlFor="admin-product-search" className="sr-only">
            Search products
          </label>
          <input
            id="admin-product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="w-full rounded-lg border border-[#E3E5EB] py-2 pl-9 pr-3 text-sm placeholder:text-[#8A90A0] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4F46E5] sm:w-56"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="p-8 text-center text-sm text-[#5A5F6B]">No products match those filters.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E3E5EB] text-left text-xs uppercase tracking-wider text-[#8A90A0]">
                  <th scope="col" className="px-5 py-3 font-medium">Product</th>
                  <th scope="col" className="px-5 py-3 font-medium">Category</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Stock</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5EB]">
                {visible.map((product) => (
                  <tr key={product.slug} className="transition-colors hover:bg-[#F7F8FA]">
                    <td className="px-5 py-3.5 font-medium">{product.name}</td>
                    <td className="px-5 py-3.5 capitalize text-[#5A5F6B]">{product.category}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${statusStyles[product.status]}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      <span className={product.stock === 0 ? 'text-rose-600' : undefined}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {formatPrice(product.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards below md — tables do not survive narrow screens */}
          <ul className="divide-y divide-[#E3E5EB] md:hidden">
            {visible.map((product) => (
              <li key={product.slug} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-0.5 text-xs capitalize text-[#5A5F6B]">{product.category}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyles[product.status]}`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[#5A5F6B]">
                    Stock:{' '}
                    <span className={product.stock === 0 ? 'text-rose-600' : 'text-[#1B1F27]'}>
                      {product.stock}
                    </span>
                  </span>
                  <span className="font-medium tabular-nums">{formatPrice(product.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="border-t border-[#E3E5EB] px-5 py-3 text-xs text-[#8A90A0]">
        Showing {visible.length} of {products.length} products
      </p>
    </div>
  );
}
