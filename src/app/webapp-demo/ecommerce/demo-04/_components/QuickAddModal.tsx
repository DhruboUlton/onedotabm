'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Star, Check } from 'lucide-react';
import { useStore } from '../_context/StoreContext';
import { ProductVariant } from '../_types';

export function QuickAddModal() {
  const { quickAddProduct, closeQuickAdd, addToCart } = useStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!quickAddProduct) return null;

  const currentVariant =
    selectedVariant ||
    quickAddProduct.variants[0] || {
      id: 'default',
      name: 'Standard',
      sku: 'DEF',
      price: quickAddProduct.basePrice,
      inventory: quickAddProduct.stock,
    };

  const handleAdd = () => {
    addToCart(quickAddProduct, currentVariant, quantity);
    closeQuickAdd();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeQuickAdd}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeQuickAdd}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-[#EB1551] hover:text-white flex items-center justify-center transition-colors text-slate-500"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Product Thumbnail */}
          <div className="relative aspect-square rounded-2xl bg-[#FFEFE4] overflow-hidden border border-slate-100">
            <Image
              src={quickAddProduct.primaryImage}
              alt={quickAddProduct.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details & Option Picker */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#1CBBB4] uppercase tracking-wide">
                {quickAddProduct.category}
              </span>
              <h3 className="font-bubblegum text-2xl text-[#0F172A] leading-tight mt-0.5">
                {quickAddProduct.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex text-[#EB1551]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(quickAddProduct.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#6B6B84] font-bold">
                  {quickAddProduct.rating} ({quickAddProduct.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-2xl text-[#0F172A]">
                ${currentVariant.price.toFixed(2)}
              </span>
              {currentVariant.compareAtPrice && (
                <span className="text-sm text-[#F7941E] line-through font-semibold">
                  ${currentVariant.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Variant Selector */}
            {quickAddProduct.variants.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A]">Select Edition / Age:</label>
                <div className="flex flex-wrap gap-2">
                  {quickAddProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        currentVariant.id === v.id
                          ? 'border-[#0A6375] bg-[#0A6375] text-white shadow-sm'
                          : 'border-slate-200 text-[#0F172A] hover:border-[#1CBBB4]'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-bold text-[#0F172A]">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 px-3 text-slate-600 hover:bg-[#EB1551] hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 px-3 text-slate-600 hover:bg-[#1CBBB4] hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                onClick={handleAdd}
                className="w-full ws-btn-primary py-3 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • ${(currentVariant.price * quantity).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
