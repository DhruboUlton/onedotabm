'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../_context/StoreContext';
import {
  X,
  MapPin,
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  Watch,
  Zap,
  Camera,
  Home,
  Cpu,
  Layers,
  ShoppingBag,
  Package,
  BookOpen,
  Store,
  Phone,
  Sun,
  Moon,
  ChevronRight,
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

export function MobileNavDrawer() {
  const {
    isMobileNavOpen,
    closeMobileNav,
    categories,
    locationFilter,
    openLocationModal,
    isDark,
    toggleTheme,
  } = useStore();

  if (!isMobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] lg:hidden overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeMobileNav}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <aside className="w-screen max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between text-slate-900 dark:text-slate-100 animate-in slide-in-from-left duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/webapp-demo/ecommerce/demo-03"
              onClick={closeMobileNav}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/30">
                K
              </div>
              <span className="text-base font-extrabold tracking-tight">
                KINETIC<span className="text-blue-600 dark:text-blue-400">GEAR</span>
              </span>
            </Link>
            <button
              onClick={closeMobileNav}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location Trigger */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                closeMobileNav();
                openLocationModal();
              }}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="text-xs">
                  <div className="text-[10px] text-slate-400">Deliver to</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                    {locationFilter.city || 'Set Location'}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Change</span>
            </button>
          </div>

          {/* Nav Links & Categories */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                Marketplace Menu
              </div>
              <nav className="space-y-1">
                <Link
                  href="/webapp-demo/ecommerce/demo-03/products"
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>All Products</span>
                </Link>
                <Link
                  href="/webapp-demo/ecommerce/demo-03/vendors"
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Store className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Verified Vendors</span>
                </Link>
                <Link
                  href="/webapp-demo/ecommerce/demo-03/track-order"
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Track Order</span>
                </Link>
                <Link
                  href="/webapp-demo/ecommerce/demo-03/blog"
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Tech Journal</span>
                </Link>
              </nav>
            </div>

            {/* Categories */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                Categories
              </div>
              <div className="space-y-0.5">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.iconName] || Layers;
                  return (
                    <Link
                      key={cat.id}
                      href={`/webapp-demo/ecommerce/demo-03/products?category=${cat.slug}`}
                      onClick={closeMobileNav}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Theme & Contact */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <Link
              href="/webapp-demo/ecommerce/demo-03/contact"
              onClick={closeMobileNav}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
