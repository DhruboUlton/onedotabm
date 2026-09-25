'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../_context/StoreContext';
import { X, Star, ShoppingCart, Check, ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const activeVariant = quickViewProduct.variants[selectedVariantIndex] || quickViewProduct.variants[0];
  const currentImage = activeVariant?.image || quickViewProduct.primaryImage;

  const handleAddToCart = () => {
    if (activeVariant) {
      addToCart(quickViewProduct, activeVariant, qty);
      closeQuickView();
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 backdrop-blur-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Container - flush fit */}
        <div className="relative md:w-1/2 bg-slate-100 dark:bg-slate-800 overflow-hidden min-h-[300px]">
          <Image
            src={currentImage}
            alt={quickViewProduct.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover w-full h-full"
          />
          {quickViewProduct.badge && (
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-600 text-white shadow-md z-10">
              {quickViewProduct.badge}
            </span>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{quickViewProduct.brand}</span>
              <span>•</span>
              <span>{quickViewProduct.vendorName}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-snug">
              {quickViewProduct.title}
            </h2>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
                <span className="ml-1.5 font-bold text-slate-700 dark:text-slate-300">{quickViewProduct.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({quickViewProduct.reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mt-3.5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
                ${activeVariant.price.toFixed(2)}
              </span>
              {activeVariant.compareAtPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ${activeVariant.compareAtPrice.toFixed(2)}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                In Stock ({activeVariant.inventory} units)
              </span>
            </div>

            {/* Variant Selector */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Color Finish: <strong className="text-slate-900 dark:text-slate-100">{activeVariant.name}</strong>
              </label>
              <div className="flex items-center gap-2">
                {quickViewProduct.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedVariantIndex === idx
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: v.colorHex }} />
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-8 text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((prev) => prev + 1)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart • ${(activeVariant.price * qty).toFixed(2)}</span>
            </button>

            <Link
              href={`/webapp-demo/ecommerce/demo-03/products/${quickViewProduct.slug}`}
              onClick={closeQuickView}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>View Full Technical Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
