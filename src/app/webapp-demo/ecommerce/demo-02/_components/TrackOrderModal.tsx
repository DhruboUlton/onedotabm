'use client';

import React, { useState } from 'react';
import { useStore } from '../_context/StoreContext';
import { Order } from '../_types';
import { Search, X, Package, Clock, CheckCircle2, AlertCircle, Phone, MapPin, Truck } from 'lucide-react';

export function TrackOrderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) return;

    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === clean ||
        o.phone.includes(query.trim()) ||
        o.email.toLowerCase() === query.trim().toLowerCase()
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500 text-white';
      case 'Shipped':
        return 'bg-blue-500 text-white';
      case 'Packed':
        return 'bg-amber-500 text-white';
      case 'Confirmed':
        return 'bg-indigo-500 text-white';
      case 'Cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-zinc-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900">Track Your Glass Art Order</h3>
              <p className="text-xs text-zinc-500">Enter Order ID (e.g. AG-91823) or Mobile Phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="mt-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. AG-91823 or 01712449911"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-hidden focus:border-black focus:bg-white text-zinc-900"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
            >
              Track
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="mt-6 max-h-[380px] overflow-y-auto pr-1">
          {searchedOrder ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900">{searchedOrder.id}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusColor(
                        searchedOrder.status
                      )}`}
                    >
                      {searchedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Placed on {searchedOrder.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-zinc-900">৳{searchedOrder.total.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">{searchedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-zinc-100 pt-3">
                <p className="text-xs font-semibold uppercase text-zinc-400 mb-2">Package Contents</p>
                <div className="space-y-2">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-zinc-700">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900 truncate">{item.name}</p>
                        <p className="text-zinc-500 text-[11px]">
                          {item.selectedSize || 'Standard'} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-zinc-800">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-zinc-100 pt-3">
                <p className="text-xs font-semibold uppercase text-zinc-400 mb-3">Live Delivery Status</p>
                <div className="space-y-3 pl-2 border-l-2 border-zinc-200 ml-2">
                  {searchedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-4 text-xs">
                      <div className="absolute -left-[11px] top-0.5 w-3 h-3 rounded-full bg-black ring-4 ring-white" />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-900">{step.status}</span>
                        <span className="text-[11px] text-zinc-400">{step.timestamp}</span>
                      </div>
                      <p className="text-zinc-600 text-[11px] mt-0.5">{step.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-10 bg-zinc-50 rounded-xl border border-zinc-200/80">
              <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-800">No matching order found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                Please double check the Order ID format (e.g. AG-91823) or the phone number used at checkout.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400">
              <Package className="w-10 h-10 mx-auto mb-2 text-zinc-300 stroke-1" />
              <p className="text-xs text-zinc-500">Sample tracking ID: <strong className="text-zinc-800">AG-91823</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
