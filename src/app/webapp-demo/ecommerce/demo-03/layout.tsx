import React from 'react';
import type { Metadata } from 'next';
import { StoreProvider } from './_context/StoreContext';
import { ToastContainer } from './_components/ToastContainer';
import { DemoFrame } from '@/demos/components/DemoFrame';

export const metadata: Metadata = {
  title: 'Kinetic Gear | Next-Gen Multi-Vendor Electronics Marketplace',
  description:
    'High-performance consumer electronics, creator ultrabooks, flagship 5G devices, GaN charging power stations, and low-latency esports hardware from verified tech vendors.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <ToastContainer />
      <DemoFrame />
    </StoreProvider>
  );
}
