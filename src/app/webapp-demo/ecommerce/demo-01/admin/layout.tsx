import React from 'react';
import type { Metadata } from 'next';
import { AdminShell } from '../_components/AdminShell';

export const metadata: Metadata = {
  title: 'Merchant Admin Portal | Shuddha Harvest',
  description: 'Manage store orders, products, inventory, marketing banners, and business settings.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
