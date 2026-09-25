'use client';

import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  Boxes,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';

const baseHref = '/webapp-demo/ecommerce/demo-01';
const adminBase = `${baseHref}/admin`;

export default function AdminDashboardPage() {
  const { orders, products, updateOrderStatus, activityLogs } = useStore();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 20);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');

  // Revenue chart mock points (last 7 days)
  const revenueTrend = [
    { day: 'Mon', rev: 14200, orders: 6 },
    { day: 'Tue', rev: 18500, orders: 8 },
    { day: 'Wed', rev: 22100, orders: 9 },
    { day: 'Thu', rev: 19800, orders: 7 },
    { day: 'Fri', rev: 28400, orders: 12 },
    { day: 'Sat', rev: 34200, orders: 15 },
    { day: 'Sun', rev: 31000, orders: 13 },
  ];

  const maxRev = Math.max(...revenueTrend.map((d) => d.rev));

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Store Performance Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time analytics and store management summary
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`${adminBase}/products/new`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#072D24] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0c4437] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href={`${adminBase}/orders`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#E87121] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#D46013] transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* 1. Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-extrabold text-[#1F2923]">
            ৳{totalRevenue.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-extrabold text-[#1F2923]">
            {totalOrders}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-700 font-medium">
            <span>{pendingOrders.length} pending fulfillment</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Avg. Order Value (AOV)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-extrabold text-[#1F2923]">
            ৳{aov.toLocaleString()}
          </p>
          <div className="mt-1 text-[11px] text-zinc-500">
            Across all customer checkouts
          </div>
        </div>

        {/* Active Products & Low Stock */}
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Catalogue Health</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-extrabold text-[#1F2923]">
            {activeProducts} <span className="text-xs font-normal text-zinc-400">Products</span>
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
            <AlertTriangle className="h-3 w-3" />
            <span>{lowStockProducts.length} low stock warnings</span>
          </div>
        </div>
      </div>

      {/* 2. Charts & Performance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Visualizer (Span 2) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#ECE6DC] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1F2923]">Daily Revenue Trend (Last 7 Days)</h2>
              <p className="text-xs text-zinc-500">Sales volume and customer purchase trajectory</p>
            </div>
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
              Peak: ৳34,200
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-4 pb-2">
            <div className="flex items-end justify-between gap-3 h-44">
              {revenueTrend.map((item) => {
                const heightPercent = Math.round((item.rev / maxRev) * 100);

                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#072D24]">
                      ৳{(item.rev / 1000).toFixed(1)}k
                    </div>
                    <div className="w-full bg-[#FAF8F5] rounded-t-lg h-36 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-[#072D24] group-hover:bg-[#E87121] transition-all rounded-t-lg"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-zinc-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Status Breakdown (Span 1) */}
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1F2923]">Order Fulfillment Status</h2>
            <p className="text-xs text-zinc-500">Distribution across active workflow stages</p>
          </div>

          <div className="space-y-3 my-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-zinc-700">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>Pending Confirmation</span>
              </span>
              <span className="font-bold text-zinc-900">{pendingOrders.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-zinc-700">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span>Shipped with Courier</span>
              </span>
              <span className="font-bold text-zinc-900">
                {orders.filter((o) => o.status === 'Shipped').length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-zinc-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                <span>Delivered & Paid</span>
              </span>
              <span className="font-bold text-zinc-900">{deliveredOrders.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-zinc-700">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span>Packed for Dispatch</span>
              </span>
              <span className="font-bold text-zinc-900">
                {orders.filter((o) => o.status === 'Packed').length}
              </span>
            </div>
          </div>

          <Link
            href={`${adminBase}/orders`}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#072D24] py-2 text-xs font-bold text-[#072D24] hover:bg-[#072D24] hover:text-white transition-all text-center"
          >
            <span>Manage All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Recent Orders Table & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (Span 2) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#ECE6DC] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1F2923]">Recent Customer Orders</h2>
              <p className="text-xs text-zinc-500">Live order stream synced with storefront checkout</p>
            </div>
            <Link
              href={`${adminBase}/orders`}
              className="text-xs font-bold text-[#E87121] hover:underline"
            >
              View All ({orders.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECE6DC] text-zinc-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Items</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 font-mono font-bold text-[#1F2923]">{order.id}</td>
                    <td className="py-3">
                      <p className="font-semibold text-zinc-900">{order.customerName}</p>
                      <p className="text-[10px] text-zinc-400">{order.phone}</p>
                    </td>
                    <td className="py-3 text-zinc-600">{order.items.length} items</td>
                    <td className="py-3 font-bold text-[#E87121]">৳{order.total.toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {order.status === 'Pending' ? (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Confirmed', 'Quick confirmed from dashboard')}
                          className="rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-800"
                        >
                          Confirm
                        </button>
                      ) : (
                        <Link
                          href={`${adminBase}/orders`}
                          className="text-[11px] font-bold text-[#072D24] hover:underline"
                        >
                          Details &rarr;
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Inventory Alert (Span 1) */}
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1F2923]">Low Stock Alerts</h2>
              <p className="text-xs text-zinc-500">Products requiring restock</p>
            </div>
            <Link
              href={`${adminBase}/inventory`}
              className="text-xs font-bold text-[#E87121] hover:underline"
            >
              Inventory
            </Link>
          </div>

          <div className="divide-y divide-[#F0ECE4] text-xs">
            {lowStockProducts.concat(outOfStockProducts).slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={p.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg'}
                    alt={p.name}
                    className="h-10 w-10 rounded-lg object-cover bg-zinc-100"
                  />
                  <div>
                    <p className="font-semibold text-zinc-900 line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-zinc-400">SKU: {p.sku}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`block font-bold ${
                      p.stock <= 0 ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  >
                    {p.stock} units
                  </span>
                  <Link
                    href={`${adminBase}/inventory`}
                    className="text-[10px] text-blue-600 hover:underline"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Mini Log */}
          <div className="border-t border-[#F0ECE4] pt-4">
            <h3 className="text-xs font-bold text-zinc-700 mb-2">Recent Store Activity</h3>
            <div className="space-y-2">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="text-[11px] text-zinc-600 flex items-start gap-1.5">
                  <Clock className="h-3 w-3 text-zinc-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    <strong>{log.action}</strong>: {log.entity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
