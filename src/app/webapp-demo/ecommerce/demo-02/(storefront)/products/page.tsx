'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, X, Layers } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { ProductCard } from '../../_components/ProductCard';

const baseHref = '/webapp-demo/ecommerce/demo-02';

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
          const matchBlurb = p.shortBlurb.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchBlurb) return false;
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

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBadge('all');
    setSearchQuery('');
    setOnlyInStock(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBadge !== 'all' ||
    searchQuery.trim() !== '' ||
    onlyInStock ||
    sortBy !== 'featured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#E86F1E] mb-1 block">
            AuraGlass Studio Catalogue
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            All Tempered Glass Posters
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Explore 100% shatter-resistant, diamond-beveled 4mm float glass artwork. Filter by motorsport, anime, sacred geometry, or multi-panel triptychs.
          </p>
        </div>

        <div className="text-xs font-semibold text-zinc-500">
          Showing <span className="font-extrabold text-black">{filteredProducts.length}</span> of {products.length} designs
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, genre, car, anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-hidden focus:border-black"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Badge Dropdown */}
          <select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-hidden focus:border-black"
          >
            <option value="all">All Badges</option>
            <option value="Best Seller">Best Seller</option>
            <option value="Trending">Trending</option>
            <option value="New Arrival">New Arrival</option>
            <option value="Limited Edition">Limited Edition</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-hidden focus:border-black"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* In Stock Toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer select-none px-2 py-1 bg-zinc-50 rounded-xl border border-zinc-200">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded-sm text-black focus:ring-black"
            />
            <span>In Stock Only</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-medium">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-black text-white shadow-xs font-bold'
              : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          All Designs ({products.length})
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.slug)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              selectedCategory === c.slug
                ? 'bg-black text-white shadow-xs font-bold'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200">
          <Layers className="w-12 h-12 text-zinc-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-zinc-800">No glass posters found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, clearing category filters, or unchecking &quot;In Stock Only&quot;.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-5 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} baseHref={baseHref} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsCataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-zinc-400">
          Loading AuraGlass catalogue...
        </div>
      }
    >
      <ProductsCatalogueContent />
    </Suspense>
  );
}
