'use client';

import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
import { useStore } from '../_context/StoreContext';
import { Order } from '../_types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrackOrderModal({ isOpen, onClose }: TrackOrderModalProps) {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toUpperCase();
    if (!q) return;

    const match = orders.find(
      (o) =>
        o.id.toUpperCase() === q ||
        o.id.replace('SH-', '') === q ||
        o.phone.includes(query.trim())
    );

    setFoundOrder(match || null);
    setSearched(true);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Packed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#ECE6DC]"
        role="dialog"
        aria-modal="true"
        aria-label="Track Your Order"
      >
        <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#072D24]/10 text-[#072D24]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2923]">Track Your Order</h3>
              <p className="text-xs text-zinc-500">Enter your Order ID or phone number</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close track order modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="e.g. SH-84921 or 01819348210"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#E87121] focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#072D24] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0c4437] transition-all"
          >
            Track
          </button>
        </form>

        {/* Quick hint buttons */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
          <span>Try demo IDs:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setQuery(o.id);
                setFoundOrder(o);
                setSearched(true);
              }}
              className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 hover:bg-[#E87121]/10 hover:text-[#E87121]"
            >
              {o.id}
            </button>
          ))}
        </div>

        {/* Results */}
        {searched && (
          <div className="mt-4">
            {foundOrder ? (
              <div className="rounded-xl border border-[#ECE6DC] bg-[#FAF8F5] p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-2.5">
                  <div>
                    <span className="font-bold text-[#1F2923] text-sm">{foundOrder.id}</span>
                    <p className="text-[11px] text-zinc-500">Placed on {foundOrder.date}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusColor(
                      foundOrder.status
                    )}`}
                  >
                    {foundOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-zinc-600">
                  <div>
                    <span className="text-[11px] text-zinc-400">Customer:</span>
                    <p className="font-semibold text-zinc-800">{foundOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-400">Total:</span>
                    <p className="font-bold text-[#E87121] text-sm">৳{foundOrder.total.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] text-zinc-400">Delivery Address:</span>
                    <p className="font-medium text-zinc-800">{foundOrder.address}, {foundOrder.city}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-[#E8E2D6] pt-2">
                  <p className="font-semibold text-zinc-700 mb-1.5">Ordered Items:</p>
                  <div className="space-y-1">
                    {foundOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-zinc-600">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-medium">৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t border-[#E8E2D6] pt-2.5">
                  <p className="font-semibold text-zinc-700 mb-2">Tracking History:</p>
                  <div className="space-y-2 relative pl-4 border-l-2 border-emerald-500">
                    {foundOrder.timeline.map((event, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-zinc-900">{event.status}</span>
                          <span className="text-[10px] text-zinc-400">{event.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-0.5">{event.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-center text-xs text-rose-800">
                <ShieldAlert className="mx-auto h-6 w-6 text-rose-600 mb-1" />
                <p className="font-semibold">No order found matching &quot;{query}&quot;.</p>
                <p className="text-[11px] text-rose-600 mt-0.5">
                  Please verify your Order ID (e.g. SH-84921) or phone number and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
