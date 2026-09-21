"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  index: string;
}

const navItems: NavItem[] = [
  { label: "Services", href: "/services", index: "01" },
  { label: "Work", href: "/work", index: "02" },
  { label: "Case Studies", href: "/case-studies", index: "03" },
  { label: "Web Apps", href: "/web-applications", index: "04" },
  { label: "About", href: "/about", index: "05" },
  { label: "Pricing", href: "/pricing", index: "06" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Handle scroll detection
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

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out",
          isScrolled
            ? "glass-nav hairline-b py-3 sm:py-3.5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
            : "bg-transparent py-5 sm:py-6 border-b border-transparent"
        )}
      >
        <div className="editorial-container flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF] rounded-md"
            aria-label="OneDot ABM Homepage"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#E5E5E2] bg-white flex items-center justify-center transition-transform group-hover:scale-105">
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
              <span className="font-sans font-bold text-base tracking-tight text-[#111111] leading-none flex items-center gap-0.5">
                OneDot <span className="text-[#1400FF]">ABM</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#858585] leading-tight">
                Agency & Dev
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#555555] hover:text-[#111111] active:text-[#1400FF] transition-colors relative py-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF] rounded-sm"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1400FF] transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3.5">
            <Link
              href="/client-login"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#555555] hover:text-[#111111] px-3 py-2 rounded-full transition-colors border border-transparent hover:border-[#E5E5E2] hover:bg-[#F0F0ED]"
            >
              <Lock className="w-3 h-3 text-[#858585]" />
              <span>Client Login</span>
            </Link>

            <Button
              href="/start-a-project"
              variant="primary"
              size="sm"
              withArrow
              arrowType="diagonal"
            >
              Start a Project
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/client-login"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111]"
              aria-label="Client Login"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>

            <button
              ref={toggleBtnRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Open navigation menu"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#E5E5E2] bg-white text-[#111111] hover:bg-[#F0F0ED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 bg-[#F7F7F5] flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Mobile Menu Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E2]">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5"
              aria-label="OneDot ABM Homepage"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#E5E5E2] bg-white flex items-center justify-center">
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
                  Agency & Dev
                </span>
              </div>
            </Link>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#E5E5E2] bg-white text-[#111111] hover:bg-[#F0F0ED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links (Editorial Scale) */}
          <nav className="flex flex-col justify-center space-y-4 my-auto py-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-baseline justify-between py-2 border-b border-[#E5E5E2]/50 hover:border-[#111111] active:border-[#1400FF] active:opacity-70 transition-colors"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[#858585] group-hover:text-[#1400FF] transition-colors">
                    {item.index}
                  </span>
                  <span className="text-2xl sm:text-3xl font-semibold text-[#111111] group-hover:translate-x-1.5 transition-transform duration-200">
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#858585] group-hover:text-[#1400FF] transition-colors" />
              </Link>
            ))}
          </nav>

          {/* Mobile Bottom Actions & Contacts */}
          <div className="flex flex-col space-y-4 pt-6 border-t border-[#E5E5E2]">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/client-login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 h-11 rounded-full border border-[#E5E5E2] bg-white text-xs font-mono uppercase tracking-wider text-[#111111]"
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

            <div className="flex items-center justify-between text-xs text-[#858585] pt-2">
              <span className="font-mono">hello@onedotabm.com</span>
              <span className="font-mono">Dhaka // Global Remote</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
