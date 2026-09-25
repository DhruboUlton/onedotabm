"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowUpRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface NavChild {
  label: string;
  href: string;
  description: string;
}

export interface NavGroup {
  label: string;
  href: string;
  index: string;
  children?: NavChild[];
}

const navGroups: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    index: "01",
    children: [
      {
        label: "All Services",
        href: "/services",
        description: "Marketing and engineering, side by side",
      },
      {
        label: "Marketing",
        href: "/services/marketing",
        description: "Meta Ads, funnels, creative, tracking",
      },
      {
        label: "Web Development",
        href: "/services/web-development",
        description: "Sites and stores built to convert",
      },
      {
        label: "Web Applications",
        href: "/web-applications",
        description: "Portals, dashboards, internal tools",
      },
    ],
  },
  {
    label: "Work",
    href: "/work",
    index: "02",
    children: [
      {
        label: "Portfolio",
        href: "/work",
        description: "Shipped projects by category",
      },
      {
        label: "Case Studies",
        href: "/case-studies",
        description: "Verified outcomes, full write-ups",
      },
      {
        label: "WebApp Demos",
        href: "/webapp-demo",
        description: "Interactive demos you can click through",
      },
    ],
  },
  { label: "Pricing", href: "/pricing", index: "03" },
  { label: "Blog", href: "/blog", index: "04" },
  { label: "About", href: "/about", index: "05" },
  { label: "Contact", href: "/contact", index: "06" },
];

