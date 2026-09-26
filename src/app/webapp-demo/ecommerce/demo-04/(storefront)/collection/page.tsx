'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  List,
  ChevronDown,
  X,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { StoreHeader } from '../../_components/StoreHeader';
import { StoreFooter } from '../../_components/StoreFooter';
import { ProductCard } from '../../_components/ProductCard';
import { CartDrawer } from '../../_components/CartDrawer';
import { QuickAddModal } from '../../_components/QuickAddModal';
import { EnquiryModal } from '../../_components/EnquiryModal';
import { SearchModal } from '../../_components/SearchModal';
import { PromoPopup } from '../../_components/PromoPopup';
import { BreadcrumbBanner } from '../../_components/BreadcrumbBanner';

function CollectionContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialWishlistOnly = searchParams.get('wishlist') === 'true';

  const { products, categories, wishlist } = useStore();
  const base = '/webapp-demo/ecommerce/demo-04';

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [availability, setAvailability] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewCols, setViewCols] = useState<2 | 3 | 4 | 'list'>(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'Active') return false;

        // Wishlist only
        if (initialWishlistOnly && !wishlist.includes(p.id)) return false;

        // Search query
        if (initialSearch) {
          const q = initialSearch.toLowerCase();
          if (
            !p.title.toLowerCase().includes(q) &&
            !p.category.toLowerCase().includes(q) &&
            !p.description.toLowerCase().includes(q)
          ) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Availability
        if (availability === 'inStock' && p.stock <= 0) return false;
        if (availability === 'outOfStock' && p.stock > 0) return false;

        // Age
        if (selectedAge !== 'all' && !p.ageRange.includes(selectedAge)) return false;

        // Material
        if (selectedMaterial !== 'all' && !p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }

        // Price
        if (p.basePrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.basePrice - b.basePrice;
        if (sortBy === 'price-high') return b.basePrice - a.basePrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0; // featured / default
      });
  }, [
    products,
    selectedCategory,
    availability,
    selectedAge,
    selectedMaterial,
    maxPrice,
    sortBy,
    initialSearch,
    initialWishlistOnly,
    wishlist,
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setAvailability('all');
    setSelectedAge('all');
    setSelectedMaterial('all');
    setMaxPrice(120);
    setSortBy('featured');
  };

  const materials = ['Beechwood', 'Organic', 'Walnut', 'ABS'];
  const ageGroups = ['2-4', '4-6', '6+'];

  return (
    <div className="flex-1 flex flex-col bg-white">
      <StoreHeader onOpenSearch={() => setSearchOpen(true)} />

      {/* Banner */}
      <BreadcrumbBanner
        title={initialWishlistOnly ? 'Your Saved Toys' : selectedCategory === 'All' ? 'Complete Toy Catalogue' : selectedCategory}
        breadcrumbs={[
          { label: 'Products', href: `${base}/collection` },
          ...(selectedCategory !== 'All' ? [{ label: selectedCategory }] : []),
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* DESKTOP SIDEBAR FILTERS (3 Cols)                               */}
          {/* ============================================================== */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            {/* Header & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bubblegum text-2xl text-[#0F172A] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#EB1551]" />
                <span>Filter Toys</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-[#F7941E] hover:text-[#EB1551] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="bg-[#FFEFE4]/50 p-5 rounded-3xl border border-[#F7941E]/20 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A6375]">
                Categories
              </h4>
              <div className="space-y-1.5 font-nunito text-xs">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-[#0A6375] text-white font-extrabold shadow-sm'
                      : 'hover:bg-white text-[#0F172A]'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.filter((p) => p.status === 'Active').length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-[#0A6375] text-white font-extrabold shadow-sm'
                        : 'hover:bg-white text-[#0F172A]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A6375]">
                Availability
              </h4>
              <div className="space-y-2 text-xs font-bold font-nunito text-[#6B6B84]">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'inStock', label: 'In Stock Only' },
                  { id: 'outOfStock', label: 'Out of Stock' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === item.id}
                      onChange={() => setAvailability(item.id as typeof availability)}
                      className="text-[#EB1551] focus:ring-[#EB1551]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A6375]">
                  Max Price
                </h4>
                <span className="font-extrabold text-sm text-[#EB1551]">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#EB1551] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#6B6B84] font-bold">
                <span>$20</span>
                <span>$120</span>
              </div>
            </div>

            {/* Age Group */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A6375]">
                Target Age
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedAge('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedAge === 'all'
                      ? 'bg-[#EB1551] text-white'
                      : 'bg-slate-100 text-[#0F172A] hover:bg-[#FFEFE4]'
                  }`}
                >
                  All Ages
                </button>
                {ageGroups.map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedAge === age
                        ? 'bg-[#EB1551] text-white'
                        : 'bg-slate-100 text-[#0F172A] hover:bg-[#FFEFE4]'
                    }`}
                  >
                    {age} Years
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A6375]">
                Material
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedMaterial('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedMaterial === 'all'
                      ? 'bg-[#1CBBB4] text-white'
                      : 'bg-slate-100 text-[#0F172A] hover:bg-[#FFEFE4]'
                  }`}
                >
                  All Materials
                </button>
                {materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedMaterial === mat
                        ? 'bg-[#1CBBB4] text-white'
                        : 'bg-slate-100 text-[#0F172A] hover:bg-[#FFEFE4]'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Best Sellers Promo Card */}
            <div className="bg-gradient-to-br from-[#EB1551] to-[#c41243] text-white p-6 rounded-3xl shadow-xl space-y-3 relative overflow-hidden">
              <span className="bg-[#FFDA43] text-[#0F172A] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block">
                Top Recommendation
              </span>
              <h4 className="font-bubblegum text-2xl leading-tight">
                WonderSprout Montessori Cottage
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-nunito">
                Real brass latches, spinning cogs, and clockwork hands for toddler fine motor growth.
              </p>
              <Link
                href={`${base}/products/montessori-busy-board-house`}
                className="inline-block bg-white text-[#EB1551] hover:bg-[#FFEFE4] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-colors mt-1"
              >
                Shop Now $78.50 &rarr;
              </Link>
            </div>
          </aside>

          {/* ============================================================== */}
          {/* MAIN CATALOGUE AREA (9 Cols)                                  */}
          {/* ============================================================== */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-[#FFEFE4]/60 p-4 rounded-3xl border border-[#F7941E]/20 flex flex-wrap items-center justify-between gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden ws-btn-primary px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Results Count */}
              <div className="text-xs font-bold text-[#0A6375] font-nunito">
                Showing <strong className="text-[#EB1551]">{filteredProducts.length}</strong> of{' '}
                {products.length} learning toys
              </div>

              {/* Sort & View Mode Toggles */}
              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <span className="text-[#6B6B84] hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#1CBBB4] cursor-pointer"
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="title">Alphabetical (A-Z)</option>
                  </select>
                </div>

                {/* View toggles (desktop) */}
                <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewCols(2)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewCols === 2 ? 'bg-[#EB1551] text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="2 Columns"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewCols(3)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewCols === 3 ? 'bg-[#EB1551] text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="3 Columns"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {(selectedCategory !== 'All' ||
              availability !== 'all' ||
              selectedAge !== 'all' ||
              selectedMaterial !== 'all' ||
              maxPrice < 120 ||
              initialWishlistOnly) && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-bold text-[#6B6B84]">Active Filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0A6375] text-white font-bold">
                    <span>{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {availability !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1CBBB4] text-white font-bold">
                    <span>{availability === 'inStock' ? 'In Stock' : 'Out of Stock'}</span>
                    <button onClick={() => setAvailability('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedAge !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F7941E] text-white font-bold">
                    <span>Age: {selectedAge}</span>
                    <button onClick={() => setSelectedAge('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedMaterial !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EB1551] text-white font-bold">
                    <span>{selectedMaterial}</span>
                    <button onClick={() => setSelectedMaterial('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {maxPrice < 120 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700 text-white font-bold">
                    <span>Under ${maxPrice}</span>
                    <button onClick={() => setMaxPrice(120)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#EB1551] hover:underline font-bold ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-[#FFEFE4]/30 rounded-3xl border border-dashed border-slate-200">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFEFE4] flex items-center justify-center text-4xl">
                  🔍
                </div>
                <h4 className="font-bubblegum text-3xl text-[#0F172A]">No Matching Toys Found</h4>
                <p className="text-sm text-[#6B6B84] max-w-sm mx-auto font-nunito">
                  Try adjusting your filters or price slider to see more handcrafted Montessori products.
                </p>
                <button
                  onClick={resetFilters}
                  className="ws-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider font-extrabold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewCols === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bubblegum text-2xl text-[#0F172A]">Filter Toys</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A6375] mb-2">
                  Category
                </h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3 py-2 rounded-xl font-bold ${
                      selectedCategory === 'All' ? 'bg-[#0A6375] text-white' : 'text-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl font-bold ${
                        selectedCategory === c.name ? 'bg-[#0A6375] text-white' : 'text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A6375] mb-2">
                  Max Price: ${maxPrice}
                </h4>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#EB1551]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 ws-btn-primary py-3 text-xs uppercase tracking-wider font-extrabold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <CartDrawer />
      <QuickAddModal />
      <EnquiryModal />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <PromoPopup />

      <StoreFooter />
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CollectionContent />
    </Suspense>
  );
}
