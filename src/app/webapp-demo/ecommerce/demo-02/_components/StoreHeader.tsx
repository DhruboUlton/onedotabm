'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../_context/StoreContext';
import { TrackOrderModal } from './TrackOrderModal';
import {
  Search,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Flame,
  Star,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface StoreHeaderProps {
  baseHref?: string;
}

export function StoreHeader({ baseHref = '/webapp-demo/ecommerce/demo-02' }: StoreHeaderProps) {
  const router = useRouter();
  const { settings, products, categories, cartCount, wishlist, setIsCartOpen } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Search filter
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.status === 'active' &&
            (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.shortBlurb.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`${baseHref}/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      {/* 1. Top Ticker / Announcement Bar */}
      {settings.announcementEnabled && (
        <div className="bg-[#0A0B0E] text-zinc-300 text-[11px] sm:text-xs py-2 px-4 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1 flex items-center justify-center gap-2 font-medium overflow-hidden whitespace-nowrap">
              <span className="text-amber-400">✨</span>
              <span>Home Delivery All Over Bangladesh</span>
              <span className="text-amber-400 mx-2">✨</span>
              <span className="hidden sm:inline">Most Reflective Wall Art in Bangladesh</span>
              <span className="text-amber-400 mx-2 hidden sm:inline">✨</span>
              <span className="text-rose-400 font-semibold">Free 3M Mounting Strips Included</span>
              <span className="text-amber-400">✨</span>
            </div>
            <div className="hidden lg:flex items-center gap-3 text-[11px] text-zinc-400">
              <button
                onClick={() => setIsTrackModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                Track Order
              </button>
              <span>|</span>
              <Link
                href={`${baseHref}/admin`}
                className="hover:text-white text-zinc-300 font-semibold transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left: Search pill */}
          <div className="hidden md:flex flex-1 max-w-xs relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 focus:border-black rounded-full text-xs text-zinc-900 transition-all focus:outline-hidden"
                />
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 animate-in fade-in-50 duration-150">
                <div className="p-2 divide-y divide-zinc-100">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`${baseHref}/products/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-xl transition-colors"
                    >
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{product.name}</p>
                        <p className="text-[11px] text-zinc-500">{product.categoryName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-zinc-900">৳{product.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 text-center">
                  <Link
                    href={`${baseHref}/products?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs font-semibold text-black hover:underline"
                  >
                    View all matching results ({searchResults.length})
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Center: Brand Logo (Circle Emblem + Minimalist Text) */}
          <div className="flex items-center justify-center">
            <Link href={baseHref} className="flex flex-col items-center group">
              <div className="flex items-center gap-2.5">
                {/* Circular Emblem with rose gold outline matching Reference B */}
                <div className="w-10 h-10 rounded-full border-2 border-rose-300 flex items-center justify-center bg-gradient-to-tr from-rose-50 to-pink-50 shadow-xs">
                  <span className="font-serif font-black text-rose-500 text-sm tracking-tighter">AG</span>
                </div>
                <div className="text-left">
                  <span className="font-extrabold text-xl tracking-[0.15em] text-[#0A0B0E] uppercase block leading-none">
                    AURAGLASS
                  </span>
                  <span className="text-[9px] tracking-[0.3em] font-medium text-zinc-500 uppercase block mt-1">
                    ELEGANT GLASS POSTER
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Actions (Wishlist & Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
            >
              <Truck className="w-4 h-4 text-zinc-500" />
              <span>Track</span>
            </button>

            <Link
              href={`${baseHref}/products`}
              className="hidden sm:flex items-center gap-1.5 p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button matching Reference B */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center justify-center p-2.5 text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors relative cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-black text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Horizontal Category Navigation Row matching Reference A & B */}
        <nav className="hidden lg:flex items-center justify-center gap-6 py-3 border-t border-zinc-100 text-xs font-medium text-zinc-700">
          <Link
            href={`${baseHref}/products?badge=Best+Seller`}
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Best Selling</span>
          </Link>

          <Link
            href={`${baseHref}#reviews-section`}
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Reviews</span>
          </Link>

          <Link
            href={`${baseHref}/products`}
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span>All Products</span>
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${baseHref}/categories/${cat.slug}`}
              className="hover:text-black transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search glass posters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900"
            />
          </form>

          {/* Categories Links */}
          <div className="space-y-1.5 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-2">Categories</p>
            <Link
              href={`${baseHref}/products?badge=Best+Seller`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              <Flame className="w-4 h-4 text-rose-500" />
              Best Selling
            </Link>
            <Link
              href={`${baseHref}/products`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              <Layers className="w-4 h-4 text-zinc-500" />
              All Glass Posters
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`${baseHref}/categories/${c.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block p-2 rounded-lg text-xs text-zinc-700 hover:bg-zinc-50 hover:text-black font-medium"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsTrackModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-zinc-700 font-semibold"
            >
              <Truck className="w-4 h-4 text-amber-500" />
              Track Order
            </button>
            <Link
              href={`${baseHref}/admin`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-black font-bold"
            >
              Admin Dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      <TrackOrderModal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} />
    </header>
  );
}
