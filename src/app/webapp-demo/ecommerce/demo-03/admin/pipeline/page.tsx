'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Order, OrderStatus } from '../../_types';
import {
  GitBranch,
  Search,
  ArrowRight,
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Filter,
  DollarSign,
  User,
  Building,
} from 'lucide-react';

const pipelineStages: { status: OrderStatus; label: string; color: string; bg: string }[] = [
  { status: 'Confirmed', label: 'Confirmed', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60' },
  { status: 'Processing', label: 'Processing (Picking & Packing)', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60' },
  { status: 'Dispatched', label: 'Dispatched (In Transit)', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60' },
  { status: 'Delivered', label: 'Delivered', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60' },
  { status: 'Cancelled', label: 'Cancelled', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60' },
];

export default function OrderPipelinePage() {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'Confirmed':
        return 'Processing';
      case 'Processing':
        return 'Dispatched';
      case 'Dispatched':
        return 'Delivered';
      default:
        return null;
    }
  };

  const getPrevStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'Processing':
        return 'Confirmed';
      case 'Dispatched':
        return 'Processing';
      case 'Delivered':
        return 'Dispatched';
      default:
        return null;
    }
  };

  const handleAdvance = (orderId: string, current: OrderStatus) => {
    const next = getNextStatus(current);
    if (!next) return;
    updateOrderStatus(orderId, next);
    showToast('Pipeline Advanced', `Order ${orderId} moved to ${next}`, 'success');
  };

  const handleRegress = (orderId: string, current: OrderStatus) => {
    const prev = getPrevStatus(current);
    if (!prev) return;
    updateOrderStatus(orderId, prev);
    showToast('Pipeline Updated', `Order ${orderId} reverted to ${prev}`, 'info');
  };

  const handleCancel = (orderId: string) => {
    updateOrderStatus(orderId, 'Cancelled');
    showToast('Order Cancelled', `Order ${orderId} set to Cancelled`, 'warning');
  };

  const filteredOrders = orders.filter((o) => {
    const query = searchTerm.toLowerCase();
    return (
      o.id.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.trackingNumber.toLowerCase().includes(query) ||
      o.items.some((i) => i.title.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Orders Pipeline
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Fulfillment Kanban
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time stage-gate fulfillment from order placement through warehouse picking and courier dispatch.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders in pipeline..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Pipeline Columns Horizontal Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
        {pipelineStages.map((stage) => {
          const stageOrders = filteredOrders.filter((o) => o.status === stage.status);

          return (
            <div
              key={stage.status}
              className="flex flex-col rounded-3xl bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    stage.status === 'Confirmed' ? 'bg-indigo-500' :
                    stage.status === 'Processing' ? 'bg-amber-500' :
                    stage.status === 'Dispatched' ? 'bg-purple-500' :
                    stage.status === 'Delivered' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {stage.label}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-700">
                  {stageOrders.length}
                </span>
              </div>

              {/* Order Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {stageOrders.length === 0 ? (
                  <div className="h-32 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[11px] text-slate-400">
                    No orders
                  </div>
                ) : (
                  stageOrders.map((order) => {
                    const next = getNextStatus(order.status);
                    const prev = getPrevStatus(order.status);

                    return (
                      <div
                        key={order.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-black text-xs text-blue-600 dark:text-blue-400">
                              {order.id}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5 truncate max-w-[140px]">
                              {order.customerName}
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>

                        {/* Order Items Preview */}
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[10px] text-slate-600 dark:text-slate-400 space-y-1">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="truncate">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{item.quantity}x</span> {item.title}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-slate-400 italic">+{order.items.length - 2} more items</div>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Quick view"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1">
                            {prev && (
                              <button
                                onClick={() => handleRegress(order.id, order.status)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title={`Revert to ${prev}`}
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {next && (
                              <button
                                onClick={() => handleAdvance(order.id, order.status)}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                                title={`Advance to ${next}`}
                              >
                                <span>{next}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {order.status === 'Confirmed' && (
                              <button
                                onClick={() => handleCancel(order.id)}
                                className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                title="Cancel order"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  Order {selectedOrder.id}
                </h3>
                <span className="text-xs text-slate-400">Tracking: {selectedOrder.trackingNumber}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Customer</span>
                <div className="font-bold text-slate-900 dark:text-slate-100">{selectedOrder.customerName}</div>
                <div className="text-slate-500">{selectedOrder.customerEmail}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Shipping Dest</span>
                <div className="font-bold text-slate-900 dark:text-slate-100">{selectedOrder.city}, {selectedOrder.state}</div>
                <div className="text-slate-500">{selectedOrder.country}</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">Order Items</span>
              <div className="max-h-40 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{it.title}</div>
                      <div className="text-[11px] text-slate-400">{it.variantName} • Qty {it.quantity}</div>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      ${(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400">Total: </span>
                <span className="font-black text-sm text-slate-900 dark:text-slate-100">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
