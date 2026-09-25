'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';
import { Star, CheckCircle2, ArrowRight, Store, ShieldCheck, Sparkles } from 'lucide-react';

export default function VendorsPage() {
  const { vendors, products } = useStore();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          Verified Hardware Partners
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          Marketplace Vendor Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Discover specialized hardware laboratories, audio acoustics studios, and custom peripheral engineers meeting our strict verification standards.
        </p>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendors.map((vendor) => {
          const vendorProductCount = products.filter((p) => p.vendorId === vendor.id).length;
          return (
            <div
              key={vendor.id}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Banner & Logo */}
                <div className="relative h-32 w-full bg-slate-800">
                  <Image src={vendor.banner} alt={vendor.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute -bottom-6 left-5 w-14 h-14 rounded-2xl border-2 border-white dark:border-slate-900 overflow-hidden shadow-lg bg-white">
                    <Image src={vendor.logo} alt={vendor.name} width={56} height={56} className="object-cover" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-8 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{vendor.name}</h3>
                    {vendor.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {vendor.bio}
                  </p>

                  <div className="text-[11px] text-slate-400 font-medium">
                    HQ: {vendor.location}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{vendor.rating}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">Score</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{vendor.salesCount}</div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">Dispatches</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{vendorProductCount}</div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">Products</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/webapp-demo/ecommerce/demo-03/products?vendor=${vendor.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <span>Explore Vendor Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recruitment Callout */}
      <section id="sell" className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
          <Store className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50">
          Interested in Selling on Kinetic Gear?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          We onboard high-integrity hardware labs with dedicated quality inspection and rapid delivery SLAs.
        </p>
        <Link
          href="/webapp-demo/ecommerce/demo-03/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-md"
        >
          <span>Submit Vendor Application</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
