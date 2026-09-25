import React from 'react';
import type { Metadata } from 'next';
import { StoreProvider } from './_context/StoreContext';
import { ToastContainer } from './_components/ToastContainer';
import { DemoFrame } from '@/demos/components/DemoFrame';

export const metadata: Metadata = {
  title: {
    default: 'Shuddha Harvest — 100% Pure Organic Farm Pantry',
    template: '%s | Shuddha Harvest Demo',
  },
  description:
    'Explore an interactive e-commerce website demo created by OneDot ABM. Pure cow gawa ghee, Sundarban wild honey, cold-pressed mustard oil and organic farm pantry.',
  robots: { index: false, follow: false },
};

export default function Demo01Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <ToastContainer />
      <DemoFrame />
    </StoreProvider>
  );
}
