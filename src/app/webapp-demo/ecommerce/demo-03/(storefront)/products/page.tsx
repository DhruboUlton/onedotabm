'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '../../_context/StoreContext';
import { ProductCard } from '../../_components/ProductCard';
import {
  Filter,
  X,
  LayoutGrid,
  Grid3X3,
  Columns2,
  List,
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  Check,
  Search,
  Star,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, categories, vendors, locationFilter, wishlist, compareList } = useStore();

  const queryParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const vendorParam = searchParams.get('vendor') || '';
  const filterParam = searchParams.get('filter') || '';
  const wishlistParam = searchParams.get('wishlist') === 'true';
  const compareParam = searchParams.get('compare') === 'true';

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [gridDensity, setGridDensity] = useState<'2' | '3' | '4' | 'list'>('4');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available Brands list
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [products]);

  // Toggle Category
  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Toggle Brand
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Clear All Filters
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(3500);
    setInStockOnly(false);
    setSortBy('featured');
    router.push('/webapp-demo/ecommerce/demo-03/products');
  };

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (queryParam.trim()) {
      const q = queryParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Wishlist view
    if (wishlistParam) {
      result = result.filter((p) => wishlist.includes(p.id));
    }

    // Compare view
    if (compareParam) {
      result = result.filter((p) => compareList.includes(p.id));
    }

    // Vendor query
    if (vendorParam) {
      result = result.filter((p) => p.vendorId === vendorParam);
    }

    // Special quick filter: featured, sale, new
    if (filterParam === 'featured') {
      result = result.filter((p) => p.isFeatured);
    } else if (filterParam === 'sale') {
      result = result.filter((p) => p.isOnSale);
    } else if (filterParam === 'new') {
      result = result.filter((p) => p.isNewArrival);
    }

    // Category tree filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Max Price
    result = result.filter((p) => p.basePrice <= maxPrice);

    // In Stock Only
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [
    products,
    queryParam,
    wishlistParam,
    compareParam,
    vendorParam,
    filterParam,
    selectedCategories,
    selectedBrands,
    maxPrice,
    inStockOnly,
    sortBy,
    wishlist,
    compareList,
  ]);

  // Active filters count
  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (maxPrice < 3500 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  // Grid styling classes based on density
  const gridClasses = {
    '2': 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
    '3': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
    '4': 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5',
    list: 'flex flex-col gap-4',
  }[gridDensity];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8 space-y-6">
      {/* Page Title & Breadcrumb */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Catalog</span>
          {queryParam && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-600 dark:text-blue-400 font-bold">Search: &quot;{queryParam}&quot;</span>
            </>
          )}
          {wishlistParam && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-rose-600 font-bold">Saved Wishlist</span>
            </>
          )}
          {compareParam && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-600 font-bold">Hardware Comparison</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              {wishlistParam
                ? 'Your Saved Wishlist'
                : compareParam
                ? 'Hardware Comparison Matrix'
                : queryParam
                ? `Results for "${queryParam}"`
                : 'All Hardware & Peripherals'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Showing {filteredProducts.length} of {products.length} verified hardware products
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 self-start"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Department Categories */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
              Department
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const checked = selectedCategories.includes(cat.slug);
                return (
                  <label
                    key={cat.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded-xl text-xs font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(cat.slug)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className={checked ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}>
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {products.filter((p) => p.category === cat.slug).length}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              <span>Max Price</span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="3500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$100</span>
              <span>$1,500</span>
              <span>$3,500</span>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
              Brand / Manufacturer
            </h3>
            <div className="space-y-1">
              {availableBrands.map((brand) => {
                const checked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center justify-between py-1 px-2 rounded-xl text-xs font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className={checked ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}>
                        {brand}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* In Stock Only Switch */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">In-Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Delivery Location Proximity Notice */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{locationFilter.city || 'All Locations'}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Radius: {locationFilter.radiusMiles === 0 ? 'Nationwide' : `${locationFilter.radiusMiles} miles`}
            </p>
          </div>
        </aside>

        {/* Right Catalog View (Desktop 9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Toolbar: Density Switcher & Sort Selector */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            {/* Active Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100"
                >
                  <span className="capitalize">{c}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              {selectedBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100"
                >
                  <span>{b}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              {maxPrice < 3500 && (
                <button
                  onClick={() => setMaxPrice(3500)}
                  className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  <span>Under ${maxPrice}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {inStockOnly && (
                <button
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 text-xs font-semibold"
                >
                  <span>In Stock</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode & Sort Controls */}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
              {/* Density Icons */}
              <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 bg-slate-50 dark:bg-slate-800/80">
                <button
                  onClick={() => setGridDensity('2')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    gridDensity === '2'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="2 Columns"
                  aria-label="2 Columns"
                >
                  <Columns2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridDensity('3')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    gridDensity === '3'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="3 Columns"
                  aria-label="3 Columns"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridDensity('4')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    gridDensity === '4'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="4 Columns"
                  aria-label="4 Columns"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridDensity('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    gridDensity === 'list'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="List View"
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 py-1.5 px-2.5 rounded-xl outline-none cursor-pointer"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Hardware</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid / Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No matching hardware products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, clearing active filters, or searching for broader terms.
              </p>
              <button
                onClick={handleClearAll}
                className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-500/20"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={gridClasses}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} density={gridDensity} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto z-10 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold">Catalog Filters</span>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Mobile Departments */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Departments</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 text-xs py-1">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="rounded text-blue-600"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Max Price */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Max Price</span>
                  <span className="text-blue-600">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Mobile In Stock */}
              <label className="flex items-center justify-between text-xs font-bold">
                <span>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}

