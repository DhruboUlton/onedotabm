'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';
import {
  Star,
  Search,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Package,
  Eye,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function FeaturedProductsPage() {
  const { products, toggleFeatured, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'featured-only'>('all');

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMode = filterMode === 'all' || (filterMode === 'featured-only' && p.isFeatured);
    return matchSearch && matchMode;
  });

  const featuredCount = products.filter((p) => p.isFeatured).length;

  const handleToggle = (id: string, title: string) => {
    toggleFeatured(id);
    showToast('Featured Showcase Updated', `Homepage spotlight toggled for "${title}"`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Featured Products Showcase
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              <span>{featuredCount} Spotlighted</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Curate items displayed on the homepage flagship carousel and featured product showcase. Changes sync live with the customer storefront.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/webapp-demo/ecommerce/demo-03"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Storefront</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, vendor, or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-2 text-xs rounded-xl font-bold transition-colors ${
              filterMode === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('featured-only')}
            className={`px-3 py-2 text-xs rounded-xl font-bold transition-colors ${
              filterMode === 'featured-only'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Featured Only ({featuredCount})
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => {
          return (
            <div
              key={product.id}
              className={`p-4 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
                product.isFeatured
                  ? 'border-amber-400 dark:border-amber-600/80 shadow-md shadow-amber-500/5'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <Image
                    src={product.primaryImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  {product.isFeatured && (
                    <div className="absolute top-1 left-1 p-1 rounded-lg bg-amber-500 text-white shadow-xs">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    {product.vendorName}
                  </span>
                  <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate mt-0.5">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-xs text-slate-900 dark:text-slate-100">
                      ${product.basePrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {product.isFeatured ? (
                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured on Home
                    </span>
                  ) : (
                    'Standard Catalog'
                  )}
                </span>

                <button
                  onClick={() => handleToggle(product.id, product.title)}
                  className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                  title={product.isFeatured ? 'Remove from Featured' : 'Pin as Featured'}
                >
                  {product.isFeatured ? (
                    <ToggleRight className="w-7 h-7 text-amber-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
