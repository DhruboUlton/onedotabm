'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { StoreHeader } from '../../_components/StoreHeader';
import { StoreFooter } from '../../_components/StoreFooter';
import { BreadcrumbBanner } from '../../_components/BreadcrumbBanner';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shipping,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const base = '/webapp-demo/ecommerce/demo-04';

  const freeShippingThreshold = settings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="flex-1 flex flex-col bg-white">
      <StoreHeader />

      <BreadcrumbBanner
        title="Your Shopping Cart"
        breadcrumbs={[{ label: 'Cart' }]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 w-full flex-1">
        {cart.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#FFEFE4] flex items-center justify-center text-5xl">
              🎒
            </div>
            <h2 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">
              Your Cart is Empty
            </h2>
            <p className="text-sm text-[#6B6B84] font-nunito">
              Looks like you haven&apos;t added any educational Montessori toys or STEM activity kits yet.
            </p>
            <div className="pt-2">
              <Link
                href={`${base}/collection`}
                className="ws-btn-primary px-8 py-3.5 text-xs uppercase tracking-wider font-extrabold shadow-md inline-block"
              >
                Explore Catalogue
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 8 Cols: Line Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Shipping progress notification */}
              <div className="p-4 rounded-2xl bg-[#FFEFE4] border border-[#F7941E]/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0A6375]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#EB1551]" />
                    {remainingForFreeShipping > 0 ? (
                      <span>
                        Add <strong className="text-[#EB1551]">${remainingForFreeShipping.toFixed(2)}</strong> for FREE Shipping!
                      </span>
                    ) : (
                      <span className="text-[#008000]">🎉 Free Nationwide Shipping Unlocked!</span>
                    )}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F7941E] to-[#1CBBB4] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative w-24 h-24 rounded-2xl bg-[#FFEFE4] overflow-hidden shrink-0 border border-slate-100">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="font-bold text-base text-[#0F172A] line-clamp-1">{item.title}</h3>
                      <span className="text-xs text-[#6B6B84] block mt-0.5">{item.variantName}</span>
                      <span className="font-extrabold text-sm text-[#0A6375] block mt-1">
                        ${item.unitPrice.toFixed(2)} each
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 px-3 text-slate-600 hover:bg-[#EB1551] hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#0F172A]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 px-3 text-slate-600 hover:bg-[#1CBBB4] hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="font-extrabold text-base text-[#0F172A] min-w-[70px] text-right">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-[#EB1551] transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href={`${base}/collection`}
                  className="text-xs font-bold text-[#0A6375] hover:text-[#EB1551] flex items-center gap-1"
                >
                  &larr; Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-slate-400 hover:text-[#EB1551] transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Order Summary */}
            <div className="lg:col-span-4 bg-[#FFEFE4]/60 p-6 sm:p-8 rounded-3xl border border-[#F7941E]/20 space-y-6 sticky top-24">
              <h3 className="font-bubblegum text-2xl text-[#0A6375]">Order Summary</h3>

              {/* Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#008000]/10 border border-[#008000]/20 text-xs text-[#008000] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercent}% OFF)</span>
                    </span>
                    <button onClick={removeCoupon} className="text-[#EB1551] hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (couponCode) {
                        applyCoupon(couponCode);
                        setCouponCode('');
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs uppercase font-bold focus:outline-none focus:border-[#1CBBB4]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0A6375] hover:bg-[#1CBBB4] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-2 text-xs text-[#6B6B84] pt-2 border-t border-[#F7941E]/20">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#0F172A]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#EB1551]">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-[#0F172A]">
                    {shipping === 0 ? <span className="text-[#008000]">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-extrabold text-[#0F172A] pt-3 border-t border-[#F7941E]/20">
                  <span>Grand Total</span>
                  <span className="text-[#EB1551]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href={`${base}/checkout`}
                className="w-full ws-btn-primary py-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
