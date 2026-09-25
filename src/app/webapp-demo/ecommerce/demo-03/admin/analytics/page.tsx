'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Store,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { products, orders, vendors } = useStore();
  const [dateRange, setDateRange] = useState('30d');
  const [selectedVendor, setSelectedVendor] = useState('all');

  const gmv = orders.reduce((sum, o) => sum + o.total, 0) + 142800;
  const netCommission = gmv * 0.125;
  const aov = gmv / (orders.length + 1280);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Analytics & Financial Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detailed performance breakdown, unit conversion funnels, and vendor marketplace volume.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Merchants</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (Q3 2026)</option>
            <option value="1y">Trailing 12 Months</option>
          </select>
        </div>
      </div>

      {/* 4 Analytics Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Sales Volume</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">${gmv.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.2% vs prior period</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Commission Retained</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">${netCommission.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div className="text-[11px] text-slate-400 font-medium">12.5% effective take-rate</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Order Value (AOV)</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">${aov.toFixed(2)}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+$12.40 from basket upsells</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">3.48%</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+0.6% checkout completion</span>
          </div>
        </div>
      </div>

      {/* SVG Performance Chart: Monthly Revenue Bars */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Monthly Marketplace GMV vs Net Commission</h3>
            <p className="text-xs text-slate-400">Quarterly trend tracking merchant gross vs platform earnings</p>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="grid grid-cols-6 gap-3 sm:gap-6 pt-6 pb-2 items-end h-56">
          {[
            { month: 'Apr', gmv: 98000, fee: 12250, height: '55%' },
            { month: 'May', gmv: 112000, fee: 14000, height: '65%' },
            { month: 'Jun', gmv: 128000, fee: 16000, height: '72%' },
            { month: 'Jul', gmv: 140000, fee: 17500, height: '80%' },
            { month: 'Aug', gmv: 154000, fee: 19250, height: '88%' },
            { month: 'Sep (P)', gmv: 172000, fee: 21500, height: '98%' },
          ].map((bar) => (
            <div key={bar.month} className="flex flex-col items-center gap-2 h-full justify-end group">
              <div className="relative w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex flex-col justify-end" style={{ height: '100%' }}>
                <div
                  className="w-full bg-blue-600 rounded-2xl group-hover:bg-blue-500 transition-all duration-300"
                  style={{ height: bar.height }}
                />
              </div>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{bar.month}</span>
              <span className="text-[10px] text-slate-400 font-mono">${(bar.gmv / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance & Customer Growth Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Category Sales Leaderboard</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {[
              { name: 'Laptops & Creator Ultrabooks', sales: '$68,400', share: '42%', growth: '+24%' },
              { name: 'Smartphones & Foldables', sales: '$42,200', share: '26%', growth: '+14%' },
              { name: 'Spatial Audio & ANC Headphones', sales: '$29,100', share: '18%', growth: '+19%' },
              { name: 'Gaming Consoles & Controllers', sales: '$22,800', share: '14%', growth: '+8%' },
            ].map((cat, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{cat.name}</span>
                  <div className="text-[10px] text-slate-400">{cat.share} of total market sales</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 dark:text-slate-100">{cat.sales}</div>
                  <span className="text-[10px] font-bold text-emerald-600">{cat.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Merchant Performance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Merchant Sales Contribution</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {vendors.map((v) => (
              <div key={v.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-black flex items-center justify-center text-xs">
                    {v.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{v.name}</span>
                    <span className="text-[10px] text-slate-400 block">{v.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 dark:text-slate-100">${(v.salesCount * 85).toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">{v.salesCount} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
