'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Order, OrderStatus } from '../../_types';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const statusSteps: { key: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Hardware verified & allocated', icon: CheckCircle2 },
  { key: 'Processing', label: 'Lab Assembly', desc: 'Quality inspection & boxing', icon: Clock },
  { key: 'Dispatched', label: 'In Transit', desc: 'Handed to priority courier', icon: Truck },
  { key: 'Delivered', label: 'Delivered', desc: 'Delivered to recipient address', icon: MapPin },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const { orders, getOrderByIdOrTracking } = useStore();

  const [searchCode, setSearchCode] = useState(initialId);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialId) {
      const found = getOrderByIdOrTracking(initialId);
      if (found) {
        setMatchedOrder(found);
      }
      setHasSearched(true);
    } else if (orders.length > 0) {
      // Default to most recent order for demonstration
      setMatchedOrder(orders[0]);
      setSearchCode(orders[0].trackingNumber);
      setHasSearched(true);
    }
  }, [initialId, orders, getOrderByIdOrTracking]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const found = getOrderByIdOrTracking(searchCode);
    setMatchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepState = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = statusSteps.findIndex((s) => s.key === currentStatus);
    const stepIndex = statusSteps.findIndex((s) => s.key === stepKey);

    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          Real-Time Logistics
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          Track Your Hardware Shipment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Enter your Kinetic Gear Order Reference or Courier Tracking Number to view current fulfillment status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Package className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. KG-TRK-840291 or KG-2026-4821"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-semibold outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-colors shrink-0"
          >
            Track
          </button>
        </form>

        {/* Quick Demo Pill Links */}
        <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-400 flex-wrap">
          <span>Sample numbers:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setSearchCode(o.trackingNumber);
                setMatchedOrder(o);
                setHasSearched(true);
              }}
              className="underline hover:text-blue-600 font-mono text-[10px]"
            >
              {o.trackingNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Matched Order Result */}
      {matchedOrder ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-blue-600 dark:text-blue-400">
                  Tracking Code:
                </span>
                <span className="font-mono text-sm font-black text-slate-900 dark:text-slate-100">
                  {matchedOrder.trackingNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Order #{matchedOrder.orderNumber} • Placed on {new Date(matchedOrder.date).toLocaleDateString()}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Delivery</span>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 sm:justify-end">
                <Calendar className="w-4 h-4" />
                <span>{matchedOrder.estimatedDelivery}</span>
              </div>
            </div>
          </div>

          {/* 4-Step Interactive Progress Stepper */}
          <div className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative">
              {statusSteps.map((step, idx) => {
                const state = getStepState(step.key, matchedOrder.status);
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                          : state === 'current'
                          ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-md shadow-blue-500/30 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{step.label}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Destination Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">Delivery Address:</span>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                <div>{matchedOrder.customerName}</div>
                <div>{matchedOrder.address}</div>
                <div>
                  {matchedOrder.city}, {matchedOrder.state} {matchedOrder.postalCode}
                </div>
                <div>{matchedOrder.country}</div>
              </div>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
              <span className="font-bold text-slate-800 dark:text-slate-200">Logistics Carrier:</span>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                <div>Kinetic Express Logistics Air (Priority)</div>
                <div>Status: <strong className="text-blue-600 dark:text-blue-400">{matchedOrder.status}</strong></div>
                <div>Contact: {matchedOrder.customerEmail}</div>
              </div>
            </div>
          </div>

          {/* Items In Order */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Package Contents</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900">
              {matchedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 shrink-0 overflow-hidden">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-0.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                      <div className="text-[11px] text-slate-400">
                        {item.variantName} • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold">No Order Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We could not find any active shipment matching &quot;{searchCode}&quot;. Please verify the order number or check your email confirmation.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}

