'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';

const baseHref = '/webapp-demo/ecommerce/demo-01';

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartTotal,
    discountAmount,
    shippingFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    deliveryArea,
    setDeliveryArea,
    settings,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const freeShippingThreshold = settings.freeShippingThreshold || 2000;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponCode('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 pb-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href={baseHref} className="hover:text-[#072D24]">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="font-semibold text-zinc-900">Shopping Cart</span>
      </nav>

      <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2923] tracking-tight">
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Review your selected organic goods</p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:underline font-semibold"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-12 text-center max-w-md mx-auto my-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF8F5] text-zinc-300 mb-4">
            <ShoppingBag className="h-10 w-10 text-zinc-400" />
          </div>
          <h2 className="text-lg font-bold text-[#1F2923]">Your cart is currently empty</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Looks like you haven&apos;t added any items yet. Explore our fresh pantry collection!
          </p>
          <Link
            href={`${baseHref}/products`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#072D24] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c4437] transition-all"
          >
            <span>Start Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Table / List (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Alert Bar */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="flex items-center justify-between text-xs font-medium text-emerald-950 mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-700" />
                  <span>
                    {neededForFreeShipping > 0 ? (
                      <>
                        Add <strong>৳{neededForFreeShipping.toLocaleString()}</strong> more to get{' '}
                        <strong>FREE DELIVERY!</strong>
                      </>
                    ) : (
                      <strong className="text-emerald-700">
                        🎉 Great! You have unlocked FREE DELIVERY!
                      </strong>
                    )}
                  </span>
                </div>
                <span className="font-bold text-emerald-800">{freeShippingPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-200">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Table */}
            <div className="rounded-3xl border border-[#ECE6DC] bg-white overflow-hidden shadow-xs">
              <div className="divide-y divide-[#F0ECE4]">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg'}
                        alt={item.product.name}
                        className="h-20 w-20 rounded-2xl object-cover bg-[#FAF8F5] border border-[#ECE6DC] shrink-0"
                      />
                      <div>
                        <Link
                          href={`${baseHref}/products/${item.product.slug}`}
                          className="font-bold text-sm text-[#1F2923] hover:text-[#E87121] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        {item.product.bengaliName && (
                          <p className="text-xs text-zinc-500">{item.product.bengaliName}</p>
                        )}
                        <p className="text-xs font-bold text-[#E87121] mt-1">
                          ৳{item.product.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#F0ECE4]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-xl border border-[#DCD6CA] bg-[#FAF8F5]">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-zinc-600 hover:bg-zinc-200 transition-colors rounded-l-xl"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-bold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-2 text-zinc-600 hover:bg-zinc-200 transition-colors rounded-r-xl disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="w-24 text-right">
                        <span className="text-sm font-bold text-[#1F2923]">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to shop */}
            <Link
              href={`${baseHref}/products`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#072D24] hover:text-[#E87121] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Right Summary (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-3">
                Order Summary
              </h2>

              {/* Delivery Area selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-2">
                  Delivery Destination:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('inside')}
                    className={`rounded-xl p-2.5 font-medium border text-center transition-all ${
                      deliveryArea === 'inside'
                        ? 'bg-[#072D24] border-[#072D24] text-white font-bold'
                        : 'bg-[#FAF8F5] border-[#ECE6DC] text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    Inside Dhaka (৳60)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside')}
                    className={`rounded-xl p-2.5 font-medium border text-center transition-all ${
                      deliveryArea === 'outside'
                        ? 'bg-[#072D24] border-[#072D24] text-white font-bold'
                        : 'bg-[#FAF8F5] border-[#ECE6DC] text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    Outside Dhaka (৳120)
                  </button>
                </div>
              </div>

              {/* Coupon Form */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Promotional Coupon:
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs">
                    <div>
                      <span className="font-bold text-emerald-900">{appliedCoupon.code}</span>
                      <p className="text-[11px] text-emerald-700">
                        -৳{discountAmount.toLocaleString()} discount applied
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SHUDDHA10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] uppercase"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#072D24] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c4437]"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`mt-1.5 text-xs ${couponMsg.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-[#F0ECE4] pt-4 space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-zinc-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Savings:</span>
                    <span className="font-semibold">-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold text-zinc-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">Free Delivery</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="border-t border-[#F0ECE4] pt-3 flex justify-between text-base font-bold text-[#1F2923]">
                  <span>Total Payable:</span>
                  <span className="text-xl text-[#E87121]">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href={`${baseHref}/checkout`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E87121] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#D46013] transition-all text-center active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Pure Guarantee • Cash On Delivery Available</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
