import React from 'react';
import type { Metadata } from 'next';
import { StoreProvider } from './_context/StoreContext';
import { ToastContainer } from './_components/ToastContainer';
import { DemoFrame } from '@/demos/components/DemoFrame';
import './demo-04.css';

export const metadata: Metadata = {
  title: 'WonderSprout | Educational Toys & Montessori Learning Tools',
  description:
    'Inspiring young minds through handcrafted wooden Montessori toys, STEM robotics, sensory activity boards, and early childhood learning tools.',
};

export default function WonderSproutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] font-nunito flex flex-col selection:bg-[#EB1551] selection:text-white">
        {children}
        <ToastContainer />
        <DemoFrame />
      </div>
    </StoreProvider>
  );
}
