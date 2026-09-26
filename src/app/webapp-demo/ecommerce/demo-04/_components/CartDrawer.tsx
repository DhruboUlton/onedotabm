'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Tag,
  Truck,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shipping,
    grandTotal,
    cartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const base = '/webapp-demo/ecommerce/demo-04';

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-[#FFEFE4]/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#EB1551]" />
              <h3 className="font-bubblegum text-2xl text-[#0F172A] leading-none">
                Your Learning Cart
              </h3>
              <span className="bg-[#1CBBB4] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-[#FFEFE4]/80 border-b border-[#F7941E]/20 text-xs">
            <div className="flex items-center justify-between font-bold text-[#0A6375] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#EB1551]" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-[#EB1551]">${remainingForFreeShipping.toFixed(2)}</strong> for FREE Shipping!
                  </span>
                ) : (
                  <span className="text-[#008000] flex items-center gap-1">
                    🎉 You unlocked FREE Nationwide Shipping!
                  </span>
                )}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F7941E] to-[#1CBBB4] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFEFE4] flex items-center justify-center text-4xl">
                  🎒
                </div>
                <h4 className="font-bubblegum text-2xl text-[#0F172A]">Your Cart is Empty</h4>
                <p className="text-sm text-[#6B6B84] max-w-xs mx-auto">
                  Explore our Montessori abacus boards, STEM robotics, and wooden puzzle toys!
                </p>
                <Link
                  href={`${base}/collection`}
                  onClick={closeCart}
                  className="inline-flex ws-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider"
                >
                  Explore Educational Toys
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:border-[#1CBBB4]/40 transition-colors"
                  >
                    <div className="relative w-20 h-20 rounded-xl bg-[#FFEFE4]/40 overflow-hidden shrink-0 border border-slate-100">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] line-clamp-1 leading-snug">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-[#6B6B84]">{item.variantName}</span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-[#EB1551] p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 text-slate-600 hover:bg-[#EB1551] hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#0F172A]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-slate-600 hover:bg-[#1CBBB4] hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-extrabold text-sm text-[#0F172A]">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white space-y-3.5">
              {/* Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#008000]/10 border border-[#008000]/20 text-xs text-[#008000] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercent}% OFF)</span>
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#EB1551] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (couponInput) {
                        applyCoupon(couponInput);
                        setCouponInput('');
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Coupon (e.g. SPROUT20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs uppercase font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1CBBB4]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0A6375] hover:bg-[#1CBBB4] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Totals Summary */}
              <div className="space-y-1.5 text-xs text-[#6B6B84] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#0F172A]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#EB1551]">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-[#0F172A]">
                    {shipping === 0 ? <span className="text-[#008000]">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#0F172A] pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-[#EB1551]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href={`${base}/checkout`}
                  onClick={closeCart}
                  className="w-full ws-btn-primary py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-slate-400 hover:text-[#EB1551] transition-colors"
                  >
                    Clear Cart
                  </button>
                  <Link
                    href={`${base}/cart`}
                    onClick={closeCart}
                    className="text-[11px] text-[#0A6375] hover:underline font-bold"
                  >
                    View Full Cart Page &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
