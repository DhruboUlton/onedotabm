'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Phone,
  LayoutDashboard,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Order } from '../../_types';

const baseHref = '/webapp-demo/ecommerce/demo-01';

export default function CheckoutPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartTotal,
    discountAmount,
    shippingFee,
    deliveryArea,
    setDeliveryArea,
    placeOrder,
  } = useStore();

  // Form State
  const [customerName, setCustomerName] = useState('Dhrubo Biswas');
  const [phone, setPhone] = useState('01711234567');
  const [email, setEmail] = useState('customer@example.com');
  const [address, setAddress] = useState('House 24, Road 11, Banani, Block D');
  const [notes, setNotes] = useState('Please call before delivery.');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Card'>('Cash on Delivery');
  const [bkashNumber, setBkashNumber] = useState('01711234567');
  const [bkashTrx, setBkashTrx] = useState('9J4K2L8X');

  // Confirmation state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) return;

    const order = placeOrder({
      customerName,
      phone,
      email,
      address,
      city: deliveryArea === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
      paymentMethod,
      notes,
    });

    setPlacedOrder(order);
  };

  // If order was placed, display rich confirmation screen
  if (placedOrder) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 pb-16">
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 sm:p-10 shadow-lg text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Order Placed Successfully!
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1F2923]">
              ধন্যবাদ, আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              We have received your order and our dispatch team is preparing your farm-fresh package.
            </p>
          </div>

          {/* Order Details Receipt */}
          <div className="rounded-2xl border border-[#ECE6DC] bg-[#FAF8F5] p-5 text-left text-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-[#ECE6DC] pb-3 gap-2">
              <div>
                <span className="text-zinc-400">Order ID:</span>
                <p className="font-mono text-base font-bold text-[#1F2923]">{placedOrder.id}</p>
              </div>
              <div>
                <span className="text-zinc-400">Payment Method:</span>
                <p className="font-semibold text-zinc-800">{placedOrder.paymentMethod}</p>
              </div>
              <div>
                <span className="text-zinc-400">Total Amount:</span>
                <p className="text-base font-bold text-[#E87121]">৳{placedOrder.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-600">
              <div>
                <span className="font-semibold text-zinc-800">Customer Details:</span>
                <p>{placedOrder.customerName}</p>
                <p>{placedOrder.phone}</p>
                <p>{placedOrder.email}</p>
              </div>
              <div>
                <span className="font-semibold text-zinc-800">Delivery Address:</span>
                <p>{placedOrder.address}</p>
                <p>{placedOrder.city}</p>
              </div>
            </div>

            {/* Ordered items */}
            <div className="border-t border-[#ECE6DC] pt-3">
              <span className="font-semibold text-zinc-800 block mb-2">Items in Order:</span>
              <div className="divide-y divide-[#F0ECE4]">
                {placedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover bg-white border border-[#ECE6DC]"
                      />
                      <div>
                        <p className="font-medium text-zinc-900">{item.name}</p>
                        <p className="text-[11px] text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-800">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`${baseHref}/admin/orders`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#072D24] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c4437] transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>View in Admin Orders</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </Link>

            <Link
              href={`${baseHref}`}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#072D24] px-6 py-3 text-xs font-bold text-[#072D24] hover:bg-[#FAF8F5] transition-all"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, redirect or prompt to shop
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#E87121]">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1F2923]">No items in cart for checkout</h2>
        <p className="text-xs text-zinc-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href={`${baseHref}/products`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#072D24] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c4437]"
        >
          <span>Browse Catalogue</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 pb-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href={baseHref} className="hover:text-[#072D24]">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link href={`${baseHref}/cart`} className="hover:text-[#072D24]">
          Cart
        </Link>
        <span>&rsaquo;</span>
        <span className="font-semibold text-zinc-900">Checkout</span>
      </nav>

      <div className="border-b border-[#ECE6DC] pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2923] tracking-tight">
          Express Checkout
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Complete your delivery address and payment</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer Information & Delivery (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Information Card */}
          <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1F2923] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#072D24] text-[11px] font-bold text-white">
                1
              </span>
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanzirul Islam"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01711234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1F2923] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#072D24] text-[11px] font-bold text-white">
                2
              </span>
              <span>Delivery Address</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  City / Delivery Area <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('inside')}
                    className={`rounded-xl p-3 border text-left transition-all ${
                      deliveryArea === 'inside'
                        ? 'border-[#072D24] bg-emerald-50/50 text-[#072D24] font-bold ring-1 ring-[#072D24]'
                        : 'border-[#ECE6DC] bg-[#FAF8F5] text-zinc-600'
                    }`}
                  >
                    <span className="block font-bold">Inside Dhaka</span>
                    <span className="block text-[11px] text-zinc-500">Regular fee: ৳60</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside')}
                    className={`rounded-xl p-3 border text-left transition-all ${
                      deliveryArea === 'outside'
                        ? 'border-[#072D24] bg-emerald-50/50 text-[#072D24] font-bold ring-1 ring-[#072D24]'
                        : 'border-[#ECE6DC] bg-[#FAF8F5] text-zinc-600'
                    }`}
                  >
                    <span className="block font-bold">Outside Dhaka (All BD)</span>
                    <span className="block text-[11px] text-zinc-500">Regular fee: ৳120</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Full Street Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House number, road, area, landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please deliver after 4pm"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1F2923] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#072D24] text-[11px] font-bold text-white">
                3
              </span>
              <span>Select Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#072D24] bg-emerald-50/40 ring-1 ring-[#072D24]'
                    : 'border-[#ECE6DC] bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-1 h-4 w-4 accent-[#072D24]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F2923]">
                      Cash on Delivery (ক্যাশ অন ডেলিভারি)
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Most Popular
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Pay in cash when our delivery rider arrives with your organic products.
                  </p>
                </div>
              </label>

              {/* Option 2: bKash */}
              <label
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === 'bKash'
                    ? 'border-pink-600 bg-pink-50/30 ring-1 ring-pink-600'
                    : 'border-[#ECE6DC] bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bKash'}
                  onChange={() => setPaymentMethod('bKash')}
                  className="mt-1 h-4 w-4 accent-pink-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F2923]">
                      bKash Mobile Banking (বিকাশ)
                    </span>
                    <span className="font-bold text-pink-600 text-xs">bKash</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Send money to Merchant Account <strong className="text-pink-600">01711234567</strong>
                  </p>

                  {paymentMethod === 'bKash' && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-pink-100 pt-3">
                      <div>
                        <label className="block text-[11px] text-zinc-600 mb-1">bKash Sender Number</label>
                        <input
                          type="text"
                          value={bkashNumber}
                          onChange={(e) => setBkashNumber(e.target.value)}
                          className="w-full rounded-lg border border-pink-200 bg-white p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-600 mb-1">Transaction ID (TrxID)</label>
                        <input
                          type="text"
                          value={bkashTrx}
                          onChange={(e) => setBkashTrx(e.target.value)}
                          className="w-full rounded-lg border border-pink-200 bg-white p-2 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: Card */}
              <label
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600'
                    : 'border-[#ECE6DC] bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F2923]">
                      Debit or Credit Card (Visa / Mastercard)
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Pay securely using any Visa, MasterCard, or Amex card.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-[#1F2923] border-b border-[#F0ECE4] pb-3">
              Order Review ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h2>

            {/* List of items */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#F0ECE4] pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg'}
                      alt={item.product.name}
                      className="h-11 w-11 rounded-xl object-cover bg-[#FAF8F5] border border-[#ECE6DC]"
                    />
                    <div>
                      <p className="font-semibold text-zinc-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-800">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="border-t border-[#F0ECE4] pt-4 space-y-2 text-xs text-zinc-600">
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
                <span>Delivery Charge</span>
                <span className="font-semibold text-zinc-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">Free</span>
                  ) : (
                    `৳${shippingFee}`
                  )}
                </span>
              </div>
              <div className="border-t border-[#F0ECE4] pt-3 flex justify-between text-base font-bold text-[#1F2923]">
                <span>Total Amount</span>
                <span className="text-xl text-[#E87121]">৳{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E87121] py-4 text-sm font-bold text-white shadow-lg hover:bg-[#D46013] transition-all active:scale-[0.98]"
            >
              <span>Place Order (৳{cartTotal.toLocaleString()})</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 text-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>By placing your order, you agree to our Terms and 100% Purity Guarantee.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
