import React from 'react';
import { StoreHeader } from '../_components/StoreHeader';
import { StoreFooter } from '../_components/StoreFooter';
import { CartDrawer } from '../_components/CartDrawer';
import { QuickViewModal } from '../_components/QuickViewModal';
import { LocationModal } from '../_components/LocationModal';
import { MobileNavDrawer } from '../_components/MobileNavDrawer';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <StoreHeader />
      <main className="flex-1 bg-white dark:bg-slate-950">{children}</main>
      <StoreFooter />

      {/* Global Store Overlays & Drawers */}
      <CartDrawer />
      <QuickViewModal />
      <LocationModal />
      <MobileNavDrawer />
    </div>
  );
}
