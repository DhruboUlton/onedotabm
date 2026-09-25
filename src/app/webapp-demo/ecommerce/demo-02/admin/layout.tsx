import React from 'react';
import type { Metadata } from 'next';
import { AdminShell } from '../_components/AdminShell';

export const metadata: Metadata = {
  title: 'Merchant Admin Portal | AuraGlass Studio',
  description: 'Manage glass wall art catalogue, orders, inventory, pricing, and marketing promotions.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
