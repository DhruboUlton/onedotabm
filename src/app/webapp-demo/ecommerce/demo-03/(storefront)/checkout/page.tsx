'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';
import { Order } from '../../_types';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Tag,
  Package,
} from 'lucide-react';

export default function CheckoutPage() {
  const {
    cart,
    subtotal,
    discount,
    shipping,
    tax,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    placeOrder,
  } = useStore();

  // Form State
  const [formData, setFormData] = useState({
    email: 'creator.alex@studio.demo',
    firstName: 'Alex',
    lastName: 'Chen',
    address: '500 Technology Square, Suite 400',
    city: 'Cambridge',
    state: 'MA',
    postalCode: '02139',
    country: 'United States',
    phone: '+1 (617) 555-0199',
    shippingMethod: 'Express Air (2-3 Business Days)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ error?: string; success?: string }>({});
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg({});
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponMsg({ error: res.message });
    } else {
      setCouponMsg({ success: res.message });
      setCouponCode('');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (cart.length === 0) return;

    const order = placeOrder({
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      shippingMethod: formData.shippingMethod,
    });

    setCompletedOrder(order);
  };

  // If order was successfully placed, render Order Confirmation View
  if (completedOrder) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-2">
              Payment Confirmed (Simulation)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Your order confirmation and live shipping updates have been dispatched to <strong>{completedOrder.customerEmail}</strong>.
            </p>
          </div>

          {/* Reference Numbers Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Order Reference</span>
              <div className="text-base font-black text-slate-900 dark:text-slate-100">{completedOrder.orderNumber}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Tracking Code</span>
              <div className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">{completedOrder.trackingNumber}</div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="text-left space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Items in this shipment:</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 bg-white dark:bg-slate-900">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 shrink-0 overflow-hidden">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-0.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.variantName} × {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={`/webapp-demo/ecommerce/demo-03/track-order?id=${completedOrder.trackingNumber}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Track Live Delivery Progress</span>
            </Link>
            <Link
              href="/webapp-demo/ecommerce/demo-03/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no completed order, show empty state
  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black">Your Cart Is Empty</h1>
        <p className="text-xs text-slate-500">
          Add hardware equipment or accessories to your cart before proceeding to checkout.
        </p>
        <Link
          href="/webapp-demo/ecommerce/demo-03/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
        >
          <span>Browse Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <span>Cart</span>
        <span>•</span>
        <span className="text-blue-600 dark:text-blue-400 font-bold">Express Guest Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Contact & Shipping Form (Col 1-7) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {/* 1. Contact Information */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>1. Contact Details</span>
              </h2>
              <span className="text-[11px] text-slate-400">Guest Checkout</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full py-2.5 px-3.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                2. Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full py-2.5 px-3.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 ${
                    errors.firstName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full py-2.5 px-3.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 ${
                    errors.lastName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full py-2.5 px-3.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 ${
                    errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  State / Region
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Delivery Method */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
              3. Delivery Method
            </h2>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 text-xs font-semibold cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="Express Air (2-3 Business Days)"
                    checked={formData.shippingMethod === 'Express Air (2-3 Business Days)'}
                    onChange={handleInputChange}
                    className="text-blue-600 w-4 h-4"
                  />
                  <div>
                    <div>Express Air Delivery (2-3 Business Days)</div>
                    <div className="text-[11px] text-slate-500 font-normal">Tracked priority logistics with signature confirmation</div>
                  </div>
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </label>
            </div>
          </div>

          {/* Simulated Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Place Order • ${grandTotal.toFixed(2)} USD</span>
          </button>
        </form>

        {/* Right: Sticky Order Summary (Col 8-12) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Order Summary</h2>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Line items preview */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 shrink-0 overflow-hidden border border-slate-200/60 dark:border-slate-700">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-0.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.variantName} × {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 shrink-0">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. NEXUS10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-semibold outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
              {couponMsg.error && <p className="text-[11px] text-rose-500 mt-1 pl-1">{couponMsg.error}</p>}
              {couponMsg.success && <p className="text-[11px] text-emerald-500 mt-1 pl-1">{couponMsg.success}</p>}
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Tag className="w-3 h-3 text-blue-500" />
                <span>Try simulated coupons: <strong>NEXUS10</strong> (10% off) or <strong>FREESHIP</strong></span>
              </div>
            </form>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-50 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Due</span>
                <span className="text-lg text-blue-600 dark:text-blue-400">${grandTotal.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-[11px] text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Simulated Demo Checkout. No actual credit card charge will occur.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
