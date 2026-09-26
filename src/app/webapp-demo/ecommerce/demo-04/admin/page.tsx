'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';

export default function AdminDashboardPage() {
  const { orders, products, categories, activityLog } = useStore();
  const base = '/webapp-demo/ecommerce/demo-04';

  // Compute live metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 20);

  // Status breakdown
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Mock weekly revenue bars
  const weeklyData = [
    { day: 'Mon', revenue: 320, orders: 5 },
    { day: 'Tue', revenue: 450, orders: 7 },
    { day: 'Wed', revenue: 280, orders: 4 },
    { day: 'Thu', revenue: 590, orders: 9 },
    { day: 'Fri', revenue: 640, orders: 11 },
    { day: 'Sat', revenue: 820, orders: 14 },
    { day: 'Sun', revenue: totalRevenue > 2600 ? totalRevenue - 2600 : 710, orders: 12 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0A6375] to-[#1CBBB4] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#FFDA43] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Operating System</span>
          </span>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-white">
            WonderSprout Merchant Center
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-nunito max-w-lg">
            Manage your Montessori toy inventory, process customer orders, configure promotions, and monitor real-time conversions.
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <Link
            href={`${base}/admin/products`}
            className="px-5 py-2.5 rounded-full bg-white text-[#0A6375] hover:bg-[#FFEFE4] text-xs font-extrabold uppercase tracking-wider shadow-md transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href={`${base}`}
            target="_blank"
            className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 rounded-2xl bg-[#008000]/10 text-[#008000] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
              ${totalRevenue.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-[#008000] flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">From {totalOrders} completed checkouts</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-2xl bg-[#1CBBB4]/10 text-[#1CBBB4] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-2xl sm:text-3xl text-[#0F172A]">{totalOrders}</span>
            <span className="text-xs font-bold text-[#1CBBB4]">Live Queue</span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            {pendingOrders} awaiting fulfillment
          </span>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order</span>
            <div className="w-9 h-9 rounded-2xl bg-[#F7941E]/10 text-[#F7941E] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
              ${aov.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-500">Per cart</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Bundles lift average basket</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Notice</span>
            <div className="w-9 h-9 rounded-2xl bg-[#EB1551]/10 text-[#EB1551] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-2xl sm:text-3xl text-[#EB1551]">
              {lowStockProducts.length}
            </span>
            <span className="text-xs font-bold text-[#EB1551]">Needs Reorder</span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Items under 20 units threshold
          </span>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#0F172A]">Weekly Revenue & Demand Trend</h3>
              <p className="text-xs text-slate-400">Daily gross store sales (USD)</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#FFEFE4] text-xs font-bold text-[#0A6375]">
              Last 7 Days
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 px-2 border-b border-slate-100">
            {weeklyData.map((d, i) => {
              const maxVal = 900;
              const heightPercent = Math.min(100, Math.round((d.revenue / maxVal) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-slate-400 group-hover:text-[#EB1551] transition-colors">
                    ${d.revenue}
                  </div>
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-[#0A6375] to-[#1CBBB4] group-hover:to-[#EB1551] rounded-t-xl transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-bold text-[#0F172A]">{d.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1CBBB4]" /> Educational Toy Sales
            </span>
            <span>Total 7-Day Revenue: ${weeklyData.reduce((s, d) => s + d.revenue, 0)}</span>
          </div>
        </div>

        {/* Order Status Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#0F172A]">Order Fulfillment Status</h3>
            <p className="text-xs text-slate-400">Current active pipeline</p>
          </div>

          <div className="space-y-3 font-nunito text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F7941E]" />
                <span className="font-bold text-slate-700">Pending Call / Confirmation</span>
              </div>
              <span className="font-extrabold text-[#F7941E]">{statusCounts.Pending || 0}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1CBBB4]" />
                <span className="font-bold text-slate-700">Confirmed & Packing</span>
              </div>
              <span className="font-extrabold text-[#1CBBB4]">{statusCounts.Confirmed || 0}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A6375]" />
                <span className="font-bold text-slate-700">Shipped with Tracking</span>
              </div>
              <span className="font-extrabold text-[#0A6375]">{statusCounts.Shipped || 0}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#008000]" />
                <span className="font-bold text-slate-700">Delivered</span>
              </div>
              <span className="font-extrabold text-[#008000]">{statusCounts.Delivered || 0}</span>
            </div>
          </div>

          <Link
            href={`${base}/admin/orders`}
            className="w-full py-3 rounded-2xl bg-[#FFEFE4] hover:bg-[#EB1551] text-[#0A6375] hover:text-white font-bold text-xs uppercase tracking-wider text-center transition-colors block"
          >
            Review All Orders &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Orders & Activity Log Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0F172A]">Recent Storefront Orders</h3>
            <Link
              href={`${base}/admin/orders`}
              className="text-xs font-bold text-[#0A6375] hover:text-[#EB1551]"
            >
              View All ({orders.length}) &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-nunito">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-extrabold font-mono text-[#0A6375]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3">
                      <span className="font-bold text-[#0F172A] block">{order.customerName}</span>
                      <span className="text-[10px] text-slate-400">{order.city}</span>
                    </td>
                    <td className="py-3 font-bold text-slate-600">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </td>
                    <td className="py-3 font-extrabold text-[#0F172A]">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.status === 'Delivered'
                            ? 'bg-[#008000]/10 text-[#008000]'
                            : order.status === 'Shipped'
                            ? 'bg-[#0A6375]/10 text-[#0A6375]'
                            : order.status === 'Confirmed'
                            ? 'bg-[#1CBBB4]/10 text-[#1CBBB4]'
                            : 'bg-[#F7941E]/10 text-[#F7941E]'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Audit Feed (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0F172A]">Audit Activity Trail</h3>
            <Link
              href={`${base}/admin/activity-log`}
              className="text-xs font-bold text-[#0A6375] hover:text-[#EB1551]"
            >
              Full Log &rarr;
            </Link>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activityLog.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#0A6375]">{item.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-nunito leading-snug">
                  {item.details}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>By: {item.user}</span>
                  <span className="bg-white px-2 py-0.5 rounded border text-slate-500 font-bold">
                    {item.area}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
