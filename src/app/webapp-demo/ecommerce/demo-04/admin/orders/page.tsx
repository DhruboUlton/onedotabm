'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  X,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Order, OrderStatus } from '../../_types';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const base = '/webapp-demo/ecommerce/demo-04';

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
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
      const q = search.toLowerCase();
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q);
      const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, selectedStatus]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Updated by merchant admin.`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">Order Management</h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            {orders.length} total customer orders in fulfillment queue.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`${base}/admin/fraud-check`}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#FFEFE4] text-xs font-bold text-[#0A6375] flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-[#EB1551]" />
            <span>Fraud Risk Inspector</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-nunito font-bold text-[#0F172A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold font-nunito">
          <span className="text-slate-400 hidden sm:inline">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#0F172A] focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses ({orders.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st} ({orders.filter((o) => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-nunito">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FFEFE4]/40 text-[#0A6375] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Items / Total</th>
                <th className="py-3.5 px-4">Fraud Risk</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Order & Date */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold font-mono text-sm text-[#0A6375] block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ord.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-sm text-[#0F172A] block">{ord.customerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ord.phone} • {ord.city}</span>
                  </td>

                  {/* Items & Total */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-sm text-[#0F172A] block">
                      ${ord.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} items • {ord.paymentMethod}
                    </span>
                  </td>

                  {/* Fraud Risk */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        ord.fraudRisk === 'Low'
                          ? 'bg-[#008000]/10 text-[#008000]'
                          : ord.fraudRisk === 'Medium'
                          ? 'bg-[#F7941E]/10 text-[#F7941E]'
                          : 'bg-[#EB1551]/10 text-[#EB1551]'
                      }`}
                    >
                      {ord.fraudRisk === 'Low' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      <span>{ord.fraudRisk} ({ord.fraudScore})</span>
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase border cursor-pointer ${
                        ord.status === 'Delivered'
                          ? 'bg-[#008000]/10 border-[#008000]/30 text-[#008000]'
                          : ord.status === 'Shipped'
                          ? 'bg-[#0A6375]/10 border-[#0A6375]/30 text-[#0A6375]'
                          : ord.status === 'Confirmed'
                          ? 'bg-[#1CBBB4]/10 border-[#1CBBB4]/30 text-[#1CBBB4]'
                          : ord.status === 'Cancelled'
                          ? 'bg-slate-200 border-slate-300 text-slate-600'
                          : 'bg-[#F7941E]/10 border-[#F7941E]/30 text-[#F7941E]'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st} className="bg-white text-slate-800">
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#0A6375] hover:text-[#0A6375] text-slate-600 font-bold text-xs flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ORDER DETAIL DRAWER                                            */}
      {/* ============================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-10 space-y-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#1CBBB4]">
                    Fulfillment Dossier
                  </span>
                  <h3 className="font-bubblegum text-2xl text-[#0F172A]">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Selector */}
              <div className="p-4 rounded-2xl bg-[#FFEFE4] border border-[#F7941E]/30 space-y-2">
                <span className="text-xs font-bold text-[#0A6375] block">Update Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedOrder.status === st
                          ? 'bg-[#0A6375] text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-[#FFEFE4]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 text-xs font-nunito bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  Customer & Shipping
                </h4>
                <div className="space-y-1 text-slate-600">
                  <p>
                    <strong className="text-slate-800">Name:</strong> {selectedOrder.customerName}
                  </p>
                  <p>
                    <strong className="text-slate-800">Email:</strong> {selectedOrder.customerEmail}
                  </p>
                  <p>
                    <strong className="text-slate-800">Phone:</strong> {selectedOrder.phone}
                  </p>
                  <p>
                    <strong className="text-slate-800">Address:</strong> {selectedOrder.address},{' '}
                    {selectedOrder.city} {selectedOrder.postalCode}
                  </p>
                  {selectedOrder.notes && (
                    <p className="pt-1 text-[#EB1551]">
                      <strong>Note:</strong> {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  Ordered Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white"
                    >
                      <div className="relative w-12 h-12 rounded-lg bg-[#FFEFE4] overflow-hidden shrink-0 border border-slate-200">
                        <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <h5 className="font-bold text-[#0F172A] truncate">{item.title}</h5>
                        <span className="text-slate-400">
                          {item.variantName} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-extrabold text-xs text-[#0F172A]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="space-y-1.5 text-xs text-[#6B6B84] pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#0F172A]">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#EB1551]">
                    <span>Discount ({selectedOrder.couponCode}):</span>
                    <span className="font-bold">-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-bold text-[#0F172A]">${selectedOrder.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#0F172A] pt-1 border-t border-slate-100">
                  <span>Total Paid:</span>
                  <span className="text-[#EB1551]">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Timeline History */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  Order Timeline
                </h4>
                <div className="space-y-2 text-[11px] font-nunito">
                  {selectedOrder.statusHistory.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 border-l-2 border-[#1CBBB4] pl-2.5">
                      <div>
                        <span className="font-bold text-[#0A6375] block">{step.status}</span>
                        <span className="text-slate-400 text-[10px]">
                          {new Date(step.timestamp).toLocaleString()}
                        </span>
                        {step.note && <p className="text-slate-600 mt-0.5">{step.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
