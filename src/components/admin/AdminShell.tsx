'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  BarChart3,
  Plug2,
  Users2,
  Settings,
  Menu,
  X,
  Plus,
  Bell,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
  FolderKanban,
  Building2,
  UserCheck,
} from 'lucide-react';
import { ProfileRecord } from '@/types/database';

interface AdminShellProps {
  children: React.ReactNode;
  adminUser?: ProfileRecord | null;
}

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Quotations', href: '/admin/quotations', icon: FileText },
  { name: 'Billing & Invoices', href: '/admin/billing', icon: Receipt },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Integrations', href: '/admin/integrations', icon: Plug2 },
  { name: 'Team Management', href: '/admin/team', icon: Users2 },
  { name: 'Company Settings', href: '/admin/settings', icon: Settings },
];

const crmQuickLinks = [
  { name: 'Leads Pipeline', href: '/admin/leads', icon: UserCheck },
  { name: 'Client Directory', href: '/admin/clients', icon: Building2 },
  { name: 'Client Projects', href: '/admin/projects', icon: FolderKanban },
];

export function AdminShell({ children, adminUser }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // Close mobile drawer on navigation
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const activeUser = adminUser || {
    full_name: 'Dhrubo Duti Biswas',
    role: 'owner',
    email: 'dhrubo@onedotabm.com',
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col lg:flex-row text-[#111111] font-sans antialiased">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#E5E5E2] flex flex-col
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#E5E5E2]">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-[#1400FF] transition-colors">
              1•
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-[#111111]">OneDot</span>
                <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[rgba(20,0,255,0.08)] text-[#1400FF] border border-[rgba(20,0,255,0.15)]">
                  ABM Admin
                </span>
              </div>
              <span className="text-[11px] text-[#858585]">Finance & System Hub</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-[#858585] hover:text-[#111111] hover:bg-[#F0F0ED] lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Workstream */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider font-semibold text-[#858585]">
              Finance & Systems
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                      ${
                        isActive
                          ? 'bg-[#1400FF] text-white shadow-xs font-semibold'
                          : 'text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED]'
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-[#858585]'
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white/70" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CRM & Delivery Links */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider font-semibold text-[#858585]">
              Operations & CRM
            </div>
            <nav className="space-y-1">
              {crmQuickLinks.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150
                      ${
                        isActive
                          ? 'bg-[#111111] text-white'
                          : 'text-[#666666] hover:text-[#111111] hover:bg-[#F0F0ED]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[#858585]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: System Status & User Profile */}
        <div className="p-4 border-t border-[#E5E5E2] bg-[#FAFAF8] space-y-3">
          {/* Live Status Badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#E5E5E2] text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono text-[#555555]">PostgreSQL Live</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Connected
            </span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#E5E5E2]">
            <div className="w-9 h-9 rounded-full bg-[#1400FF] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {activeUser.full_name?.charAt(0) || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#111111] truncate">
                {activeUser.full_name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-[#1400FF] font-medium">
                  {activeUser.role}
                </span>
                <span className="text-[#D8D8D4]">•</span>
                <span className="text-[10px] text-[#858585] truncate">Dhaka HQ</span>
              </div>
            </div>
            <Link
              href="/admin/settings"
              className="p-1.5 rounded-lg text-[#858585] hover:text-[#111111] hover:bg-[#F0F0ED]"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-8 bg-white/90 backdrop-blur-md border-b border-[#E5E5E2] sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#858585] hidden sm:inline">Portal /</span>
              <span className="text-sm font-semibold text-[#111111] capitalize">
                {pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setQuickActionOpen(!quickActionOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-[#222222] text-white text-xs font-medium transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create</span>
              </button>

              {quickActionOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setQuickActionOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E5E5E2] shadow-xl p-2 z-30 space-y-1">
                    <Link
                      href="/admin/quotations?create=true"
                      onClick={() => setQuickActionOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-[#F0F0ED] transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[#1400FF]" />
                      <span>New Quotation</span>
                    </Link>
                    <Link
                      href="/admin/billing?create=true"
                      onClick={() => setQuickActionOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-[#F0F0ED] transition-colors"
                    >
                      <Receipt className="w-4 h-4 text-emerald-600" />
                      <span>New Invoice</span>
                    </Link>
                    <Link
                      href="/admin/billing?record_payment=true"
                      onClick={() => setQuickActionOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-[#F0F0ED] transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      <span>Record Payment</span>
                    </Link>
                    <Link
                      href="/admin/team?invite=true"
                      onClick={() => setQuickActionOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-[#F0F0ED] transition-colors"
                    >
                      <Users2 className="w-4 h-4 text-purple-600" />
                      <span>Invite Team Member</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Public Site Link */}
            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-lg text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
              title="Visit live site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
