'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Order } from '../../_types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  Smartphone,
  Banknote,
} from 'lucide-react';

const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function CheckoutPage() {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    deliveryArea,
    setDeliveryArea,
    placeOrder,
  } = useStore();

  // Form Fields
  const [name, setName] = useState('Kamrul Hassan');
  const [phone, setPhone] = useState('01719283746');
  const [email, setEmail] = useState('kamrul.art@gmail.com');
  const [address, setAddress] = useState('House 34, Road 11, Block D, Banani');
  const [city, setCity] = useState('Dhaka');
  const [notes, setNotes] = useState('Please call before delivery. Fragile glass poster.');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Card'>('Cash on Delivery');

  // Confirmation state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setErrorMsg('Please fill in all required delivery fields.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const newOrder = placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        paymentMethod,
        notes: notes.trim(),
      });
      setPlacedOrder(newOrder);
      setIsSubmitting(false);
    }, 600);
  };

  // If order placed, show Confirmation Receipt Screen
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="bg-[#0A0B0E] p-8 text-center text-white relative">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-zinc-300 mt-2 max-w-md mx-auto">
              Your glass wall art order has been successfully recorded and synced with the merchant fulfillment system.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-1.5 rounded-full text-xs font-mono">
              <span className="text-zinc-400">Order ID:</span>
              <strong className="text-white font-bold">{placedOrder.id}</strong>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Customer & Delivery Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs">
              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px] block mb-1">
                  Delivery Details
                </span>
                <p className="font-extrabold text-zinc-900">{placedOrder.customerName}</p>
                <p className="text-zinc-600 mt-0.5">{placedOrder.phone}</p>
                <p className="text-zinc-600 mt-0.5">{placedOrder.address}, {placedOrder.city}</p>
              </div>

              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px] block mb-1">
                  Payment & Delivery Status
                </span>
                <p className="font-semibold text-zinc-900">
                  Method: <span className="font-bold">{placedOrder.paymentMethod}</span>
                </p>
                <p className="text-zinc-600 mt-0.5">
                  Payment Status:{' '}
                  <span className={placedOrder.paymentStatus === 'Paid' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {placedOrder.paymentStatus}
                  </span>
                </p>
                <p className="text-zinc-600 mt-0.5">Order Status: <strong className="text-black">{placedOrder.status}</strong></p>
              </div>
            </div>

            {/* Items Ordered */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-3">
                Items In This Shipment ({placedOrder.items.length})
              </h4>
              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden">
                {placedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{item.name}</p>
                        <p className="text-zinc-500 text-[11px]">
                          {item.selectedSize || 'Standard'} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-zinc-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">৳{placedOrder.subtotal.toLocaleString()}</span>
              </div>
              {placedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied</span>
                  <span>-৳{placedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-zinc-900">
                  {placedOrder.shippingFee === 0 ? 'FREE' : `৳${placedOrder.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total Amount Paid / Due</span>
                <span>৳{placedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`${baseHref}/admin/orders`}
                className="flex-1 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span>View in Admin Orders</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={baseHref}
                className="py-3 px-6 border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-bold rounded-xl text-center transition-colors"
              >
                Back to Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200">
        <Link
          href={`${baseHref}/cart`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-black mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Checkout & Shipping
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Enter your delivery destination and select payment method.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200">
          <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-bold text-zinc-800">Your cart is currently empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Please add your favorite glass wall art poster to the cart before checking out.
          </p>
          <Link
            href={`${baseHref}/products`}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* 1. Customer Contact & Address */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                <Truck className="w-4 h-4 text-black" />
                <h3 className="font-extrabold text-sm text-zinc-900">1. Delivery Destination</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712-345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. tanvir@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Full Street Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Flat 5B, House 24, Road 7, Block C, Banani"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    City / District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka or Chittagong"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Shipping Zone</label>
                  <select
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                  >
                    <option value="inside">Inside Dhaka (৳70 fee)</option>
                    <option value="outside">Outside Dhaka (৳130 fee)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Please call before arrival. Deliver after 4 PM."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                <CreditCard className="w-4 h-4 text-black" />
                <h3 className="font-extrabold text-sm text-zinc-900">2. Payment Method</h3>
              </div>

              <div className="space-y-2.5">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-zinc-50 border-black shadow-xs ring-1 ring-black'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-0.5 text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-zinc-900">Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Inspect your glass poster packaging upon delivery, then pay cash to the courier.
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label
                  onClick={() => setPaymentMethod('bKash')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'bKash'
                      ? 'bg-zinc-50 border-black shadow-xs ring-1 ring-black'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bKash'}
                    onChange={() => setPaymentMethod('bKash')}
                    className="mt-0.5 text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-pink-600" />
                      <span className="font-bold text-xs text-zinc-900">bKash Payment</span>
                      <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Simulated bKash payment gateway with automated verification.
                    </p>
                  </div>
                </label>

                {/* Card */}
                <label
                  onClick={() => setPaymentMethod('Card')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'bg-zinc-50 border-black shadow-xs ring-1 ring-black'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="mt-0.5 text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-zinc-900">Credit or Debit Card</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Visa, Mastercard, Amex supported with secure 256-bit SSL encryption.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Place Order Button */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-5 sticky top-28">
            <h3 className="font-extrabold text-base text-zinc-900">Order Summary</h3>

            {/* Cart Items Summary */}
            <div className="divide-y divide-zinc-100 max-h-64 overflow-y-auto pr-1">
              {cart.map((item, idx) => {
                const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
                return (
                  <div key={idx} className="py-2.5 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.selectedDesign?.image || item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-900 truncate max-w-[170px]">{item.product.name}</p>
                        <p className="text-[10px] text-zinc-500">
                          {item.selectedSize?.label || 'Standard'} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-zinc-900">
                      ৳{(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculation rows */}
            <div className="space-y-2 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-zinc-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-medium text-zinc-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `৳${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total Due</span>
                <span>৳{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-black hover:bg-zinc-800 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-xl shadow-black/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Demo Order...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Place Order (৳{cartTotal.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>

            {/* Security notice */}
            <div className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe Checkout • Free Replacement Transit Protection</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
