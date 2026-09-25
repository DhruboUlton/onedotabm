'use client';

import React from 'react';
import { useStore } from '../_context/StoreContext';
import { ShoppingBag, MessageCircle } from 'lucide-react';

export function FloatingWidgets() {
  const { cartCount, setIsCartOpen, settings } = useStore();

  return (
    <>
      {/* 1. Floating Cart Tab on Right Edge */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center bg-[#0A0B0E] hover:bg-black text-white p-2.5 rounded-l-2xl shadow-2xl border-y border-l border-zinc-700 transition-all hover:pl-3.5 group cursor-pointer"
          title="Open Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 mt-1.5 [writing-mode:vertical-lr] rotate-180">
            Cart ({cartCount})
          </span>
        </button>
      </div>

      {/* 2. Floating WhatsApp Chat Bubble on Bottom Right */}
      <div className="fixed bottom-24 right-5 z-40">
        <a
          href={`https://wa.me/8801792884422?text=${encodeURIComponent(
            'Hello AuraGlass Studio! I would like to inquire about your reflective glass posters.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl shadow-green-600/30 transition-transform hover:scale-110 active:scale-95 group relative"
          title="Chat with AuraGlass on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-zinc-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Order on WhatsApp
          </span>
        </a>
      </div>
    </>
  );
}
