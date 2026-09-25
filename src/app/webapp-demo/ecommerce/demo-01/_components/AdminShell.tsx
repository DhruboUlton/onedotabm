'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Gift,
  Image as ImageIcon,
  ShoppingCart,
  Tag,
  BarChart3,
  Boxes,
  FolderTree,
  Megaphone,
  Sparkles,
  Star,
  ShieldAlert,
  Plug2,
  Settings,
  Users,
  ShieldCheck,
  History,
  Store,
  Menu,
  X,
  ExternalLink,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';

interface AdminShellProps {
  children: React.ReactNode;
}

const baseHref = '/webapp-demo/ecommerce/demo-01';
const adminBase = `${baseHref}/admin`;

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const { orders, products, settings, reviews } = useStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Counts for badges
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 15).length;
  const pendingReviewsCount = reviews.filter((r) => !r.isVisible).length;

  const storeManagementNav: NavItem[] = [
    { label: 'Dashboard', href: adminBase, icon: LayoutDashboard },
    { label: 'Products', href: `${adminBase}/products`, icon: Package, badge: products.length },
    { label: 'Combos', href: `${adminBase}/combos`, icon: Gift },
    { label: 'Media Library', href: `${adminBase}/media`, icon: ImageIcon },
    {
      label: 'Orders',
      href: `${adminBase}/orders`,
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined,
    },
    { label: 'Coupons', href: `${adminBase}/coupons`, icon: Tag },
    { label: 'Analytics', href: `${adminBase}/analytics`, icon: BarChart3 },
    {
      label: 'Inventory',
      href: `${adminBase}/inventory`,
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
    },
    { label: 'Categories', href: `${adminBase}/categories`, icon: FolderTree },
    { label: 'Banner', href: `${adminBase}/banner`, icon: Megaphone },
    { label: 'Pop-up', href: `${adminBase}/popup`, icon: Sparkles },
    {
      label: 'Reviews',
      href: `${adminBase}/reviews`,
      icon: Star,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} hidden` : undefined,
    },
    { label: 'Fraud Check', href: `${adminBase}/fraud-check`, icon: ShieldAlert },
    { label: 'Integrations', href: `${adminBase}/integrations`, icon: Plug2 },
    { label: 'Settings', href: `${adminBase}/settings`, icon: Settings },
  ];

  const staffNav: NavItem[] = [
    { label: 'Staff', href: `${adminBase}/staff`, icon: Users },
    { label: 'Roles & Permissions', href: `${adminBase}/roles`, icon: ShieldCheck },
    { label: 'Activity Log', href: `${adminBase}/activity-log`, icon: History },
  ];

  const isActive = (href: string) => {
    if (href === adminBase) {
      return pathname === adminBase;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F1EB] font-sans text-zinc-900 antialiased">
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#E2DBD0] bg-[#072D24] text-white shrink-0">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href={adminBase} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E87121] text-white font-black text-sm shadow-sm">
              SH
            </div>
            <div>
              <span className="block font-black text-sm tracking-tight text-white">
                SHUDDHA<span className="text-[#E87121]">.</span>MERCHANT
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-wider text-emerald-300/80">
                Store Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs scrollbar-thin scrollbar-thumb-white/10">
          {/* Store Management Group */}
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
              Store Management
            </span>
            <div className="mt-2 space-y-0.5">
              {storeManagementNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#E87121] text-white font-bold shadow-md'
                        : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          active
                            ? 'bg-black/20 text-white'
                            : 'bg-white/10 text-emerald-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Staff & Permissions Group */}
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
              Staff & Permissions
            </span>
            <div className="mt-2 space-y-0.5">
              {staffNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#E87121] text-white font-bold shadow-md'
                        : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Area */}
        <div className="border-t border-white/10 p-3 space-y-2 bg-[#05221b]">
          {/* Open Storefront */}
          <Link
            href={baseHref}
            className="flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20 transition-all"
          >
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-[#E87121]" />
              <span>View Storefront</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
          </Link>

          {/* Current Admin Account */}
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
              DB
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-white leading-tight">
                Dhrubo Biswas
              </span>
              <span className="block text-[10px] text-emerald-400 font-medium">
                Owner (Super Admin)
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2DBD0] bg-white px-4 sm:px-6 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
              aria-label="Open admin sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb title */}
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Shuddha Admin</span>
                <span>/</span>
                <span className="font-semibold text-zinc-900 capitalize">
                  {pathname.replace(adminBase, '').replace('/', '') || 'Dashboard'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live sync badge */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Storefront Sync Active</span>
            </div>

            {/* Switch to Storefront Button */}
            <Link
              href={baseHref}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#072D24] px-3.5 py-1.5 text-xs font-bold text-[#072D24] hover:bg-[#072D24] hover:text-white transition-all"
            >
              <Store className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open Storefront</span>
            </Link>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* 3. Mobile Sidebar Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileNavOpen(false)}
          />

          <aside className="relative z-10 flex h-full w-72 flex-col bg-[#072D24] text-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <span className="font-black text-sm text-white">SHUDDHA MERCHANT</span>
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
              <div>
                <span className="px-2 text-[10px] font-bold uppercase text-emerald-400/80">
                  Store Management
                </span>
                <div className="mt-1 space-y-0.5">
                  {storeManagementNav.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium ${
                          active
                            ? 'bg-[#E87121] text-white font-bold'
                            : 'text-emerald-100 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="px-2 text-[10px] font-bold uppercase text-emerald-400/80">
                  Staff & Permissions
                </span>
                <div className="mt-1 space-y-0.5">
                  {staffNav.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                          active
                            ? 'bg-[#E87121] text-white font-bold'
                            : 'text-emerald-100 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-3">
              <Link
                href={baseHref}
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-xs font-bold text-white hover:bg-white/20"
              >
                <Store className="h-4 w-4 text-[#E87121]" />
                <span>Return to Storefront</span>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
