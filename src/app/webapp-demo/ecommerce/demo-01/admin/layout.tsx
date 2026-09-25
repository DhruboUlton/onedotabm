import React from 'react';
import type { Metadata } from 'next';
import { AdminShell } from './AdminShell';
import { DemoFrame } from '@/demos/components/DemoFrame';
import { storeName } from '../_data/catalog';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: `Interactive admin panel demo for ${storeName}, built by OneDot ABM.`,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <DemoFrame category="ecommerce" demo="demo-01" name={storeName} mode="admin" />
    </>
  );
}
