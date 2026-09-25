'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../_context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  ShoppingBag,
  TicketPercent,
  BarChart3,
  Boxes,
  FolderTree,
  Sliders,
  Sparkles,
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
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const baseHref = '/webapp-demo/ecommerce/demo-02';
const adminBase = '/webapp-demo/ecommerce/demo-02/admin';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { orders, products, reviews, settings } = useStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;

  const storeManagementNav: NavItem[] = [
    { label: 'Dashboard', href: adminBase, icon: LayoutDashboard },
    { label: 'Products', href: `${adminBase}/products`, icon: Package, badge: products.length },
    { label: 'Combos & Sets', href: `${adminBase}/combos`, icon: Layers },
    { label: 'Media Library', href: `${adminBase}/media`, icon: ImageIcon },
    {
      label: 'Orders',
      href: `${adminBase}/orders`,
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined,
    },
    { label: 'Coupons', href: `${adminBase}/coupons`, icon: TicketPercent },
    { label: 'Analytics', href: `${adminBase}/analytics`, icon: BarChart3 },
    {
      label: 'Inventory',
      href: `${adminBase}/inventory`,
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
    },
    { label: 'Categories', href: `${adminBase}/categories`, icon: FolderTree },
    { label: 'Banner Manager', href: `${adminBase}/banner`, icon: Sliders },
    { label: 'Pop-up Modal', href: `${adminBase}/popup`, icon: Sparkles },
    { label: 'Reviews', href: `${adminBase}/reviews`, icon: MessageSquare, badge: reviews.length },
    { label: 'Fraud Check', href: `${adminBase}/fraud-check`, icon: ShieldAlert },
    { label: 'Integrations', href: `${adminBase}/integrations`, icon: Webhook },
    { label: 'Store Settings', href: `${adminBase}/settings`, icon: Settings },
  ];

  const staffNav: NavItem[] = [
    { label: 'Staff Accounts', href: `${adminBase}/staff`, icon: Users },
    { label: 'Roles & Perms', href: `${adminBase}/roles`, icon: KeyRound },
    { label: 'Activity Log', href: `${adminBase}/activity-log`, icon: History },
  ];

  const isActive = (href: string) => {
    if (href === adminBase) {
      return pathname === adminBase || pathname === `${adminBase}/`;
    }
    return pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
          active
            ? 'bg-zinc-900 text-white shadow-xs font-bold'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-rose-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 ${
              active
                ? 'bg-rose-500 text-white'
                : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-zinc-900 font-sans flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#0A0B0E] text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">AuraGlass Admin</h2>
            <p className="text-[10px] text-zinc-400">Glass Poster Merchant Portal</p>
          </div>
        </div>

        <Link
          href={baseHref}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Sidebar (Desktop Persistent / Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0B0E] text-zinc-300 flex flex-col border-r border-zinc-800/90 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <Link href={adminBase} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-rose-400 flex items-center justify-center bg-zinc-900">
              <span className="font-serif font-black text-rose-400 text-xs tracking-tighter">AG</span>
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-widest text-white uppercase block leading-none">
                AURAGLASS
              </span>
              <span className="text-[9px] tracking-wider font-semibold text-zinc-500 uppercase block mt-1">
                Merchant Admin Panel
              </span>
            </div>
          </Link>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live sync pill */}
        <div className="px-5 py-2.5 bg-zinc-900/80 border-b border-zinc-800/60 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Shared Demo Sync
          </span>
          <span className="font-mono text-[10px] text-zinc-500">v2.0-client</span>
        </div>

        {/* Nav List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Store Management */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-2">
              Store Management
            </div>
            <nav className="space-y-1">
              {storeManagementNav.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </div>

          {/* Staff & Security */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 mb-2">
              Staff & System
            </div>
            <nav className="space-y-1">
              {staffNav.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom User & Storefront Link */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 space-y-2">
          <Link
            href={baseHref}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors border border-zinc-800"
          >
            <Store className="w-4 h-4 text-rose-400" />
            <span>Open Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          {/* Admin Profile Area */}
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
              MF
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Mahir Faysal</p>
              <p className="text-[10px] text-zinc-400 truncate">Store Owner • Banani Studio</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
