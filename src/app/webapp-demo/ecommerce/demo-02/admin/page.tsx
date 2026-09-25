'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../_context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Truck,
  ExternalLink,
  ChevronRight,
  Boxes,
  Users,
} from 'lucide-react';

const adminBase = '/webapp-demo/ecommerce/demo-02/admin';

export default function AdminDashboardPage() {
  const { orders, products, categories, activityLogs, updateOrderStatus, showToast } = useStore();

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeProducts = products.filter((p) => p.status === 'active').length;

  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10);

  // Weekly Revenue Mock Bar Chart Data
  const weeklyRevenue = [
    { day: 'Mon', revenue: 14200, orders: 8 },
    { day: 'Tue', revenue: 19800, orders: 12 },
    { day: 'Wed', revenue: 24500, orders: 15 },
    { day: 'Thu', revenue: 18900, orders: 11 },
    { day: 'Fri', revenue: 31200, orders: 19 },
    { day: 'Sat', revenue: 42800, orders: 26 },
    { day: 'Sun', revenue: 38400, orders: 23 },
  ];

  const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.revenue));

  const handleQuickConfirm = (orderId: string) => {
    updateOrderStatus(orderId, 'Confirmed', 'Verified and confirmed from dashboard quick-action.');
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Live Merchant Operations
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            AuraGlass Studio Overview
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time telemetry for tempered glass wall art sales, inventory levels, and courier dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`${adminBase}/orders`}
            className="px-4 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </Link>
          <Link
            href={`${adminBase}/products/new`}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition-colors"
          >
            + Add Glass Poster
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-zinc-900">৳{totalRevenue.toLocaleString()}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +18.4% from last week
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-zinc-900">{totalOrders}</h3>
            <p className="text-[11px] text-zinc-500 mt-1">
              <strong className="text-amber-600">{pendingOrders.length}</strong> pending confirmation
            </p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Average Order Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-zinc-900">৳{aov.toLocaleString()}</h3>
            <p className="text-[11px] text-zinc-500 mt-1">Multi-poster bundles dominant</p>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Active Catalogue
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-zinc-900">{activeProducts}</h3>
            <p className="text-[11px] text-zinc-500 mt-1">Across {categories.length} categories</p>
          </div>
        </div>
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900">7-Day Revenue Velocity</h3>
              <p className="text-xs text-zinc-500">Gross daily sales across all glass art orders</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Avg ৳27,100 / day
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end gap-3 sm:gap-6 justify-between border-b border-zinc-200 pb-2">
              {weeklyRevenue.map((item, idx) => {
                const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-zinc-800 bg-zinc-100 px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-xs">
                      ৳{item.revenue.toLocaleString()}
                    </div>
                    <div
                      className="w-full bg-zinc-900 group-hover:bg-rose-500 transition-all rounded-t-lg shadow-xs"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[11px] font-semibold text-zinc-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-zinc-900">Order Fulfillment</h3>
            <p className="text-xs text-zinc-500">Current courier dispatch pipeline</p>
          </div>

          <div className="space-y-3 py-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-zinc-700">Pending Review</span>
                <span className="font-bold text-amber-600">{pendingOrders.length}</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(pendingOrders.length / (totalOrders || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-zinc-700">Confirmed & Packing</span>
                <span className="font-bold text-blue-600">
                  {orders.filter((o) => o.status === 'Confirmed' || o.status === 'Packed').length}
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      (orders.filter((o) => o.status === 'Confirmed' || o.status === 'Packed').length /
                        (totalOrders || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-zinc-700">In Transit Courier</span>
                <span className="font-bold text-indigo-600">
                  {orders.filter((o) => o.status === 'Shipped').length}
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${
                      (orders.filter((o) => o.status === 'Shipped').length / (totalOrders || 1)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-zinc-700">Delivered Successfully</span>
                <span className="font-bold text-emerald-600">{deliveredOrders.length}</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${(deliveredOrders.length / (totalOrders || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <Link
            href={`${adminBase}/orders`}
            className="w-full py-2.5 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors block"
          >
            View Order Fulfillment Pipeline →
          </Link>
        </div>
      </div>

      {/* Recent Orders & Low Stock Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900">Recent Customer Orders</h3>
              <p className="text-xs text-zinc-500">Live order queue synced with storefront checkout</p>
            </div>
            <Link
              href={`${adminBase}/orders`}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-100">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">{order.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-zinc-900">{order.customerName}</p>
                      <p className="text-[11px] text-zinc-400">{order.city} • {order.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {order.items.length} {order.items.length === 1 ? 'poster' : 'posters'}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-zinc-900">
                      ৳{order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700'
                            : order.status === 'Confirmed'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {order.status === 'Pending' ? (
                        <button
                          onClick={() => handleQuickConfirm(order.id)}
                          className="px-2.5 py-1 bg-black hover:bg-zinc-800 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                      ) : (
                        <Link
                          href={`${adminBase}/orders`}
                          className="text-zinc-500 hover:text-black font-semibold text-[11px]"
                        >
                          Details →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-zinc-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-500" />
              <span>Low Stock Alerts</span>
            </h3>
            <Link
              href={`${adminBase}/inventory`}
              className="text-xs font-bold text-zinc-600 hover:text-black"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">All glass inventory well-stocked.</p>
            ) : (
              lowStockProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-zinc-400">{p.sku}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-600 px-2 py-0.5 rounded-md bg-amber-50 shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-zinc-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Live Activity Stream
            </h4>
            <div className="space-y-2">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="text-[11px] text-zinc-600 leading-tight">
                  <span className="font-bold text-zinc-900">{log.action}</span>: {log.entity}
                  <span className="text-[10px] text-zinc-400 block mt-0.5">{log.timestamp.substring(11, 16)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
