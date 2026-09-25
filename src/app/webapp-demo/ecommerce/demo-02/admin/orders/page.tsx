'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Order, OrderStatus } from '../../_types';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  X,
  Phone,
  MapPin,
  ShieldAlert,
  Calendar,
  DollarSign,
  AlertTriangle,
  User,
} from 'lucide-react';

const adminBase = '/webapp-demo/ecommerce/demo-02/admin';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search) ||
      order.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusTab === 'all' || order.status === statusTab;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus, statusNote.trim() || undefined);
    setStatusNote('');
    if (selectedOrder) {
      const updated = orders.find((o) => o.id === orderId);
      if (updated) setSelectedOrder(updated);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Called':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Packed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Shipped':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const statuses: OrderStatus[] = [
    'Pending',
    'Called',
    'Confirmed',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Fulfillment Logistics
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Customer Orders & Courier Pipeline
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time management of incoming customer orders, courier dispatch tracking, and fulfillment audit timelines.
          </p>
        </div>

        <Link
          href={`${adminBase}/fraud-check`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Courier Fraud Verification</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
        <button
          onClick={() => setStatusTab('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
            statusTab === 'all'
              ? 'bg-black text-white shadow-xs font-bold'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          All Orders ({orders.length})
        </button>
        {statuses.map((st) => {
          const count = orders.filter((o) => o.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setStatusTab(st)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                statusTab === st
                  ? 'bg-black text-white shadow-xs font-bold'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
          />
        </div>
        <span className="text-xs font-medium text-zinc-400">
          Showing {filteredOrders.length} orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400">
                    No orders found matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-zinc-900 block">{order.id}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">{order.date}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-zinc-900">{order.customerName}</p>
                      <p className="text-[10px] text-zinc-500">{order.phone}</p>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-zinc-700">{order.city}</td>

                    <td className="py-3.5 px-4 text-zinc-600">
                      {order.items.length} {order.items.length === 1 ? 'poster' : 'posters'}
                    </td>

                    <td className="py-3.5 px-4 font-black text-zinc-900">
                      ৳{order.total.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-black text-zinc-900">
                  {selectedOrder.id}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="font-bold text-[10px] uppercase text-zinc-400 block">Customer</span>
                <p className="font-extrabold text-zinc-900 text-sm">{selectedOrder.customerName}</p>
                <p className="text-zinc-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  {selectedOrder.phone}
                </p>
                {selectedOrder.email && <p className="text-zinc-500">{selectedOrder.email}</p>}
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="font-bold text-[10px] uppercase text-zinc-400 block">Delivery Address</span>
                <p className="font-semibold text-zinc-800">{selectedOrder.address}</p>
                <p className="text-zinc-600 font-bold">{selectedOrder.city}, Bangladesh</p>
                {selectedOrder.notes && (
                  <p className="text-[11px] text-amber-700 pt-1 border-t border-zinc-200">
                    <strong>Note:</strong> {selectedOrder.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 py-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Ordered Glass Posters ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{item.name}</p>
                        <p className="text-[10px] text-zinc-400">
                          {item.selectedSize} • Qty: {item.quantity}
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

            {/* Advance Status Controls */}
            <div className="py-4 border-t border-zinc-100 space-y-3">
              <label className="block text-xs font-bold text-zinc-700">
                Advance Fulfillment State:
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedOrder.status === st
                        ? 'bg-black text-white shadow-md'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    Mark {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-2 border-t border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Order Activity Ledger
              </h4>
              <div className="space-y-3 border-l-2 border-zinc-200 pl-3 ml-2 text-xs">
                {selectedOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-3">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-black ring-4 ring-white" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900">{step.status}</span>
                      <span className="text-[10px] text-zinc-400">{step.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{step.note}</p>
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
