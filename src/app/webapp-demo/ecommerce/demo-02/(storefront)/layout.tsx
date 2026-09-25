'use client';

import React from 'react';
import { StoreHeader } from '../_components/StoreHeader';
import { StoreFooter } from '../_components/StoreFooter';
import { CartDrawer } from '../_components/CartDrawer';
import { PromoPopup } from '../_components/PromoPopup';
import { FloatingWidgets } from '../_components/FloatingWidgets';

const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFCFB] font-sans text-zinc-900 selection:bg-black selection:text-white">
      {/* Persistent Storefront Header */}
      <StoreHeader baseHref={baseHref} />

      {/* Main Page Content */}
      <main className="flex-1 pb-16">{children}</main>

      {/* Persistent Storefront Footer */}
      <StoreFooter baseHref={baseHref} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer baseHref={baseHref} />

      {/* Promotional Discount Popup */}
      <PromoPopup baseHref={baseHref} />

      {/* Floating Cart Tab & WhatsApp Button */}
      <FloatingWidgets />
    </div>
  );
}
