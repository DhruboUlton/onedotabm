'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { orders, products, categories } = useStore();
  const [timeRange, setTimeRange] = useState('7d');

  const totalGrossRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const totalUnitsSold = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const estProfit = Math.round(totalGrossRevenue * 0.62); // 62% gross margin on glass posters

  const categoryPerformance = categories.map((cat) => {
    const prodsInCat = products.filter((p) => p.category === cat.slug);
    const mockSales = prodsInCat.length * 18400 + 4500;
    return {
      name: cat.name,
      sales: mockSales,
      percent: Math.min(100, Math.round((mockSales / 95000) * 100)),
    };
  });

  const conversionFunnel = [
    { step: 'Storefront Visitors', count: 18450, rate: '100%' },
    { step: 'Product Details Viewed', count: 9680, rate: '52.4%' },
    { step: 'Added to Glass Cart', count: 3240, rate: '17.5%' },
    { step: 'Reached Checkout', count: 1890, rate: '10.2%' },
    { step: 'Orders Completed', count: orders.length + 840, rate: '4.8%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Business Intelligence
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Store Analytics & Unit Economics
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Conversion metrics, gross margins, and category velocity for AuraGlass Studio.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl text-xs font-bold text-zinc-600">
          {['today', '7d', '30d', '90d', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-black text-white shadow-xs'
                  : 'hover:text-black'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-zinc-400">Total Revenue</span>
          <h3 className="text-2xl font-black text-zinc-900 mt-1">৳{totalGrossRevenue.toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+24.8% vs previous period</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-zinc-400">Estimated Gross Margin</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">৳{estProfit.toLocaleString()}</h3>
          <p className="text-[11px] text-zinc-500 mt-1">~62% net margin after glass tempering</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-zinc-400">Glass Units Sold</span>
          <h3 className="text-2xl font-black text-zinc-900 mt-1">{totalUnitsSold} Posters</h3>
          <p className="text-[11px] text-zinc-500 mt-1">Across all sizing configurations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-zinc-400">Store Conversion</span>
          <h3 className="text-2xl font-black text-rose-500 mt-1">4.8%</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+0.6% improvement</p>
        </div>
      </div>

      {/* Category Performance & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category Performance Bars */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-zinc-900">Category Revenue Distribution</h3>
          <p className="text-xs text-zinc-500">Sales volume grouped by glass art genres</p>

          <div className="space-y-3.5 pt-2">
            {categoryPerformance.map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-zinc-800">{c.name}</span>
                  <span className="font-bold text-zinc-900">৳{c.sales.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Step Conversion Funnel */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-zinc-900">E-Commerce Conversion Funnel</h3>
          <p className="text-xs text-zinc-500">Traffic drop-off from visitor to completed payment</p>

          <div className="space-y-3 pt-2">
            {conversionFunnel.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-zinc-900">{step.step}</p>
                    <p className="text-[10px] text-zinc-400">{step.count.toLocaleString()} sessions</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-black bg-white px-2 py-1 rounded-md border border-zinc-200 shadow-2xs">
                  {step.rate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
