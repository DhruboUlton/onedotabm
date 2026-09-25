'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Menu,
  X,
  Phone,
  Flame,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';
import { TrackOrderModal } from './TrackOrderModal';

interface StoreHeaderProps {
  baseHref?: string;
}

export function StoreHeader({
  baseHref = '/webapp-demo/ecommerce/demo-01',
}: StoreHeaderProps) {
  const router = useRouter();
  const {
    settings,
    products,
    categories,
    cartCount,
    cartTotal,
    setIsCartOpen,
    wishlist,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter products for autocomplete
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.status === 'active' &&
            (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.bengaliName && p.bengaliName.includes(searchQuery)))
        )
        .slice(0, 5)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`${baseHref}/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
        {/* 1. Top Announcement Bar */}
        {settings.announcementEnabled && settings.announcementText && (
          <div className="bg-[#E87121] px-4 py-1.5 text-center text-xs font-medium text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <span className="hidden sm:inline-flex items-center gap-1.5 opacity-90 text-[11px]">
                <Phone className="h-3 w-3" />
                <span>হটলাইন: {settings.phone}</span>
              </span>

              <p className="flex-1 text-center font-medium line-clamp-1">
                {settings.announcementText}
              </p>

              <div className="hidden sm:flex items-center gap-3 text-[11px]">
                <Link
                  href={`${baseHref}/admin`}
                  className="rounded-full bg-white/20 px-2 py-0.5 hover:bg-white/30 transition-colors font-semibold"
                >
                  Merchant Admin →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. Main Brand & Search Bar */}
        <div className="border-b border-[#ECE6DC] bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Brand Logo */}
            <Link
              href={baseHref}
              className="flex items-center gap-2.5 transition-transform active:scale-95"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#072D24] text-white shadow-md">
                {/* Organic seed/leaf brand emblem */}
                <svg
                  className="h-6 w-6 text-[#E87121]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>

              <div>
                <span className="block font-black text-lg tracking-tight text-[#072D24] sm:text-xl font-sans">
                  SHUDDHA<span className="text-[#E87121]">.</span>HARVEST
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#78716C]">
                  Pure Organic Farm Food
                </span>
              </div>
            </Link>

            {/* Search Bar with live autocomplete */}
            <div
              ref={searchContainerRef}
              className="relative hidden flex-1 max-w-lg lg:block"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search in products (e.g. Ghee, Honey, Mustard Oil)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full rounded-full border border-[#DCD6CA] bg-[#FAF8F5] py-2.5 pl-5 pr-11 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#072D24] focus:bg-white focus:outline-none transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#072D24] text-white hover:bg-[#0c4437] transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-[#ECE6DC] bg-white p-2 shadow-2xl">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Matching Products
                  </div>
                  <div className="divide-y divide-[#F0ECE4]">
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        href={`${baseHref}/products/${p.slug}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors"
                      >
                        <img
                          src={p.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg'}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover bg-zinc-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-900 truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[#E87121] font-bold">
                            ৳{p.price.toLocaleString()}
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-400 uppercase font-medium">
                          {p.categoryName}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Utility Icons & Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Track Order */}
              <button
                onClick={() => setIsTrackModalOpen(true)}
                className="hidden sm:flex flex-col items-center gap-0.5 text-[#5C5549] hover:text-[#072D24] transition-colors"
              >
                <MapPin className="h-5 w-5" />
                <span className="text-[10px] font-medium">Track Order</span>
              </button>

              {/* Wishlist */}
              <Link
                href={`${baseHref}/products`}
                className="relative hidden sm:flex flex-col items-center gap-0.5 text-[#5C5549] hover:text-[#072D24] transition-colors"
              >
                <div className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">Wishlist</span>
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 rounded-full border border-[#E87121]/30 bg-[#E87121]/5 px-3 py-1.5 hover:bg-[#E87121]/10 transition-colors"
              >
                <div className="relative text-[#E87121]">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E87121] px-1 text-[10px] font-bold text-white shadow-xs">
                    {cartCount}
                  </span>
                </div>
                <div className="hidden text-left sm:block">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
                    Cart Total
                  </span>
                  <span className="block text-xs font-bold text-[#E87121]">
                    ৳{cartTotal.toLocaleString()}
                  </span>
                </div>
              </button>

              {/* Admin Button */}
              <Link
                href={`${baseHref}/admin`}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#072D24] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0c4437] transition-all"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Dark Green Category Navigation Bar (Matching Screenshot 1) */}
        <nav className="hidden lg:block bg-[#072D24] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
            <ul className="flex items-center gap-1 text-xs font-medium">
              <li>
                <Link
                  href={`${baseHref}/products?badge=Combo+Offer`}
                  className="flex items-center gap-1 px-3 py-3 text-amber-300 font-bold hover:bg-white/10 transition-colors"
                >
                  <Flame className="h-3.5 w-3.5 fill-current text-[#E87121]" />
                  <span>Offer Zone</span>
                </Link>
              </li>

              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`${baseHref}/categories/${category.slug}`}
                    className="block px-3 py-3 text-zinc-100 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href={`${baseHref}/products`}
                  className="block px-3 py-3 text-zinc-100 hover:bg-white/10 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-3 text-xs text-emerald-200/80">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span>১০০% খাঁটি ও বিশুদ্ধ পণ্য</span>
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#ECE6DC] bg-[#FAF8F5] p-4">
              <span className="font-bold text-sm text-[#072D24]">Categories & Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-[#ECE6DC]">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-[#DCD6CA] bg-[#FAF8F5] py-2 pl-4 pr-10 text-xs text-zinc-900 focus:outline-none focus:border-[#072D24]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#072D24] text-white"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link
                href={`${baseHref}/products?badge=Combo+Offer`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2.5 text-xs font-bold text-[#E87121] hover:bg-orange-50"
              >
                <Flame className="h-4 w-4" />
                <span>Offer Zone</span>
              </Link>

              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`${baseHref}/categories/${c.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg p-2.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
                >
                  {c.name} {c.bengaliName ? `(${c.bengaliName})` : ''}
                </Link>
              ))}

              <Link
                href={`${baseHref}/products`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg p-2.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
              >
                All Products
              </Link>
            </div>

            <div className="border-t border-[#ECE6DC] bg-[#FAF8F5] p-4 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsTrackModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-300 py-2.5 text-xs font-semibold text-zinc-700"
              >
                <MapPin className="h-4 w-4 text-[#072D24]" />
                <span>Track Order</span>
              </button>

              <Link
                href={`${baseHref}/admin`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#072D24] py-2.5 text-xs font-semibold text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Open Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
