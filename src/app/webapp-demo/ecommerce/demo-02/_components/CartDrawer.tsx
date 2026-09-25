'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../_context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function CartDrawer({ baseHref = '/webapp-demo/ecommerce/demo-02' }: { baseHref?: string }) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
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

  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#0A0B0E] text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Shopping Cart ({cartCount})</h3>
                <p className="text-[11px] text-zinc-400">AuraGlass Studio • Dhaka</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-zinc-50 p-3.5 border-b border-zinc-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-black" />
                {remainingForFreeShipping > 0 ? (
                  <>Add <strong className="text-black">৳{remainingForFreeShipping.toLocaleString()}</strong> more for Free Delivery!</>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    You unlocked Free Nationwide Delivery!
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-zinc-500">{freeShippingPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingPercent >= 100 ? 'bg-emerald-500' : 'bg-black'
                }`}
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-100 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-zinc-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-zinc-300 stroke-1" />
                <p className="text-sm font-semibold text-zinc-700">Your cart is empty</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  Explore our car, anime, motivational and sacred calligraphy glass art posters.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
                return (
                  <div key={`${item.product.id}-${item.selectedSize?.id}-${item.selectedDesign?.id}`} className="pt-3 first:pt-0 flex gap-3.5">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.selectedDesign?.image || item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`${baseHref}/products/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-bold text-xs text-zinc-900 hover:text-black line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize?.id, item.selectedDesign?.id)}
                          className="text-zinc-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Options Tag */}
                      <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-zinc-500">
                        {item.selectedSize && (
                          <span className="bg-zinc-100 px-2 py-0.5 rounded-md font-medium text-zinc-700">
                            {item.selectedSize.label}
                          </span>
                        )}
                        {item.selectedDesign && (
                          <span className="bg-zinc-100 px-2 py-0.5 rounded-md font-medium text-zinc-700">
                            {item.selectedDesign.label}
                          </span>
                        )}
                      </div>

                      {/* Price & Stepper */}
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-extrabold text-xs text-zinc-900">
                          ৳{(itemPrice * item.quantity).toLocaleString()}
                        </span>

                        <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedSize?.id,
                                item.selectedDesign?.id
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
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
                            className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200 space-y-3">
              {/* Delivery Area Switcher */}
              <div className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-zinc-200">
                <span className="font-semibold text-zinc-700">Delivery Region:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setDeliveryArea('inside')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      deliveryArea === 'inside'
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Dhaka (৳70)
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      deliveryArea === 'outside'
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Outside Dhaka (৳130)
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Coupon <strong className="font-mono">{appliedCoupon.code}</strong> applied (-৳{discountAmount.toLocaleString()})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. AURA10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs uppercase text-zinc-900 focus:outline-hidden focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Totals Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-zinc-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span>৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <div className="pt-2">
                <Link
                  href={`${baseHref}/checkout`}
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-black/10 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="mt-2 text-center text-[10px] text-zinc-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>100% Free Transit Damage Replacement Guaranteed</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
