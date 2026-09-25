'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from './CartProvider';
import { productCategories, storeName } from '../_data/catalog';

const base = '/webapp-demo/ecommerce/demo-01';

const navLinks = [
  { label: 'Shop all', href: `${base}/products` },
  ...productCategories.map((category) => ({
    label: category.name,
    href: `${base}/products?category=${category.slug}`,
  })),
];

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E2DA] bg-[#FBF9F6]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href={base}
          className="font-serif text-lg font-semibold tracking-tight text-[#2B2620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620] rounded-sm"
        >
          {storeName}
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Store navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#6B6259] transition-colors hover:text-[#2B2620] active:text-[#8A6A3B]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={`${base}/cart`}
            aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            aria-current={pathname === `${base}/cart` ? 'page' : undefined}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E2DA] bg-white text-[#2B2620] transition-colors hover:bg-[#F3EFE9] active:scale-[0.95] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8A6A3B] px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="store-mobile-menu"
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E2DA] bg-white text-[#2B2620] transition-colors hover:bg-[#F3EFE9] active:scale-[0.95] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620] md:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="store-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Store menu"
          className="fixed inset-0 z-50 bg-[#FBF9F6] p-6 md:hidden animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-5">
            <span className="font-serif text-lg font-semibold text-[#2B2620]">{storeName}</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E2DA] bg-white text-[#2B2620] active:scale-[0.95] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 py-6" aria-label="Store navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-[#E7E2DA]/70 py-3 text-xl text-[#2B2620] transition-colors active:text-[#8A6A3B]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
