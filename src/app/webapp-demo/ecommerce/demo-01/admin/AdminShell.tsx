'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Menu, Package, Receipt, Store, X } from 'lucide-react';
import { storeName } from '../_data/catalog';

const base = '/webapp-demo/ecommerce/demo-01';

const navItems = [
  { label: 'Dashboard', href: `${base}/admin`, icon: BarChart3 },
  { label: 'Products', href: `${base}/admin/products`, icon: Package },
  { label: 'Orders', href: `${base}/admin/orders`, icon: Receipt },
];

/**
 * Admin chrome: fixed sidebar on desktop, drawer on mobile. Client-side only
 * because of the drawer and active-link state; the pages it wraps stay
 * server components.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === `${base}/admin` ? pathname === href : pathname.startsWith(href);

  const nav = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1" aria-label="Admin navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors active:scale-[0.99] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
              active
                ? 'bg-[#4F46E5] text-white'
                : 'text-[#5A5F6B] hover:bg-[#F1F2F6] hover:text-[#1B1F27]'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const storeLink = (onNavigate?: () => void) => (
    <Link
      href={base}
      onClick={onNavigate}
      className="flex items-center gap-2.5 rounded-lg border border-[#E3E5EB] bg-white px-3 py-2.5 text-sm font-medium text-[#1B1F27] transition-colors hover:bg-[#F1F2F6] active:scale-[0.99] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
    >
      <Store className="h-4 w-4 shrink-0" aria-hidden="true" />
      View Home Page
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans text-[#1B1F27]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-[#E3E5EB] bg-white p-5 lg:flex">
        <div>
          <p className="text-sm font-semibold tracking-tight">{storeName}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[#8A90A0]">Admin</p>
          <div className="mt-6">{nav()}</div>
        </div>
        {storeLink()}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col justify-between border-r border-[#E3E5EB] bg-white p-5 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-tight">{storeName}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[#8A90A0]">
                    Admin
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E3E5EB] text-[#5A5F6B] active:scale-[0.95] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6">{nav(() => setDrawerOpen(false))}</div>
            </div>
            {storeLink(() => setDrawerOpen(false))}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#E3E5EB] bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E3E5EB] text-[#5A5F6B] transition-colors hover:bg-[#F1F2F6] active:scale-[0.95] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>

          <p className="hidden text-sm text-[#5A5F6B] lg:block">
            Signed in as <span className="font-medium text-[#1B1F27]">Store manager</span>
          </p>

          <Link
            href={base}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1B1F27] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2C313B] active:scale-[0.97] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] lg:hidden"
          >
            <Store className="h-3.5 w-3.5" aria-hidden="true" />
            Home Page
          </Link>
        </header>

        <main className="px-4 py-6 pb-24 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
