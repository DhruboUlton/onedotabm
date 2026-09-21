"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { ProfileRecord } from "@/types/database";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";

export interface AdminShellProps {
  currentAdmin: ProfileRecord | null;
  children: React.ReactNode;
}

export function AdminShell({ currentAdmin, children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Automatically close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col text-[#111111]">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col fixed inset-y-0 left-0 border-r border-[#E5E5E2] bg-white z-30">
        <AdminSidebar currentAdmin={currentAdmin} />
      </aside>

      {/* Mobile Drawer Overlay & Sliding Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Close button on top-right of mobile drawer */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-3 w-8 h-8 rounded-full border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111] flex items-center justify-center z-20"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>

            <AdminSidebar
              currentAdmin={currentAdmin}
              onNavClick={() => setMobileMenuOpen(false)}
              className="border-r-0"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 xl:pl-72 min-w-0">
        <AdminHeader
          currentAdmin={currentAdmin}
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
