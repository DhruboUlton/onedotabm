'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Image as ImageIcon,
  ShoppingBag,
  Tag,
  BarChart3,
  Archive,
  Layers,
  Sliders,
  Bell,
  MessageSquare,
  ShieldAlert,
  Webhook,
  Settings,
  Users,
  KeyRound,
  History,
  Store,
  Menu,
  X,
  RotateCcw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';
import { WonderSproutLogo } from '../_components/Doodles';

const navItems = [
  {
    group: 'STORE MANAGEMENT',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Combos & Bundles', href: '/admin/combos', icon: Boxes },
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Coupons', href: '/admin/coupons', icon: Tag },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Inventory', href: '/admin/inventory', icon: Archive },
      { label: 'Categories', href: '/admin/categories', icon: Layers },
      { label: 'Hero Banners', href: '/admin/banner', icon: Sliders },
      { label: 'Pop-up Modal', href: '/admin/popup', icon: Bell },
      { label: 'Customer Reviews', href: '/admin/reviews', icon: MessageSquare },
      { label: 'Fraud Verification', href: '/admin/fraud-check', icon: ShieldAlert },
      { label: 'Integrations', href: '/admin/integrations', icon: Webhook },
      { label: 'Store Settings', href: '/admin/settings', icon: Settings },
    ],
  },
  {
    group: 'STAFF & PERMISSIONS',
    items: [
      { label: 'Staff Accounts', href: '/admin/staff', icon: Users },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: KeyRound },
      { label: 'Activity Audit Log', href: '/admin/activity-log', icon: History },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, resetDemoData, orders, products } = useStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const base = '/webapp-demo/ecommerce/demo-04';
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 20).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-nunito text-[#0F172A]">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Open admin menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href={base} className="flex items-center gap-2 group">
            <WonderSproutLogo className="scale-90 origin-left" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#0A6375] text-white text-[10px] font-extrabold uppercase tracking-wider">
              Merchant OS
            </span>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Reset Demo Data */}
          <button
            onClick={resetDemoData}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#EB1551] text-xs font-bold text-slate-700 hover:text-[#EB1551] transition-colors"
            title="Restore initial seeded store state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          {/* Return to Storefront */}
          <Link
            href={base}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0A6375] hover:bg-[#1CBBB4] text-white text-xs font-extrabold shadow-sm transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Open Storefront</span>
          </Link>

          {/* Current Staff Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#FFEFE4] border border-[#F7941E]/40 flex items-center justify-center text-sm shadow-xs">
              👩‍🏫
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-[#0F172A] block leading-tight">
                Emily Thornton
              </span>
              <span className="text-[10px] text-[#EB1551] font-extrabold uppercase">Store Owner</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* ============================================================== */}
        {/* PERSISTENT DESKTOP SIDEBAR                                     */}
        {/* ============================================================== */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0">
          <div className="flex-1 space-y-6 overflow-y-auto pr-1">
            {navItems.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase px-3 block mb-1">
                  {group.group}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const itemFullPath = `${base}${item.href}`;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === itemFullPath
                      : pathname?.startsWith(itemFullPath);

                  return (
                    <Link
                      key={item.href}
                      href={itemFullPath}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#0A6375] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-[#FFEFE4]/60 hover:text-[#0A6375]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#FFDA43]' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {/* Notification Badges */}
                      {item.label === 'Orders' && pendingOrdersCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#EB1551] text-white text-[10px] font-bold">
                          {pendingOrdersCount}
                        </span>
                      )}
                      {item.label === 'Inventory' && lowStockCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#F7941E] text-white text-[10px] font-bold">
                          {lowStockCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Quick Store Info Badge */}
          <div className="p-3.5 rounded-2xl bg-[#FFEFE4] border border-[#F7941E]/30 text-xs space-y-1">
            <span className="font-extrabold text-[#0A6375] block">
              {settings.brandName} Live OS
            </span>
            <p className="text-[11px] text-[#6B6B84] leading-tight">
              All edits reactively propagate to storefront in real-time.
            </p>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* MOBILE NAVIGATION DRAWER                                       */}
        {/* ============================================================== */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <WonderSproutLogo className="scale-90 origin-left" />
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navItems.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase px-2 block mb-1">
                      {group.group}
                    </span>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const itemFullPath = `${base}${item.href}`;
                      const isActive =
                        item.href === '/admin'
                          ? pathname === itemFullPath
                          : pathname?.startsWith(itemFullPath);

                      return (
                        <Link
                          key={item.href}
                          href={itemFullPath}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                            isActive
                              ? 'bg-[#0A6375] text-white'
                              : 'text-slate-600 hover:bg-[#FFEFE4]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    resetDemoData();
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#EB1551] flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Admin Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
