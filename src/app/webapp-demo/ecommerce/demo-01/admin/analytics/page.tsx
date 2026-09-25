'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Package,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';

export default function AdminAnalyticsPage() {
  const { orders, products } = useStore();
  const [timeRange, setTimeRange] = useState('7d');

  // Base metrics
  const totalRev = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
  const unitsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const profitEstimate = Math.round(totalRev * 0.38); // 38% estimated gross profit

  const categoryShare = [
    { name: 'Oil & Ghee', share: 44, color: '#E87121' },
    { name: 'Honey', share: 26, color: '#072D24' },
    { name: 'Premium Dates', share: 18, color: '#F59E0B' },
    { name: 'Spices & Seeds', share: 12, color: '#10B981' },
  ];

  const funnel = [
    { stage: 'Storefront Visitors', count: 12450, rate: '100%' },
    { stage: 'Product Detail Views', count: 5820, rate: '46.7%' },
    { stage: 'Added to Cart', count: 1890, rate: '15.2%' },
    { stage: 'Reached Checkout', count: 720, rate: '5.8%' },
    { stage: 'Completed Orders', count: 340, rate: '2.7%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Store Performance & Analytics
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Key revenue metrics, customer purchase funnel, and product category distribution
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 rounded-xl border border-[#ECE6DC] bg-white p-1 text-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                timeRange === range.id
                  ? 'bg-[#072D24] text-white font-bold'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Gross Sales Revenue</span>
          <p className="mt-2 text-2xl font-extrabold text-[#1F2923]">৳{totalRev.toLocaleString()}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
            <TrendingUp className="h-3 w-3" /> +22.4% period increase
          </span>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Gross Profit (Est.)</span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700">
            ৳{profitEstimate.toLocaleString()}
          </p>
          <span className="mt-1 text-[11px] text-zinc-400">~38% average pantry margin</span>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Total Units Sold</span>
          <p className="mt-2 text-2xl font-extrabold text-[#1F2923]">{unitsSold} units</p>
          <span className="mt-1 text-[11px] text-zinc-400">Across {totalOrders} customer orders</span>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Store Conversion Rate</span>
          <p className="mt-2 text-2xl font-extrabold text-[#E87121]">2.73%</p>
          <span className="mt-1 text-[11px] text-zinc-400">Industry benchmark: 1.8%</span>
        </div>
      </div>

      {/* Category Performance & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Distribution */}
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923]">Category Sales Distribution</h2>
          <p className="text-xs text-zinc-500">Percentage contribution to overall store turnover</p>

          <div className="space-y-3 pt-2">
            {categoryShare.map((cat) => (
              <div key={cat.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-zinc-800">{cat.name}</span>
                  <span className="text-[#E87121]">{cat.share}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cat.share}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E-commerce Conversion Funnel */}
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2923]">Customer Acquisition Funnel</h2>
          <p className="text-xs text-zinc-500">From homepage visitor to verified purchaser</p>

          <div className="space-y-3 pt-2 text-xs">
            {funnel.map((step, idx) => (
              <div
                key={step.stage}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE6DC]"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#072D24] text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-zinc-800">{step.stage}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-zinc-500">{step.count.toLocaleString()}</span>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {step.rate}
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
