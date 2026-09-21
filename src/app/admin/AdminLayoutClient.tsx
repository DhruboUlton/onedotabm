'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Target,
  Building2,
  Layers,
  Globe,
  FileText,
  CreditCard,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  BookOpen,
  PenTool,
  Image as ImageIcon,
  Megaphone,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Prospects (Deals)', href: '/admin/prospects', icon: Target },
  { name: 'Clients', href: '/admin/clients', icon: Building2 },
  { name: 'Projects', href: '/admin/projects', icon: Layers },
  { name: 'Websites', href: '/admin/websites', icon: Globe },
  { name: 'Quotations', href: '/admin/quotations', icon: FileText },
  { name: 'Invoices', href: '/admin/invoices', icon: CreditCard },
];

const contentNavItems: NavItem[] = [
  { name: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
  { name: 'Case Studies', href: '/admin/case-studies', icon: BookOpen },
  { name: 'Blog Posts', href: '/admin/blog', icon: PenTool },
  { name: 'Client Logos', href: '/admin/logos', icon: ImageIcon },
  { name: 'Site Banner', href: '/admin/site-banner', icon: Megaphone },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F7F5] text-[#111111] antialiased">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#E5E5E2] flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-[#E5E5E2]">
          <Link href="/admin/leads" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1400FF] flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
              1.
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight text-[#111111]">OneDot</span>
              <span className="ml-1.5 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1400FF]/10 text-[#1400FF] font-medium tracking-wide">
                CRM
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:text-black hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          <div>
            <p className="px-3 text-[11px] font-mono uppercase text-[#858585] tracking-wider mb-2 font-semibold">
              Sales & Pipeline
            </p>
            <nav className="space-y-1">
              {navItems.slice(0, 3).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1400FF] text-white shadow-sm'
                        : 'text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-[#858585] group-hover:text-[#111111]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-mono uppercase text-[#858585] tracking-wider mb-2 font-semibold">
              Operations & Delivery
            </p>
            <nav className="space-y-1">
              {navItems.slice(3).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1400FF] text-white shadow-sm'
                        : 'text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-[#858585] group-hover:text-[#111111]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-mono uppercase text-[#858585] tracking-wider mb-2 font-semibold">
              Content & CMS
            </p>
            <nav className="space-y-1">
              {contentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1400FF] text-white shadow-sm'
                        : 'text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-[#858585] group-hover:text-[#111111]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-2">
            <div className="p-4 rounded-xl bg-[#F0F0ED] border border-[#E5E5E2] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#111111]">
                <Sparkles className="w-3.5 h-3.5 text-[#1400FF]" />
                <span>OneDot ABM Engine</span>
              </div>
              <p className="text-[12px] text-[#555555] leading-relaxed">
                Integrated account-based marketing, pipeline conversion & live telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-[#E5E5E2] bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1400FF]/10 border border-[#1400FF]/20 flex items-center justify-center text-[#1400FF] font-semibold text-xs">
                DB
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#111111] leading-tight">Dhrubo Duti Biswas</span>
                <span className="text-[11px] text-[#858585] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Owner / Admin
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg border border-[#E5E5E2] text-xs font-medium text-[#555555] hover:bg-[#F0F0ED] hover:text-[#111111] transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-18 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E5E5E2] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#858585]">
              <span>OneDot Platform</span>
              <span>/</span>
              <span className="text-[#111111] font-semibold capitalize">
                {pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F0ED] border border-[#E5E5E2] text-xs font-medium text-[#555555]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase Cloud DB Connected</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
