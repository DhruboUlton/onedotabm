'use client';

import React from 'react';
import { ShoppingBag, MessageCircle, Phone } from 'lucide-react';
import { useStore } from '../_context/StoreContext';

export function FloatingWidgets() {
  const { cartCount, cartTotal, setIsCartOpen, settings } = useStore();

  return (
    <>
      {/* 1. Floating Cart Badge on Right Center (Matches Screenshot 1) */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center rounded-l-2xl bg-[#E87121] px-2.5 py-3.5 text-white shadow-xl hover:bg-[#D46013] transition-all hover:pl-3.5 group"
        aria-label="Open Cart"
      >
        <div className="relative mb-1">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#E87121] shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
        </span>
        <span className="mt-0.5 rounded-md bg-black/20 px-1.5 py-0.5 font-mono text-[10px] font-bold">
          ৳{cartTotal.toLocaleString()}
        </span>
      </button>

      {/* 2. Floating WhatsApp / Call Action Button on Bottom Right (Matches Screenshot 1) */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2">
        <a
          href={`https://wa.me/8801711234567?text=${encodeURIComponent(
            'Hello, I would like to order organic products from Shuddha Harvest.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </>
  );
}
