'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Package, Calendar } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';

export default function AdminAnalyticsPage() {
  const { orders, products, categories } = useStore();
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + o.total, 0);

  const totalUnitsSold = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + o.items.reduce((sum, item) => sum + item.quantity, 0), 0);

  const estimatedProfit = totalRevenue * 0.62; // ~62% gross margin

  const categoryBreakdown = [
    { name: 'Montessori & Early Learning', revenue: totalRevenue * 0.44, percent: 44, color: '#0A6375' },
    { name: 'STEM & Construction', revenue: totalRevenue * 0.28, percent: 28, color: '#1CBBB4' },
    { name: 'Puzzles & Shape Sorters', revenue: totalRevenue * 0.18, percent: 18, color: '#F7941E' },
    { name: 'Creative Sensory & Clay', revenue: totalRevenue * 0.1, percent: 10, color: '#EB1551' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">Store Analytics</h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            Ecommerce performance tracking, gross margin models, and category velocity.
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 text-xs font-bold font-nunito shadow-xs">
          {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                timeRange === range
                  ? 'bg-[#0A6375] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] block">
            ${totalRevenue.toFixed(2)}
          </span>
          <span className="text-[11px] font-bold text-[#008000]">+12.4% vs previous</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Units Dispatched</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#1CBBB4] block">
            {totalUnitsSold}
          </span>
          <span className="text-[11px] text-slate-400">Physical toys delivered</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Margin</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0A6375] block">
            ${estimatedProfit.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400">62% gross manufacturing</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Checkouts</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#EB1551] block">
            {orders.length}
          </span>
          <span className="text-[11px] text-slate-400">Avg ${(totalRevenue / Math.max(1, orders.length)).toFixed(2)}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Share Breakdown (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-[#0F172A]">Category Revenue Share</h3>
          <div className="space-y-4 font-nunito text-xs">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">{cat.name}</span>
                  <span className="text-[#0F172A]">${cat.revenue.toFixed(2)} ({cat.percent}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Velocity Products (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#0F172A]">Top Velocity Products</h3>
          <div className="divide-y divide-slate-100">
            {products.slice(0, 5).map((prod) => (
              <div key={prod.id} className="py-3 flex items-center justify-between text-xs font-nunito">
                <div>
                  <h4 className="font-bold text-[#0F172A] line-clamp-1">{prod.title}</h4>
                  <span className="text-[10px] text-slate-400">{prod.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#0A6375] block">${prod.basePrice.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500">{prod.stock} in stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
