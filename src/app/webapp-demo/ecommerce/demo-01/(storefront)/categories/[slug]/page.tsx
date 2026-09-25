'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';
import { useStore } from '../../../_context/StoreContext';
import { ProductCard } from '../../../_components/ProductCard';

const baseHref = '/webapp-demo/ecommerce/demo-01';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { categories, products } = useStore();

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (p) => p.category === category.slug && p.status === 'active'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 pb-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href={baseHref} className="hover:text-[#072D24]">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link href={`${baseHref}/products`} className="hover:text-[#072D24]">
          Categories
        </Link>
        <span>&rsaquo;</span>
        <span className="font-semibold text-zinc-900">{category.name}</span>
      </nav>

      {/* Hero Category Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#072D24] text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E87121] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Category Collection</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {category.name} {category.bengaliName ? `(${category.bengaliName})` : ''}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-200 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Decorative backdrop icon */}
        <div className="absolute right-6 -bottom-6 opacity-10 text-white pointer-events-none">
          <ShoppingBag className="h-64 w-64" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
          <h2 className="text-lg font-bold text-[#1F2923]">
            Products in {category.name} ({categoryProducts.length})
          </h2>
          <Link
            href={`${baseHref}/products`}
            className="flex items-center gap-1 text-xs font-bold text-[#072D24] hover:text-[#E87121]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Categories</span>
          </Link>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="rounded-2xl border border-[#ECE6DC] bg-white p-12 text-center text-xs text-zinc-500">
            No products available in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} baseHref={baseHref} />
            ))}
          </div>
        )}
      </div>

      {/* Other Categories navigation */}
      <div className="border-t border-[#ECE6DC] pt-8">
        <h3 className="text-sm font-bold text-[#1F2923] mb-4">Other Popular Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== category.slug && c.isActive)
            .map((c) => (
              <Link
                key={c.id}
                href={`${baseHref}/categories/${c.slug}`}
                className="rounded-xl border border-[#ECE6DC] bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:border-[#E87121] hover:text-[#E87121] transition-all"
              >
                {c.name} {c.bengaliName ? `(${c.bengaliName})` : ''}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
