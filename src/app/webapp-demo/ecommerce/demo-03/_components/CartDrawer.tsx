'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../_context/StoreContext';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, Truck, Tag, ShieldCheck } from 'lucide-react';

export function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cart,
    cartCount,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    tax,
    grandTotal,
    freeShippingProgress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between text-slate-900 dark:text-slate-100 transition-all duration-300 animate-in slide-in-from-right">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold tracking-tight">Shopping Cart</h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-4 sm:px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              {freeShippingProgress.eligible ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  You unlocked FREE Express Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-blue-600 dark:text-blue-400">${freeShippingProgress.remaining.toFixed(2)}</strong> more to get Free Express Delivery
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingProgress.eligible ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${freeShippingProgress.percent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Your cart is empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1 mb-6">
                  Explore our curated high-performance electronics, creator gear, and flagship hardware.
                </p>
                <Link
                  href="/webapp-demo/ecommerce/demo-03/products"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-start group">
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-1 shrink-0 overflow-hidden border border-slate-200/60 dark:border-slate-800">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/webapp-demo/ecommerce/demo-03/products/${item.productId}`}
                        onClick={closeCart}
                        className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {item.variantName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">• {item.vendorName}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-50">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400">
                            (${item.unitPrice.toFixed(2)} each)
                          </span>
                        )}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 sm:p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 sm:p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Totals */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 space-y-3.5">
              {/* Promo code */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-semibold">{appliedCoupon.code}</span>
                      <span className="text-[11px] opacity-80">applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-emerald-700 dark:text-emerald-400 hover:text-rose-500 text-[11px] underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. NEXUS10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full py-1.5 pl-3 pr-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-rose-500 pl-1">{couponError}</p>}
              </form>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <span>Estimated Total</span>
                  <span className="text-base text-blue-600 dark:text-blue-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/webapp-demo/ecommerce/demo-03/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>30-Day Money-Back Guarantee • Fast Tracked Delivery</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