function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Deepen the material once content scrolls under the bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle body scroll lock & Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mobileMenuOpen) return;

      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  // Opening the menu expands whichever section the visitor is currently in
  const activeGroupLabel =
    navGroups.find((group) => group.children && isActivePath(pathname, group.href))?.label ?? null;

  const openMenu = () => {
    setOpenGroup(activeGroupLabel);
    setMobileMenuOpen(true);
  };

  return (
    <>
      {/* Floating pill navigation */}
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Main Navigation"
            className={cn(
              "flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 rounded-[2rem]",
              "bg-[rgba(255,255,255,0.72)] backdrop-blur-xl border border-[#E5E5E2]",
              // Only the material changes on scroll — height stays fixed so content never shifts
              "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
              isScrolled
                ? "shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] border-[#D8D8D4]"
                : "shadow-[0_2px_12px_-8px_rgba(0,0,0,0.12)]"
            )}
          >
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]"
              aria-label="OneDot ABM Homepage"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E5E5E2] bg-white flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-100">
                <Image
                  src="/logo.png"
                  alt="OneDot ABM Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-sans font-bold text-base tracking-tight text-[#111111] leading-none hidden sm:flex items-center gap-1">
                OneDot <span className="text-[#1400FF]">ABM</span>
              </span>
            </Link>

            {/* Desktop navigation — dropdowns open on hover and on keyboard focus */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navGroups.map((group) => {
                const active = isActivePath(pathname, group.href);

                return (
                  <div key={group.label} className="relative group">
                    <Link
                      href={group.href}
                      aria-haspopup={group.children ? "true" : undefined}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-full",
                        "text-sm font-medium tracking-[-0.005em]",
                        "transition-colors duration-150 active:scale-[0.97] active:duration-75",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]",
                        active
                          ? "bg-[rgba(20,0,255,0.06)] text-[#1400FF]"
                          : "text-[#3A3A3A] hover:text-[#111111] hover:bg-[#F0F0ED]"
                      )}
                    >
                      {group.label}
                      {group.children && (
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                      )}
                    </Link>

                    {group.children && (
                      <div
                        className={cn(
                          "absolute left-0 top-full pt-3 w-72 origin-top",
                          "invisible opacity-0 scale-[0.98] transition-all duration-150 ease-out",
                          "group-hover:visible group-hover:opacity-100 group-hover:scale-100",
                          "group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100"
                        )}
                      >
                        <div className="rounded-2xl border border-[#E5E5E2] bg-white p-2 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)]">
                          {group.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block rounded-xl px-3 py-2.5 transition-colors",
                                "hover:bg-[#F0F0ED] active:bg-[rgba(20,0,255,0.06)] active:duration-75",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]",
                                isActivePath(pathname, child.href) && "bg-[rgba(20,0,255,0.06)]"
                              )}
                            >
                              <span className="block text-sm font-medium text-[#111111]">
                                {child.label}
                              </span>
                              <span className="block text-xs text-[#858585] mt-0.5 leading-snug">
                                {child.description}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/client-login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E5E5E2] bg-white/60 text-xs font-medium tracking-wide text-[#3A3A3A] hover:text-[#111111] hover:border-[#D8D8D4] active:scale-[0.97] active:duration-75 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Client Login
              </Link>

              <Button
                href="/start-a-project"
                variant="primary"
                size="sm"
                withArrow
                arrowType="diagonal"
                className="hidden sm:inline-flex"
              >
                Start a Project
              </Button>

              <Link
                href="/client-login"
                className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#E5E5E2] bg-white text-[#555555] active:bg-[#F0F0ED] active:duration-75"
                aria-label="Client Login"
              >
                <Lock className="w-3.5 h-3.5" />
              </Link>

              <button
                ref={toggleBtnRef}
                type="button"
                onClick={openMenu}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label="Open navigation menu"
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full border border-[#E5E5E2] bg-white text-[#111111] hover:bg-[#F0F0ED] active:scale-[0.95] active:duration-75 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Full-screen mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 bg-[#F7F7F5] flex flex-col p-6 sm:p-8 overflow-y-auto animate-in fade-in duration-200"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E2]">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5"
              aria-label="OneDot ABM Homepage"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E5E5E2] bg-white flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="OneDot ABM Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-base tracking-tight text-[#111111] leading-none">
                  OneDot <span className="text-[#1400FF]">ABM</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#858585]">
                  Agency &amp; Dev
                </span>
              </div>
            </Link>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#E5E5E2] bg-white text-[#111111] hover:bg-[#F0F0ED] active:scale-[0.95] active:duration-75 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grouped links */}
          <nav className="flex flex-col gap-1 py-6" aria-label="Mobile Navigation Links">
            {navGroups.map((group) => {
              const children = group.children?.filter((child) => child.href !== group.href) ?? [];
              const hasChildren = children.length > 0;
              const expanded = openGroup === group.label;
              const active = isActivePath(pathname, group.href);

              const label = (
                <span className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      "font-mono text-xs transition-colors",
                      active ? "text-[#1400FF]" : "text-[#858585]"
                    )}
                  >
                    {group.index}
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-semibold",
                      active ? "text-[#1400FF]" : "text-[#111111]"
                    )}
                  >
                    {group.label}
                  </span>
                </span>
              );

              return (
                <div key={group.label} className="py-1">
                  <div className="flex items-center justify-between gap-3 py-2 border-b border-[#E5E5E2]/60">
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => setOpenGroup(expanded ? null : group.label)}
                        aria-expanded={expanded}
                        aria-controls={`mobile-group-${group.index}`}
                        className="flex flex-1 items-center gap-3 text-left active:opacity-70 active:duration-75"
                      >
                        {label}
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-[#858585] transition-transform duration-200",
                            expanded && "rotate-180 text-[#1400FF]"
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={group.href}
                        onClick={closeMenu}
                        className="flex flex-1 items-center active:opacity-70 active:duration-75"
                      >
                        {label}
                      </Link>
                    )}

                    <Link
                      href={group.href}
                      onClick={closeMenu}
                      aria-label={`Open ${group.label}`}
                      className="shrink-0 p-1 text-[#858585] hover:text-[#1400FF] active:text-[#1400FF] transition-colors"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {hasChildren && (
                    <div
                      id={`mobile-group-${group.index}`}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                        expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col pl-9 pt-2 gap-1.5 pb-1">
                          {children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeMenu}
                              tabIndex={expanded ? undefined : -1}
                              className={cn(
                                "text-sm py-1 transition-colors active:text-[#1400FF]",
                                isActivePath(pathname, child.href)
                                  ? "text-[#1400FF]"
                                  : "text-[#555555] hover:text-[#111111]"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="flex flex-col space-y-4 pt-6 mt-auto border-t border-[#E5E5E2]">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/client-login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 h-11 rounded-full border border-[#E5E5E2] bg-white text-xs font-mono uppercase tracking-wider text-[#111111] active:bg-[#F0F0ED] active:duration-75"
              >
                <Lock className="w-3.5 h-3.5 text-[#858585]" />
                <span>Client Login</span>
              </Link>

              <Button
                href="/start-a-project"
                variant="primary"
                size="md"
                onClick={closeMenu}
                withArrow
                arrowType="diagonal"
                className="h-11"
              >
                Start a Project
              </Button>
            </div>

            <div className="flex items-center text-xs text-[#858585] pt-2">
              <span className="font-mono">hello@onedotabm.com</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
