'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../_context/StoreContext';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Layers,
  Award,
  BookmarkCheck,
  CheckCircle,
  AlertTriangle,
  Bell,
  Store,
  FileText,
  Percent,
  Wallet,
  Activity,
  ShoppingCart,
  GitBranch,
  RotateCcw,
  Truck,
  AlertCircle,
  Users,
  Heart,
  Headphones,
  Tag,
  Zap,
  Flame,
  Star,
  Megaphone,
  Layout,
  Image as ImageIcon,
  BookOpen,
  HelpCircle,
  Quote,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Flag,
  DollarSign,
  CreditCard,
  Building,
  ArrowLeftRight,
  Settings,
  Scale,
  BellRing,
  UserCheck,
  History,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Moon,
  Sun,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const adminNavGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/webapp-demo/ecommerce/demo-03/admin', icon: LayoutDashboard },
      { name: 'Analytics & Reports', href: '/webapp-demo/ecommerce/demo-03/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { name: 'Products & Variants', href: '/webapp-demo/ecommerce/demo-03/admin/products', icon: Package },
      { name: 'Categories', href: '/webapp-demo/ecommerce/demo-03/admin/categories', icon: Layers },
      { name: 'Brands', href: '/webapp-demo/ecommerce/demo-03/admin/brands', icon: Award },
      { name: 'Collections', href: '/webapp-demo/ecommerce/demo-03/admin/collections', icon: BookmarkCheck },
      { name: 'Product Approvals', href: '/webapp-demo/ecommerce/demo-03/admin/approvals', icon: CheckCircle, badge: '3' },
      { name: 'Inventory', href: '/webapp-demo/ecommerce/demo-03/admin/inventory', icon: AlertTriangle },
      { name: 'Stock Alerts', href: '/webapp-demo/ecommerce/demo-03/admin/stock-alerts', icon: Bell, badge: '2' },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      { name: 'Vendors', href: '/webapp-demo/ecommerce/demo-03/admin/vendors', icon: Store },
      { name: 'Vendor Applications', href: '/webapp-demo/ecommerce/demo-03/admin/vendor-applications', icon: FileText, badge: '4' },
      { name: 'Vendor Commissions', href: '/webapp-demo/ecommerce/demo-03/admin/commissions', icon: Percent },
      { name: 'Payouts & Settlements', href: '/webapp-demo/ecommerce/demo-03/admin/payouts', icon: Wallet, badge: '$18k' },
      { name: 'Vendor Performance', href: '/webapp-demo/ecommerce/demo-03/admin/vendor-performance', icon: Activity },
    ],
  },
  {
    title: 'Orders',
    items: [
      { name: 'All Orders', href: '/webapp-demo/ecommerce/demo-03/admin/orders', icon: ShoppingCart },
      { name: 'Orders Pipeline', href: '/webapp-demo/ecommerce/demo-03/admin/pipeline', icon: GitBranch },
      { name: 'Returns & Refunds', href: '/webapp-demo/ecommerce/demo-03/admin/returns', icon: RotateCcw, badge: '1' },
      { name: 'Shipping & Delivery', href: '/webapp-demo/ecommerce/demo-03/admin/shipping-delivery', icon: Truck },
      { name: 'Order Issues', href: '/webapp-demo/ecommerce/demo-03/admin/order-issues', icon: AlertCircle },
    ],
  },
  {
    title: 'Customers',
    items: [
      { name: 'Customers Directory', href: '/webapp-demo/ecommerce/demo-03/admin/customers', icon: Users },
      { name: 'Wishlist Activity', href: '/webapp-demo/ecommerce/demo-03/admin/wishlists', icon: Heart },
      { name: 'Customer Support', href: '/webapp-demo/ecommerce/demo-03/admin/support', icon: Headphones, badge: '5' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { name: 'Discounts & Coupons', href: '/webapp-demo/ecommerce/demo-03/admin/discounts', icon: Tag },
      { name: 'Promotions', href: '/webapp-demo/ecommerce/demo-03/admin/promotions', icon: Zap },
      { name: 'Flash Sales', href: '/webapp-demo/ecommerce/demo-03/admin/flash-sales', icon: Flame },
      { name: 'Featured Products', href: '/webapp-demo/ecommerce/demo-03/admin/featured-products', icon: Star },
      { name: 'Campaigns', href: '/webapp-demo/ecommerce/demo-03/admin/campaigns', icon: Megaphone },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: 'Homepage Content', href: '/webapp-demo/ecommerce/demo-03/admin/homepage-content', icon: Layout },
      { name: 'Banners & Hero', href: '/webapp-demo/ecommerce/demo-03/admin/banners', icon: ImageIcon },
      { name: 'Blog / Articles', href: '/webapp-demo/ecommerce/demo-03/admin/articles', icon: BookOpen },
      { name: 'FAQs', href: '/webapp-demo/ecommerce/demo-03/admin/faqs', icon: HelpCircle },
      { name: 'Testimonials', href: '/webapp-demo/ecommerce/demo-03/admin/testimonials', icon: Quote },
    ],
  },
  {
    title: 'Moderation',
    items: [
      { name: 'Reviews Moderation', href: '/webapp-demo/ecommerce/demo-03/admin/reviews', icon: MessageSquare },
      { name: 'Product Moderation', href: '/webapp-demo/ecommerce/demo-03/admin/product-moderation', icon: ShieldAlert },
      { name: 'Vendor Moderation', href: '/webapp-demo/ecommerce/demo-03/admin/vendor-moderation', icon: ShieldCheck },
      { name: 'Reports / Complaints', href: '/webapp-demo/ecommerce/demo-03/admin/reports', icon: Flag, badge: '2' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { name: 'Revenue', href: '/webapp-demo/ecommerce/demo-03/admin/revenue', icon: DollarSign },
      { name: 'Commission Ledger', href: '/webapp-demo/ecommerce/demo-03/admin/finance-commissions', icon: Percent },
      { name: 'Vendor Balances', href: '/webapp-demo/ecommerce/demo-03/admin/vendor-balances', icon: Building },
      { name: 'Transactions', href: '/webapp-demo/ecommerce/demo-03/admin/transactions', icon: ArrowLeftRight },
      { name: 'Payment Management', href: '/webapp-demo/ecommerce/demo-03/admin/payments', icon: CreditCard },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Store Settings', href: '/webapp-demo/ecommerce/demo-03/admin/settings', icon: Settings },
      { name: 'Shipping Settings', href: '/webapp-demo/ecommerce/demo-03/admin/shipping-settings', icon: Truck },
      { name: 'Tax & VAT', href: '/webapp-demo/ecommerce/demo-03/admin/tax', icon: Scale },
      { name: 'Payment Settings', href: '/webapp-demo/ecommerce/demo-03/admin/payment-settings', icon: CreditCard },
      { name: 'Notification Settings', href: '/webapp-demo/ecommerce/demo-03/admin/notifications', icon: BellRing },
      { name: 'Admin Users & Roles', href: '/webapp-demo/ecommerce/demo-03/admin/users-roles', icon: UserCheck },
      { name: 'Activity Log', href: '/webapp-demo/ecommerce/demo-03/admin/activity-log', icon: History },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDark, toggleTheme, resetAllData } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Keep track of which groups are collapsed/expanded
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Auto-expand the active section based on current path
  useEffect(() => {
    adminNavGroups.forEach((group) => {
      const hasActive = group.items.some((item) => pathname === item.href);
      if (hasActive) {
        setCollapsedGroups((prev) => ({ ...prev, [group.title]: false }));
      }
    });
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/webapp-demo/ecommerce/demo-03/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/30">
                K
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                  KINETIC<span className="text-blue-600 dark:text-blue-400">ADMIN</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Marketplace Command Console</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Reset Demo State */}
            <button
              onClick={resetAllData}
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
              title="Reset all demo data to default state"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset State</span>
            </button>

            {/* Dark Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Back to Live Storefront */}
            <Link
              href="/webapp-demo/ecommerce/demo-03"
              className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex">
        {/* Admin Sidebar Navigation */}
        <aside
          className={`fixed lg:sticky top-[53px] inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
          style={{ height: 'calc(100vh - 53px)' }}
        >
          {/* Scrollable Nav Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {adminNavGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.title] ?? false;
              const hasActiveChild = group.items.some((item) => pathname === item.href);

              return (
                <div key={group.title} className="space-y-1">
                  {/* Collapsible Section Header */}
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg transition-colors group"
                  >
                    <span className={hasActiveChild ? 'text-blue-600 dark:text-blue-400 font-black' : ''}>
                      {group.title}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </button>

                  {/* Group Items */}
                  {!isCollapsed && (
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-sm font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                              <span className="truncate">{item.name}</span>
                            </div>

                            {item.badge && (
                              <span
                                className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Footer Notice */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
            <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[10px] text-blue-900 dark:text-blue-300 leading-tight">
              <strong>Storefront Sync:</strong> Changes instantly synchronize to customer marketplace catalog.
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
