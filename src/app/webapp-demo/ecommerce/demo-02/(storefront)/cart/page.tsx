'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryArea,
    setDeliveryArea,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  const freeShippingThreshold = settings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) setCouponInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review your selected glass art pieces and calculate shipping.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-zinc-200">
          <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto mb-4 stroke-1" />
          <h3 className="text-lg font-bold text-zinc-900">Your shopping cart is empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            You haven&apos;t added any glass wall art posters yet. Check out our motorsport, anime, and motivational collections.
          </p>
          <Link
            href={`${baseHref}/products`}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Meter */}
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-black" />
                  {remainingForFreeShipping > 0 ? (
                    <>Add <strong className="text-black">৳{remainingForFreeShipping.toLocaleString()}</strong> more to unlock Free Nationwide Delivery!</>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Congratulations! You unlocked Free Nationwide Delivery!
                    </span>
                  )}
                </span>
                <span className="text-xs font-bold text-zinc-600">{freeShippingPercent}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    freeShippingPercent >= 100 ? 'bg-emerald-500' : 'bg-black'
                  }`}
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* Items Table Card */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden divide-y divide-zinc-100 shadow-xs">
              {cart.map((item) => {
                const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize?.id}-${item.selectedDesign?.id}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.selectedDesign?.image || item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div>
                        <Link
                          href={`${baseHref}/products/${item.product.slug}`}
                          className="font-bold text-sm text-zinc-900 hover:text-black line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-zinc-500 mt-0.5">{item.product.categoryName}</p>

                        <div className="flex flex-wrap gap-1.5 mt-1.5 text-[11px]">
                          {item.selectedSize && (
                            <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md font-medium">
                              {item.selectedSize.label}
                            </span>
                          )}
                          {item.selectedDesign && (
                            <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md font-medium">
                              {item.selectedDesign.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stepper & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                      <div className="flex items-center border border-zinc-300 rounded-xl overflow-hidden bg-zinc-50">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedSize?.id,
                              item.selectedDesign?.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedSize?.id,
                              item.selectedDesign?.id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="font-extrabold text-sm text-zinc-900 block">
                          ৳{(itemPrice * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-[11px] text-zinc-400">৳{itemPrice.toLocaleString()} each</span>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedSize?.id, item.selectedDesign?.id)
                        }
                        className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href={`${baseHref}/products`}
                className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-black"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-zinc-900">Order Summary</h3>

            {/* Region Switcher */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-zinc-700 block">Select Delivery Area:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeliveryArea('inside')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-medium ${
                    deliveryArea === 'inside'
                      ? 'bg-black text-white border-black shadow-xs font-bold'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  Inside Dhaka (৳70)
                </button>
                <button
                  onClick={() => setDeliveryArea('outside')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-medium ${
                    deliveryArea === 'outside'
                      ? 'bg-black text-white border-black shadow-xs font-bold'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  Outside Dhaka (৳130)
                </button>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="space-y-2">
              <label className="font-bold text-xs text-zinc-700 block">Coupon Voucher:</label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      <strong className="font-mono">{appliedCoupon.code}</strong> (-৳{discountAmount.toLocaleString()})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. AURA10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs uppercase text-zinc-900 focus:outline-hidden focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-medium text-zinc-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-zinc-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `৳${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-3 border-t border-zinc-200">
                <span>Estimated Total</span>
                <span>৳{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Proceed to checkout */}
            <div className="pt-2">
              <Link
                href={`${baseHref}/checkout`}
                className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Transit Damage Protection
              </div>
              <p>Reinforced foam & wooden crate frame protection included with every courier shipment.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
