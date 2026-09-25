'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useStore } from '../../../_context/StoreContext';
import { ProductCard } from '../../../_components/ProductCard';
import { ChevronRight, ArrowLeft, Layers } from 'lucide-react';

const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { categories, products } = useStore();

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (p) => p.status === 'active' && p.category === category.slug
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href={baseHref} className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <Link href={`${baseHref}/products`} className="hover:text-black">
          Categories
        </Link>
        <span>/</span>
        <span className="text-zinc-900 font-semibold">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-black text-white p-6 sm:p-10 lg:p-12 border border-zinc-800">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#E86F1E]">
            Glass Wall Art Collection
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {category.description ||
              `Discover precision-engineered ${category.name.toLowerCase()} printed on 4mm shatter-resistant, diamond-beveled tempered float glass.`}
          </p>
          <div className="pt-2 text-xs text-zinc-400">
            Showing <strong className="text-white">{categoryProducts.length}</strong> available designs
          </div>
        </div>

        {/* Ambient image background */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-25 sm:opacity-40 overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>
      </div>

      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200">
          <Layers className="w-12 h-12 text-zinc-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-zinc-800">No glass posters in this category yet</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Check back soon or explore our other collections.
          </p>
          <Link
            href={`${baseHref}/products`}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Collections</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} baseHref={baseHref} />
          ))}
        </div>
      )}
    </div>
  );
}
