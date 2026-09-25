'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';

export function CartDrawer() {
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
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    deliveryArea,
    setDeliveryArea,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 2000;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  const baseHref = '/webapp-demo/ecommerce/demo-01';

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECE6DC] bg-[#FAF8F5] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E87121]/10 text-[#E87121]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2923]">Shopping Cart</h2>
              <p className="text-xs text-zinc-500">{cartCount} items in cart</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="border-b border-[#ECE6DC] bg-emerald-50/60 px-5 py-3">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-950 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-emerald-700" />
              <span>
                {neededForFreeShipping > 0 ? (
                  <>
                    Add <strong className="text-emerald-800">৳{neededForFreeShipping.toLocaleString()}</strong> more for{' '}
                    <strong className="text-emerald-800">FREE DELIVERY!</strong>
                  </>
                ) : (
                  <strong className="text-emerald-700">Congratulations! You unlocked FREE DELIVERY!</strong>
                )}
              </span>
            </div>
            <span className="font-bold text-emerald-800">{freeShippingPercent}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-200/70">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#F0ECE4]">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF8F5] text-zinc-300 mb-4">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <h3 className="text-base font-semibold text-[#1F2923]">Your cart is empty</h3>
              <p className="mt-1 max-w-xs text-xs text-zinc-500">
                Explore our pure ghee, Sundarban wild honey, cold-pressed oils and farm goods.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 rounded-full bg-[#072D24] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0c4437] transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-3.5 py-4 first:pt-0 last:pb-0">
                <img
                  src={item.product.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg'}
                  alt={item.product.name}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover bg-[#FAF8F5] border border-[#ECE6DC]"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-[#1F2923] line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.product.weight && (
                        <p className="text-xs text-zinc-400">{item.product.weight}</p>
                      )}
                      <p className="text-xs font-bold text-[#E87121] mt-0.5">
                        ৳{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center rounded-lg border border-[#DCD6CA] bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors rounded-r-lg disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#1F2923]">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area with Summary */}
        {cart.length > 0 && (
          <div className="border-t border-[#ECE6DC] bg-[#FAF8F5] p-5">
            {/* Delivery Area selector */}
            <div className="mb-3.5 flex items-center justify-between rounded-xl bg-white p-2.5 border border-[#ECE6DC] text-xs">
              <span className="font-medium text-zinc-700">Delivery:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setDeliveryArea('inside')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    deliveryArea === 'inside'
                      ? 'bg-[#072D24] text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Inside Dhaka (৳60)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryArea('outside')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    deliveryArea === 'outside'
                      ? 'bg-[#072D24] text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Outside Dhaka (৳120)
                </button>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="mb-3.5">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-৳
                      {discountAmount.toLocaleString()})
                    </span>
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
                    placeholder="Coupon code (e.g. SHUDDHA10)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError('');
                    }}
                    className="flex-1 rounded-lg border border-[#DCD6CA] bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#E87121] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#072D24] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0c4437] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="mt-1 text-[11px] text-rose-600">{couponError}</p>}
            </div>

            {/* Price lines */}
            <div className="space-y-1.5 text-xs text-zinc-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-zinc-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 uppercase font-bold">Free</span>
                  ) : (
                    `৳${shippingFee}`
                  )}
                </span>
              </div>
              <div className="border-t border-[#ECE6DC] pt-2 flex justify-between text-base font-bold text-[#1F2923]">
                <span>Total</span>
                <span className="text-[#E87121]">৳{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`${baseHref}/cart`}
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center rounded-xl border border-[#072D24] py-3 text-xs font-bold text-[#072D24] hover:bg-[#072D24] hover:text-white transition-all text-center"
              >
                View Cart
              </Link>
              <Link
                href={`${baseHref}/checkout`}
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E87121] py-3 text-xs font-bold text-white shadow-md hover:bg-[#D46013] transition-all text-center"
              >
                <span>Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
