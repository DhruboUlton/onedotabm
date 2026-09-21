"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  CheckCheck,
  ExternalLink,
  Inbox,
  Receipt,
  FileCheck2,
  Info,
  Loader2,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileRecord, NotificationRecord } from "@/types/database";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import {
  fetchAdminNotificationsAction,
  markAdminNotificationReadAction,
} from "@/lib/auth/actions";
import { AdminModal } from "@/components/admin/ui/AdminModal";

export interface AdminHeaderProps {
  currentAdmin: ProfileRecord | null;
  onMenuToggle?: () => void;
  className?: string;
}

const segmentLabels: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  leads: "Leads",
  prospects: "Prospects",
  clients: "Clients",
  projects: "Projects",
  websites: "Websites",
  portfolio: "Portfolio",
  "case-studies": "Case Studies",
  blog: "Blog",
  logos: "Logos",
  "site-banner": "Site Banner",
  quotations: "Quotations",
  billing: "Billing",
  analytics: "Analytics",
  integrations: "Integrations",
  team: "Team",
  settings: "Settings",
  new: "New Record",
  edit: "Edit",
};

export function AdminHeader({
  currentAdmin,
  onMenuToggle,
  className,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Quick Search State
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load notifications on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoadingNotifications(true);
      try {
        const notifs = await fetchAdminNotificationsAction(10);
        if (isMounted) setNotifications(notifs);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        if (isMounted) setLoadingNotifications(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K opens quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  // Generate breadcrumb items
  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    let accumPath = "";
    return segments.map((seg, idx) => {
      accumPath += `/${seg}`;
      const label =
        segmentLabels[seg.toLowerCase()] ||
        seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      const isLast = idx === segments.length - 1;
      return {
        label,
        href: accumPath,
        isLast,
      };
    });
  }, [pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string, linkUrl?: string | null) => {
    await markAdminNotificationReadAction(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (linkUrl) {
      setNotificationsOpen(false);
      router.push(linkUrl);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    for (const item of unread) {
      await markAdminNotificationReadAction(item.id);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotifIcon = (type?: string) => {
    switch (type) {
      case "lead":
        return <Inbox className="w-3.5 h-3.5 text-[#1400FF]" />;
      case "billing":
        return <Receipt className="w-3.5 h-3.5 text-emerald-600" />;
      case "project":
        return <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-[#858585]" />;
    }
  };

  // Quick navigation items for search modal
  const quickJumpItems = [
    { label: "Dashboard Overview", href: "/admin/dashboard", section: "General" },
    { label: "All Qualified Leads", href: "/admin/leads", section: "Business" },
    { label: "Sales Pipeline & Prospects", href: "/admin/prospects", section: "Business" },
    { label: "Client Directory", href: "/admin/clients", section: "Business" },
    { label: "Client Projects Tracker", href: "/admin/projects", section: "Operations" },
    { label: "Client Websites & Hosting", href: "/admin/websites", section: "Operations" },
    { label: "Work Portfolio Management", href: "/admin/portfolio", section: "Content" },
    { label: "Case Studies Editor", href: "/admin/case-studies", section: "Content" },
    { label: "Articles & Blog Posts", href: "/admin/blog", section: "Content" },
    { label: "Partner & Client Logos", href: "/admin/logos", section: "Content" },
    { label: "Site Announcement Banner", href: "/admin/site-banner", section: "Content" },
    { label: "Commercial Quotations", href: "/admin/quotations", section: "Finance" },
    { label: "Client Invoices & Billing", href: "/admin/billing", section: "Finance" },
    { label: "Growth & Ad Analytics", href: "/admin/analytics", section: "Insights" },
    { label: "API Integrations Hub", href: "/admin/integrations", section: "System" },
    { label: "Internal Team Access", href: "/admin/team", section: "System" },
    { label: "Console Settings", href: "/admin/settings", section: "System" },
  ];

  const filteredQuickJump = quickJumpItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header
        className={cn(
          "h-16 px-4 sm:px-6 bg-white border-b border-[#E5E5E2] flex items-center justify-between gap-4 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]",
          className
        )}
      >
        {/* Left Section: Mobile Menu Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl border border-[#E5E5E2] bg-white text-[#111111] hover:bg-[#F0F0ED] transition-colors"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider overflow-x-auto scrollbar-none py-1"
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.href}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#858585]/60 shrink-0" />}
                {crumb.isLast ? (
                  <span className="font-semibold text-[#111111] truncate">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-[#858585] hover:text-[#111111] transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right Section: Quick Search + Notifications + Admin Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] hover:bg-white hover:border-[#D8D8D4] text-[#858585] hover:text-[#111111] transition-all text-xs font-mono"
            aria-label="Quick Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quick Jump...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white border border-[#E5E5E2] text-[#555555]">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* Notifications Trigger & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={cn(
                "relative p-2 rounded-xl border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors",
                notificationsOpen && "bg-[#F0F0ED] text-[#111111] border-[#D8D8D4]"
              )}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#1400FF] text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E5E5E2] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Popover Header */}
                <div className="p-3.5 border-b border-[#E5E5E2] bg-[#F7F7F5]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[#111111]">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[rgba(20,0,255,0.08)] text-[#1400FF] font-semibold border border-[rgba(20,0,255,0.2)]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-mono text-[#1400FF] hover:underline inline-flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E5E2]/70">
                  {loadingNotifications ? (
                    <div className="p-8 text-center text-xs text-[#858585] flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1400FF]" />
                      <span>Loading notifications...</span>
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkAsRead(notif.id, notif.link_url)}
                        className={cn(
                          "p-3.5 hover:bg-[#F7F7F5] transition-colors cursor-pointer flex items-start gap-3 text-left",
                          !notif.read ? "bg-[rgba(20,0,255,0.02)]" : ""
                        )}
                      >
                        <div className="p-2 rounded-xl bg-white border border-[#E5E5E2] shrink-0 mt-0.5">
                          {getNotifIcon(notif.type)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <h4
                              className={cn(
                                "text-xs text-[#111111] line-clamp-1",
                                !notif.read ? "font-semibold" : "font-medium"
                              )}
                            >
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#1400FF] shrink-0 mt-1" />
                            )}
                          </div>

                          <p className="text-[11px] text-[#555555] line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E5E5E2]/50 text-[10px] font-mono text-[#858585]">
                            <span>
                              {new Date(notif.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {notif.link_url && (
                              <span className="text-[#1400FF] inline-flex items-center gap-0.5">
                                View details <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-[#858585]">
                      No notifications to display
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E5E5E2]">
            <div className="w-8 h-8 rounded-full bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center text-xs font-mono font-bold text-[#1400FF] shrink-0">
              {currentAdmin?.full_name
                ? currentAdmin.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "AD"}
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-semibold text-[#111111] leading-tight">
                {currentAdmin?.full_name || "Admin"}
              </span>
              <span className="font-mono text-[10px] uppercase text-[#858585]">
                {currentAdmin?.role || "owner"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Jump Search Modal */}
      <AdminModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Admin Navigation Quick Jump"
        description="Jump instantly to any section or operational portal in OneDot ABM"
        size="md"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type section name (e.g. Leads, Quotations, Invoices)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1400FF]/40 focus:border-[#1400FF]"
            />
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#E5E5E2]/60">
            {filteredQuickJump.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  setSearchModalOpen(false);
                  router.push(item.href);
                }}
                className="w-full p-2.5 rounded-lg text-left hover:bg-[#F7F7F5] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-sm font-medium text-[#111111] group-hover:text-[#1400FF] transition-colors">
                    {item.label}
                  </div>
                  <div className="font-mono text-[10px] text-[#858585]">{item.section}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#858585] group-hover:text-[#1400FF] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </AdminModal>
    </>
  );
}
