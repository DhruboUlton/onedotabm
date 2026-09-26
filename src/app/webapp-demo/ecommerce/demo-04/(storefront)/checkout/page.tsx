'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { StoreHeader } from '../../_components/StoreHeader';
import { StoreFooter } from '../../_components/StoreFooter';
import { BreadcrumbBanner } from '../../_components/BreadcrumbBanner';
import { Order } from '../../_types';

export default function CheckoutPage() {
  const { cart, subtotal, discount, shipping, grandTotal, appliedCoupon, placeOrder } = useStore();
  const base = '/webapp-demo/ecommerce/demo-04';

  // Customer Form State
  const [name, setName] = useState('Sarah Montgomery');
  const [email, setEmail] = useState('sarah.m@example.com');
  const [phone, setPhone] = useState('+1 (512) 839-4401');
  const [address, setAddress] = useState('1428 Oak Crest Lane');
  const [city, setCity] = useState('Austin');
  const [postalCode, setPostalCode] = useState('78704');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Apple Pay)');
  const [notes, setNotes] = useState('Please leave on front porch near play area.');

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address || !phone) return;

    setIsProcessing(true);
    setTimeout(() => {
      const order = placeOrder({
        customerName: name,
        customerEmail: email,
        phone,
        address,
        city,
        postalCode,
        paymentMethod,
        notes,
      });
      setIsProcessing(false);
      if (order) {
        setConfirmedOrder(order);
      }
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <StoreHeader />

      <BreadcrumbBanner
        title={confirmedOrder ? 'Order Confirmed!' : 'Secure Checkout'}
        breadcrumbs={[{ label: 'Checkout' }]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 w-full flex-1">
        {confirmedOrder ? (
          /* ============================================================== */
          /* SUCCESS ORDER STATE                                            */
          /* ============================================================== */
          <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#1CBBB4]/20 text-[#1CBBB4] flex items-center justify-center text-5xl animate-bounce">
              🎉
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#0A6375] bg-[#FFEFE4] px-3 py-1 rounded-full">
              Payment & Order Successful
            </span>
            <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A]">
              Thank You, {confirmedOrder.customerName}!
            </h2>
            <p className="text-sm text-[#6B6B84] font-nunito max-w-lg mx-auto">
              Your order <strong className="text-[#EB1551] font-mono">{confirmedOrder.orderNumber}</strong> has been registered into our merchant dispatch queue. A confirmation receipt has been sent to{' '}
              <strong>{confirmedOrder.customerEmail}</strong>.
            </p>

            <div className="p-6 bg-[#FFEFE4]/60 rounded-3xl border border-[#F7941E]/20 text-left space-y-3 font-nunito text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#6B6B84]">Order Number:</span>
                <span className="font-extrabold text-[#0F172A]">{confirmedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#6B6B84]">Shipping Destination:</span>
                <span className="font-bold text-[#0F172A]">
                  {confirmedOrder.address}, {confirmedOrder.city} {confirmedOrder.postalCode}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[#6B6B84]">Total Charged:</span>
                <span className="font-extrabold text-sm text-[#EB1551]">
                  ${confirmedOrder.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B84]">Estimated Arrival:</span>
                <span className="font-bold text-[#008000]">2–4 Business Days</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href={`${base}/admin/orders`}
                className="px-6 py-3.5 rounded-full bg-[#0A6375] hover:bg-[#1CBBB4] text-white text-xs uppercase tracking-wider font-extrabold shadow-md transition-colors"
              >
                Inspect in Admin Panel &rarr;
              </Link>
              <Link
                href={`${base}`}
                className="px-6 py-3.5 rounded-full border-2 border-slate-200 hover:bg-slate-50 text-[#0F172A] text-xs uppercase tracking-wider font-bold transition-colors"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <h2 className="font-bubblegum text-3xl text-[#0F172A]">Your Cart is Empty</h2>
            <p className="text-sm text-[#6B6B84]">Please add items to cart before proceeding to checkout.</p>
            <Link href={`${base}/collection`} className="ws-btn-primary px-8 py-3 text-xs uppercase font-bold inline-block">
              Shop Learning Toys
            </Link>
          </div>
        ) : (
          /* ============================================================== */
          /* ACTIVE CHECKOUT FORM                                           */
          /* ============================================================== */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 7 Cols: Customer Information */}
            <div className="lg:col-span-7 space-y-8 font-nunito">
              {/* Shipping Address */}
              <div className="space-y-4">
                <h3 className="font-bubblegum text-2xl text-[#0A6375] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#EB1551]" />
                  <span>1. Delivery Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Delivery Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Leave by front door, school office hours"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bubblegum text-2xl text-[#0A6375] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#EB1551]" />
                  <span>2. Payment Option</span>
                </h3>

                <div className="space-y-2.5">
                  {[
                    { id: 'Credit Card (Apple Pay)', label: 'Credit Card / Apple Pay (Demo instant capture)' },
                    { id: 'Cash on Delivery', label: 'Cash on Delivery (Pay upon physical inspection)' },
                    { id: 'School Invoice / Purchase Order', label: 'Daycare & School Purchase Order' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-[#0A6375] bg-[#FFEFE4]/40 font-bold text-[#0F172A]'
                          : 'border-slate-200 text-[#6B6B84] hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="text-[#EB1551] focus:ring-[#EB1551]"
                      />
                      <span className="text-xs sm:text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Order Summary Sidebar */}
            <div className="lg:col-span-5 bg-[#FFEFE4]/60 p-6 sm:p-8 rounded-3xl border border-[#F7941E]/20 space-y-6 sticky top-24">
              <h3 className="font-bubblegum text-2xl text-[#0A6375]">Order Items ({cart.length})</h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <h5 className="font-bold text-[#0F172A] line-clamp-1">{item.title}</h5>
                      <span className="text-[#6B6B84]">
                        {item.variantName} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-extrabold text-xs text-[#0F172A]">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-[#6B6B84] pt-4 border-t border-[#F7941E]/20">
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
                <div className="flex justify-between text-xl font-extrabold text-[#0F172A] pt-3 border-t border-[#F7941E]/20">
                  <span>Total</span>
                  <span className="text-[#EB1551]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full ws-btn-primary py-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Confirming Order...' : `Place Demo Order • $${grandTotal.toFixed(2)}`}
                </span>
              </button>

              <div className="text-[11px] text-center text-[#6B6B84] flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#1CBBB4]" />
                <span>Encrypted Demo Order • No real bank charge</span>
              </div>
            </div>
          </form>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
