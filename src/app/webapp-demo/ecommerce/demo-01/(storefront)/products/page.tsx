'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, X, ShoppingBag } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { ProductCard } from '../../_components/ProductCard';

const baseHref = '/webapp-demo/ecommerce/demo-01';

function ProductsCatalogueContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialBadge = searchParams.get('badge') || 'all';

  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(initialBadge);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Active status
        if (p.status !== 'active') return false;

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

        // Badge filter
        if (selectedBadge !== 'all' && p.badge !== selectedBadge) return false;

        // In-stock filter
        if (onlyInStock && p.stock <= 0) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchBengali = p.bengaliName && p.bengaliName.includes(q);
          if (!matchName && !matchCat && !matchBengali) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBadge, onlyInStock, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBadge !== 'all' ||
    onlyInStock ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBadge('all');
    setOnlyInStock(false);
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 pb-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href={baseHref} className="hover:text-[#072D24]">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="font-semibold text-zinc-900">All Products</span>
      </nav>

      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE6DC] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2923] tracking-tight">
            Our Organic Product Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Showing {filteredProducts.length} certified farm-fresh products
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search in catalogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#DCD6CA] bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 focus:border-[#E87121] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter & Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white border border-[#ECE6DC] p-4 text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#072D24] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`rounded-xl px-3 py-1.5 font-medium transition-all ${
                selectedCategory === c.slug
                  ? 'bg-[#072D24] text-white shadow-xs font-bold'
                  : 'bg-[#FAF8F5] text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Sort & In-stock toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-700">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="h-3.5 w-3.5 rounded accent-[#E87121]"
            />
            <span>In Stock Only</span>
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-[#DCD6CA] bg-white px-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-rose-600 hover:underline font-semibold"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#E87121] mb-3">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-[#1F2923]">No products found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any products matching your selected filters. Try searching for something else or reset filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-xl bg-[#072D24] px-5 py-2 text-xs font-bold text-white hover:bg-[#0c4437]"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} baseHref={baseHref} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsCataloguePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading catalogue...</div>}>
      <ProductsCatalogueContent />
    </Suspense>
  );
}
