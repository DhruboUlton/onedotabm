'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../_context/StoreContext';
import {
  Search,
  MapPin,
  Moon,
  Sun,
  Heart,
  ArrowLeftRight,
  ShoppingBag,
  Menu,
  ChevronDown,
  Sparkles,
  Package,
  BookOpen,
  Store,
  Layers,
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  Watch,
  Zap,
  Camera,
  Home,
  Cpu,
  User,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  laptop: Laptop,
  smartphone: Smartphone,
  headphones: Headphones,
  'gamepad-2': Gamepad2,
  watch: Watch,
  zap: Zap,
  camera: Camera,
  home: Home,
  cpu: Cpu,
};

export function StoreHeader() {
  const router = useRouter();
  const {
    isDark,
    toggleTheme,
    cartCount,
    openCart,
    wishlist,
    compareList,
    locationFilter,
    openLocationModal,
    categories,
    openMobileNav,
    searchQuery,
    setSearchQuery,
    categoryScope,
    setCategoryScope,
  } = useStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (categoryScope !== 'All Categories') params.set('category', categoryScope.toLowerCase());
    router.push(`/webapp-demo/ecommerce/demo-03/products?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* 1. Top Announcement Bar */}
      <div className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-center">
        <div className="container mx-auto max-w-7xl flex items-center justify-center gap-2 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>FREE EXPRESS DELIVERY ON ORDERS OVER $50 • OFFICIAL 2-YEAR HARDWARE WARRANTY</span>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={openMobileNav}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/webapp-demo/ecommerce/demo-03" className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-md shadow-blue-500/30">
                K
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-50 leading-none">
                  KINETIC<span className="text-blue-600 dark:text-blue-400">GEAR</span>
                </span>
                <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                  Pro Electronics
                </span>
              </div>
            </Link>
          </div>

          {/* Location Picker (Desktop) */}
          <div className="hidden xl:flex shrink-0">
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-left transition-colors"
            >
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-slate-400 font-medium">Deliver to</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                  {locationFilter.city || 'Set Location'}
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar (Desktop / Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-2xl relative items-center"
          >
            <div className="flex items-center w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all overflow-hidden">
              <input
                type="search"
                placeholder="Search laptops, smartphones, ANC headphones, GaN hubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 bg-transparent px-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
              />

              {/* Category Scope Selector */}
              <div className="hidden sm:flex items-center border-l border-slate-200 dark:border-slate-700 px-2 shrink-0">
                <select
                  value={categoryScope}
                  onChange={(e) => setCategoryScope(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer py-1 pr-1"
                >
                  <option value="All Categories" className="dark:bg-slate-900">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug} className="dark:bg-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 shrink-0 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Header Actions (Theme, Wishlist, Compare, Account, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
              title="Toggle Light / Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Wishlist Link */}
            <Link
              href="/webapp-demo/ecommerce/demo-03/products?wishlist=true"
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Compare Link */}
            <Link
              href="/webapp-demo/ecommerce/demo-03/products?compare=true"
              className="hidden sm:flex relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Compare Hardware"
              aria-label="Compare"
            >
              <ArrowLeftRight className="w-4 h-4" />
              {compareList.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Account Popover */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                <User className="w-4 h-4" />
                <span className="hidden xl:inline">Account</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isAccountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Welcome, Guest</p>
                    <p className="text-[10px] text-slate-400">Multi-Vendor Customer</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/webapp-demo/ecommerce/demo-03/track-order"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Track My Order
                    </Link>
                    <Link
                      href="/webapp-demo/ecommerce/demo-03/contact"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Help & Support
                    </Link>
                    <Link
                      href="/webapp-demo/ecommerce/demo-03/vendors"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Sell on Kinetic Gear
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-2.5 py-2 px-3 sm:px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all active:scale-[0.97]"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-white text-blue-600 text-[10px] font-black flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <form onSubmit={handleSearchSubmit} className="mt-2.5 md:hidden">
          <div className="flex items-center w-full h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 focus-within:border-blue-600">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="search"
              placeholder="Search tech & gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
            />
            <button type="submit" className="text-blue-600 dark:text-blue-400 text-xs font-bold pl-2">
              Go
            </button>
          </div>
        </form>
      </div>

      {/* 3. Secondary Navigation Row (Desktop) */}
      <div className="hidden lg:block border-t border-slate-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          {/* Left: Category Button & Primary Links */}
          <div className="flex items-center gap-6">
            {/* All Categories Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown */}
              {isCategoryMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in"
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Explore Departments
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {categories.map((cat) => {
                      const Icon = iconMap[cat.iconName] || Layers;
                      return (
                        <Link
                          key={cat.id}
                          href={`/webapp-demo/ecommerce/demo-03/products?category=${cat.slug}`}
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span>{cat.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                            {cat.itemCount}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Nav Links */}
            <nav className="flex items-center gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Link
                href="/webapp-demo/ecommerce/demo-03/products"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Catalog
              </Link>
              <Link
                href="/webapp-demo/ecommerce/demo-03/products?filter=featured"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Featured Gear
              </Link>
              <Link
                href="/webapp-demo/ecommerce/demo-03/products?filter=sale"
                className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Flash Deals</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </Link>
              <Link
                href="/webapp-demo/ecommerce/demo-03/vendors"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Verified Vendors
              </Link>
            </nav>
          </div>

          {/* Right: Marketplace Utilities */}
          <div className="flex items-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/webapp-demo/ecommerce/demo-03/track-order"
              className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Track Order</span>
            </Link>
            <Link
              href="/webapp-demo/ecommerce/demo-03/blog"
              className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Tech Journal</span>
            </Link>
            <Link
              href="/webapp-demo/ecommerce/demo-03/contact"
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/webapp-demo/ecommerce/demo-03/vendors#sell"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Sell With Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
