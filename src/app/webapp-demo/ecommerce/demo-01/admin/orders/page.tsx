'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ShoppingCart,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  X,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Order, OrderStatus } from '../../_types';

const baseHref = '/webapp-demo/ecommerce/demo-01';
const adminBase = `${baseHref}/admin`;

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');

  const statuses: OrderStatus[] = [
    'Pending',
    'Called',
    'Confirmed',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(search.trim())
        );
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Packed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Confirmed':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Called':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, statusNote || undefined);
    setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    setStatusNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Order Management & Fulfillment
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Process, verify and dispatch customer orders ({orders.length} total orders)
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#ECE6DC] pb-3 text-xs">
          <button
            onClick={() => setStatusFilter('All')}
            className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
              statusFilter === 'All'
                ? 'bg-[#072D24] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-[#072D24] text-white font-bold shadow-xs'
                    : 'bg-[#FAF8F5] text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {st} {count > 0 && <span className="opacity-70 font-mono">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search order ID, customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] py-2 pl-9 pr-4 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-[#ECE6DC] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE6DC] text-zinc-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">City / Area</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-zinc-400">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F2923]">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-zinc-900">{order.customerName}</p>
                      <p className="text-[11px] text-zinc-400">{order.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-700">{order.city}</td>
                    <td className="py-3.5 px-4 text-zinc-700">{order.items.length} items</td>
                    <td className="py-3.5 px-4 font-bold text-[#E87121]">
                      ৳{order.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-zinc-800">{order.paymentMethod}</span>
                      <span
                        className={`block text-[10px] font-bold ${
                          order.paymentStatus === 'Paid'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#072D24] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0c4437]"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#ECE6DC] space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-4">
              <div>
                <span className="text-xs text-zinc-400">Order Management</span>
                <h3 className="text-lg font-black text-[#1F2923]">{selectedOrder.id}</h3>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`${adminBase}/fraud-check?phone=${encodeURIComponent(selectedOrder.phone)}`}
                  className="inline-flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                  <span>Fraud Check</span>
                </Link>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-950">Change Order Status:</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  Current: {selectedOrder.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(st)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      selectedOrder.status === st
                        ? 'bg-[#072D24] text-white shadow-xs'
                        : 'bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-[#ECE6DC] bg-[#FAF8F5] p-4 space-y-2">
                <h4 className="font-bold text-[#1F2923] border-b border-[#E8E2D6] pb-1.5">
                  Customer Information
                </h4>
                <p>
                  <strong className="text-zinc-500">Name:</strong> {selectedOrder.customerName}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-zinc-400" />
                  <a href={`tel:${selectedOrder.phone}`} className="text-blue-600 font-bold">
                    {selectedOrder.phone}
                  </a>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{selectedOrder.email || 'None provided'}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-[#ECE6DC] bg-[#FAF8F5] p-4 space-y-2">
                <h4 className="font-bold text-[#1F2923] border-b border-[#E8E2D6] pb-1.5">
                  Delivery Details
                </h4>
                <p className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.address}, <strong>{selectedOrder.city}</strong>
                  </span>
                </p>
                {selectedOrder.notes && (
                  <p className="text-zinc-500 italic mt-1">
                    &quot;{selectedOrder.notes}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#1F2923]">Ordered Items ({selectedOrder.items.length})</h4>
              <div className="divide-y divide-[#F0ECE4] rounded-2xl border border-[#ECE6DC] overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 rounded-xl object-cover bg-zinc-100 border border-[#ECE6DC]"
                      />
                      <div>
                        <p className="font-bold text-zinc-900">{item.name}</p>
                        <p className="text-[11px] text-zinc-400">Unit Price: ৳{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 block">Qty: {item.quantity}</span>
                      <span className="font-bold text-zinc-900">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-2xl bg-[#FAF8F5] p-4 text-xs space-y-1.5 text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount Applied:</span>
                  <span>-৳{selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>৳{selectedOrder.shippingFee}</span>
              </div>
              <div className="border-t border-[#ECE6DC] pt-2 flex justify-between text-sm font-bold text-[#1F2923]">
                <span>Grand Total:</span>
                <span className="text-[#E87121]">৳{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#1F2923]">Audit Timeline</h4>
              <div className="space-y-2 border-l-2 border-emerald-500 pl-4 relative">
                {selectedOrder.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
                    <div className="flex justify-between">
                      <span className="font-bold text-zinc-900">{event.status}</span>
                      <span className="text-[10px] text-zinc-400">{event.timestamp}</span>
                    </div>
                    <p className="text-zinc-600 text-[11px] mt-0.5">{event.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
