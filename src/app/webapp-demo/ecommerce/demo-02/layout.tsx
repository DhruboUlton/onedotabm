import React from 'react';
import type { Metadata } from 'next';
import { StoreProvider } from './_context/StoreContext';
import { ToastContainer } from './_components/ToastContainer';
import { DemoFrame } from '@/demos/components/DemoFrame';

export const metadata: Metadata = {
  title: 'AuraGlass Studio | Ultra-Reflective Tempered Glass Wall Art',
  description:
    'Luxe reflective glass posters in Bangladesh. High-definition motorsport, anime, motivational and sacred Islamic wall art on 4mm shatter-resistant tempered glass.',
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
