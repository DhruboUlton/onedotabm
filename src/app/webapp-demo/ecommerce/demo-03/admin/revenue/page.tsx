'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  DollarSign,
  TrendingUp,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Building,
  RotateCcw,
  CreditCard,
} from 'lucide-react';

export default function RevenueFinancePage() {
  const { showToast } = useStore();
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '1y'>('30d');

  const gmv = 184500.00;
  const platformRevenue = 22140.00; // ~12% take-rate
  const vendorPayouts = 158860.00;
  const refundsTotal = 3500.00;

  const monthlyBreakdown = [
    { month: 'Apr 2026', gmv: 124000, takeRate: 14880, vendorShare: 106640, growth: '+12.4%' },
    { month: 'May 2026', gmv: 141000, takeRate: 16920, vendorShare: 121260, growth: '+13.7%' },
    { month: 'Jun 2026', gmv: 158000, takeRate: 18960, vendorShare: 135880, growth: '+12.1%' },
    { month: 'Jul 2026', gmv: 169000, takeRate: 20280, vendorShare: 145340, growth: '+7.0%' },
    { month: 'Aug 2026', gmv: 176000, takeRate: 21120, vendorShare: 151360, growth: '+4.1%' },
    { month: 'Sep 2026 (MTD)', gmv: 184500, takeRate: 22140, vendorShare: 158860, growth: '+4.8%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Platform Revenue & Gross Volume
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
              Financial Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consolidated Gross Merchandise Value (GMV), platform take-rate retention, and net ledger settlements.
          </p>
        </div>

        <button
          onClick={() => showToast('Financial Report Exported', 'Downloaded full audited P&L statement as CSV', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export P&L Statement</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Merchandise Value</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${gmv.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +16.2% vs previous quarter
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Platform Take-Rate</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${platformRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average 12.0% platform take</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Disbursed to Merchants</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${vendorPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">86.1% distributed volume</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Refunds & Clawbacks</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            ${refundsTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1.9% total transaction volume</p>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
            6-Month Fiscal Performance
          </h3>
          <span className="text-xs text-slate-400">Figures in USD ($)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4 text-right">GMV (Gross Volume)</th>
                <th className="py-3 px-4 text-right">Platform Cut (12%)</th>
                <th className="py-3 px-4 text-right">Vendor Disbursals</th>
                <th className="py-3 px-4 text-center">MoM Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {monthlyBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {row.month}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100 text-sm">
                    ${row.gmv.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    ${row.takeRate.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400">
                    ${row.vendorShare.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-[11px]">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{row.growth}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
