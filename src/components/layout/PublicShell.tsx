"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Individual demos render their own chrome — they stand in for separate
 * products, so the OneDot navbar and footer must not wrap them. The showcase
 * pages above them (/webapp-demo and /webapp-demo/[category]) do keep it.
 *
 *   /webapp-demo                          -> OneDot chrome
 *   /webapp-demo/ecommerce                -> OneDot chrome
 *   /webapp-demo/ecommerce/demo-01        -> demo's own chrome
 *   /webapp-demo/ecommerce/demo-01/admin  -> demo's own chrome
 */
function isInsideDemo(pathname: string | null): boolean {
  if (!pathname?.startsWith("/webapp-demo")) return false;
  return pathname.split("/").filter(Boolean).length >= 3;
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin || isInsideDemo(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-24 sm:pt-28">{children}</main>
      <Footer />
    </>
  );
}
