'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Order, OrderStatus } from '../../_types';
import {
  Search,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Eye,
  Filter,
  ArrowRight,
  User,
  MapPin,
  ExternalLink,
  ChevronDown,
  X,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: any; nextStatus?: OrderStatus; nextLabel?: string }
> = {
  Confirmed: {
    label: 'Confirmed',
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    text: 'text-blue-700 dark:text-blue-400',
    icon: CheckCircle2,
    nextStatus: 'Processing',
    nextLabel: 'Start Packing',
  },
  Processing: {
    label: 'Processing',
    bg: 'bg-indigo-100 dark:bg-indigo-950/60',
    text: 'text-indigo-700 dark:text-indigo-400',
    icon: ShoppingCart,
    nextStatus: 'Dispatched',
    nextLabel: 'Hand to Courier',
  },
  Dispatched: {
    label: 'In Transit',
    bg: 'bg-purple-100 dark:bg-purple-950/60',
    text: 'text-purple-700 dark:text-purple-400',
    icon: Truck,
    nextStatus: 'Delivered',
    nextLabel: 'Mark Delivered',
  },
  Delivered: {
    label: 'Delivered',
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: PackageCheck,
  },
  Cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-100 dark:bg-rose-950/60',
    text: 'text-rose-700 dark:text-rose-400',
    icon: XCircle,
  },
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleAdvanceStatus = (order: Order) => {
    const config = STATUS_CONFIG[order.status];
    if (config?.nextStatus) {
      updateOrderStatus(order.id, config.nextStatus);
      showToast('Order Status Updated', `Order ${order.orderNumber} is now ${config.nextStatus}`, 'success');
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder({ ...selectedOrder, status: config.nextStatus });
      }
    }
  };

  const handleCancelOrder = (orderId: string, orderNumber: string) => {
    if (confirm(`Are you sure you want to cancel Order ${orderNumber}?`)) {
      updateOrderStatus(orderId, 'Cancelled');
      showToast('Order Cancelled', `Order ${orderNumber} marked as Cancelled`, 'info');
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Orders Pipeline
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track fulfillment lifecycle, courier dispatch handoffs, and customer invoice records.
          </p>
        </div>

        {/* Quick link to live customer tracker */}
        <Link
          href="/webapp-demo/ecommerce/demo-03/track-order"
          target="_blank"
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition-colors self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Customer Tracking Portal</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, tracking number, customer name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {['all', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Order & Tracking</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Items</th>
                <th className="py-3.5 px-3">Total</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const conf = STATUS_CONFIG[o.status] || STATUS_CONFIG.Confirmed;
                  const Icon = conf.icon;

                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Order ID & Tracking */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-left"
                          >
                            {o.orderNumber}
                          </button>
                          <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {o.trackingNumber}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {o.date}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {o.customerName}
                          </span>
                          <span className="text-[10px] text-slate-400">{o.customerEmail}</span>
                        </div>
                      </td>

                      {/* Items Preview */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center -space-x-2">
                          {o.items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="relative w-8 h-8 rounded-lg overflow-hidden border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shadow-xs"
                              title={`${item.title} (x${item.quantity})`}
                            >
                              <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          ))}
                          {o.items.length > 3 && (
                            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                              +{o.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-slate-100">
                            ${o.total.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {o.shippingMethod}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${conf.bg} ${conf.text}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{conf.label}</span>
                        </span>
                      </td>

                      {/* Workflow Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {conf.nextStatus && (
                            <button
                              onClick={() => handleAdvanceStatus(o)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors"
                              title={conf.nextLabel}
                            >
                              <span>{conf.nextLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      (STATUS_CONFIG[selectedOrder.status] || STATUS_CONFIG.Confirmed).bg
                    } ${(STATUS_CONFIG[selectedOrder.status] || STATUS_CONFIG.Confirmed).text}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Tracking Code: {selectedOrder.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 mb-1">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>Customer Details</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-slate-400">{selectedOrder.customerEmail}</p>
                  {selectedOrder.phone && (
                    <p className="text-slate-400">{selectedOrder.phone}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 mb-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Shipping Destination</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {selectedOrder.address}
                  </p>
                  <p className="text-slate-400">
                    {selectedOrder.city}, {selectedOrder.state} {selectedOrder.postalCode}
                  </p>
                  <p className="text-slate-400">{selectedOrder.country}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Purchased Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Finish: {item.variantName}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-black text-slate-900 dark:text-slate-100">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Calculation Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount Coupon</span>
                    <span>-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Shipping Fee</span>
                  <span>
                    {selectedOrder.shipping === 0
                      ? 'Free'
                      : `$${selectedOrder.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Sales Tax</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Grand Total</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' ? (
                <button
                  type="button"
                  onClick={() => handleCancelOrder(selectedOrder.id, selectedOrder.orderNumber)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                >
                  Cancel Order
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>

                {STATUS_CONFIG[selectedOrder.status]?.nextStatus && (
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(selectedOrder)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
                  >
                    <span>{STATUS_CONFIG[selectedOrder.status].nextLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
