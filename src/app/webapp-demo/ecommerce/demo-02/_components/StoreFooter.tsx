'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Award, Truck, RotateCcw } from 'lucide-react';
import { useStore } from '../_context/StoreContext';

interface StoreFooterProps {
  baseHref?: string;
}

export function StoreFooter({ baseHref = '/webapp-demo/ecommerce/demo-02' }: StoreFooterProps) {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-[#0A0B0E] text-zinc-400 border-t border-zinc-800">
      {/* 1. Value propositions strip */}
      <div className="border-b border-zinc-800/80 bg-[#0E1015] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-amber-400 shrink-0 border border-zinc-700/50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  4mm Tempered Glass
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Shatter-proof & diamond polished</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-rose-400 shrink-0 border border-zinc-700/50">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Lifetime Color Warranty
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">UV-cured pigment will never fade</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-blue-400 shrink-0 border border-zinc-700/50">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Nationwide Delivery
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Safe wooden-framed transit</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-emerald-400 shrink-0 border border-zinc-700/50">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Transit Protection
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Free instant damage replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={baseHref} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border-2 border-rose-300 flex items-center justify-center bg-zinc-900 shadow-xs">
                <span className="font-serif font-black text-rose-400 text-xs tracking-tighter">AG</span>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-[0.15em] text-white uppercase block leading-none">
                  AURAGLASS
                </span>
                <span className="text-[9px] tracking-[0.3em] font-medium text-zinc-400 uppercase block mt-0.5">
                  LUXE GLASS WALL ART
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-zinc-400 max-w-sm">
              AuraGlass Studio is Bangladesh’s premier architectural glass poster atelier. We transform automotive passion, anime art, and spiritual geometry into luminous diamond-polished tempered glass statements.
            </p>

            <div className="space-y-2 text-xs text-zinc-300 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{settings.phone} (10:00 AM - 10:00 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`${baseHref}/categories/${c.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href={`${baseHref}/products`} className="hover:text-white transition-colors">
                  All Glass Posters
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/products?badge=Best+Seller`} className="hover:text-white transition-colors">
                  Best Selling Glass Art
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/cart`} className="hover:text-white transition-colors">
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/checkout`} className="hover:text-white transition-colors">
                  Secure Checkout
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/admin`} className="hover:text-white text-zinc-300 font-semibold transition-colors">
                  Merchant Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Installation & Guarantee */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              How It Works
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every glass poster arrives with premium 3M Command™ adhesive hanging strips. No power tools or drills required. Mount securely in under 60 seconds without damaging wall paint.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
              <strong className="text-rose-400 block mb-0.5">100% Transit Safe</strong>
              If your glass poster arrives chipped or cracked, we dispatch a fresh unit immediately at zero cost.
            </div>
          </div>
        </div>

        {/* 3. Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AuraGlass Studio. All rights reserved.</p>

          <div className="flex items-center gap-2 text-zinc-400">
            <span className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-mono">bKash</span>
            <span className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-mono">Nagad</span>
            <span className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-mono">Visa</span>
            <span className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-mono">Mastercard</span>
            <span className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-mono">COD</span>
          </div>

          <p className="text-zinc-500">
            Powered by <span className="text-zinc-300 font-semibold">OneDot ABM</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
