"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Target,
  Users,
  Briefcase,
  Globe,
  Layers,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  Megaphone,
  FileSpreadsheet,
  Receipt,
  BarChart3,
  Cpu,
  Users2,
  Settings,
  ExternalLink,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileRecord } from "@/types/database";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { logoutAdminAction } from "@/lib/auth/actions";

export interface AdminSidebarProps {
  currentAdmin: ProfileRecord | null;
  onNavClick?: () => void;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Leads", href: "/admin/leads", icon: Inbox },
      { label: "Prospects", href: "/admin/prospects", icon: Target },
      { label: "Clients", href: "/admin/clients", icon: Users },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Projects", href: "/admin/projects", icon: Briefcase },
      { label: "Websites", href: "/admin/websites", icon: Globe },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Portfolio", href: "/admin/portfolio", icon: Layers },
      { label: "Case Studies", href: "/admin/case-studies", icon: FileCheck2 },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Logos", href: "/admin/logos", icon: ImageIcon },
      { label: "Site Banner", href: "/admin/site-banner", icon: Megaphone },
    ],
  },
  {
    title: "Sales & Finance",
    items: [
      { label: "Quotations", href: "/admin/quotations", icon: FileSpreadsheet },
      { label: "Billing", href: "/admin/billing", icon: Receipt },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Integrations", href: "/admin/integrations", icon: Cpu },
      { label: "Team", href: "/admin/team", icon: Users2 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({
  currentAdmin,
  onNavClick,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminAction();
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white text-[#111111] select-none border-r border-[#E5E5E2]",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#E5E5E2] flex items-center justify-between shrink-0 bg-white">
        <Link
          href="/admin/dashboard"
          onClick={onNavClick}
          className="flex items-center gap-2.5 group"
          aria-label="OneDot Admin Dashboard"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#E5E5E2] bg-[#F7F7F5] flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="OneDot ABM Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-sm tracking-tight text-[#111111] leading-none flex items-center gap-1">
              OneDot <span className="text-[#1400FF]">ABM</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#858585] mt-0.5">
              Command Core
            </span>
          </div>
        </Link>

        <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[rgba(20,0,255,0.08)] text-[#1400FF] border border-[rgba(20,0,255,0.2)]">
          ADMIN
        </span>
      </div>

      {/* Navigation Groups (Scrollable) */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin"
        aria-label="Admin Sidebar Navigation"
      >
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <div className="px-3 pb-1 pt-1 font-mono text-[10px] uppercase tracking-widest text-[#858585] font-semibold">
                {section.title}
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/admin/dashboard"
                    ? pathname === "/admin/dashboard" || pathname === "/admin"
                    : pathname.startsWith(item.href);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                      isActive
                        ? "bg-[rgba(20,0,255,0.06)] text-[#1400FF] font-semibold"
                        : "text-[#555555] hover:text-[#111111] hover:bg-[#F7F7F5]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-[#1400FF]"
                            : "text-[#858585] group-hover:text-[#111111]"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#F0F0ED] text-[#555555]">
                        {item.badge}
                      </span>
                    )}

                    {/* Active Route Indicator Pill */}
                    {isActive && (
                      <span className="absolute right-1 w-1.5 h-4 rounded-full bg-[#1400FF]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section: Website Link, Profile & Sign Out */}
      <div className="p-3 border-t border-[#E5E5E2] bg-[#F7F7F5]/50 space-y-2 shrink-0">
        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-[#555555] hover:text-[#111111] hover:bg-white border border-transparent hover:border-[#E5E5E2] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#858585]" />
            <span>View Website</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-[#858585]" />
        </Link>

        {/* Profile Pill & Sign Out */}
        <div className="pt-2 border-t border-[#E5E5E2] flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-white border border-[#E5E5E2] flex items-center justify-center text-xs font-mono font-bold text-[#1400FF] shrink-0">
              {getInitials(currentAdmin?.full_name)}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#111111] truncate leading-tight">
                {currentAdmin?.full_name || "Admin User"}
              </span>
              <div className="mt-0.5 flex items-center">
                <AdminBadge
                  size="xs"
                  status={currentAdmin?.role || "admin"}
                  dot={false}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="p-1.5 rounded-lg border border-[#E5E5E2] bg-white text-[#858585] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors shrink-0"
            title="Sign Out"
            aria-label="Sign Out"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#1400FF]" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
