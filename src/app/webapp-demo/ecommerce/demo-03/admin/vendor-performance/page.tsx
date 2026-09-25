'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Activity,
  Star,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  ShieldCheck,
  TrendingUp,
  Award,
} from 'lucide-react';

interface VendorScorecard {
  id: string;
  name: string;
  slug: string;
  category: string;
  fulfillmentScore: number; // 0-100
  onTimeDispatch: number; // %
  returnRate: number; // %
  rating: number; // 0-5
  cancellationRate: number; // %
  totalOrders: number;
  badge: 'Elite Partner' | 'Standard' | 'Watchlist' | 'Probation';
}

const initialScorecards: VendorScorecard[] = [
  {
    id: 'ven-aerotech',
    name: 'AeroTech Labs',
    slug: 'aerotech-labs',
    category: 'Laptops & Workstations',
    fulfillmentScore: 98,
    onTimeDispatch: 99.4,
    returnRate: 1.2,
    rating: 4.9,
    cancellationRate: 0.1,
    totalOrders: 1420,
    badge: 'Elite Partner',
  },
  {
    id: 'ven-cyberforge',
    name: 'CyberForge Systems',
    slug: 'cyberforge',
    category: 'Gaming Gear & Controllers',
    fulfillmentScore: 95,
    onTimeDispatch: 97.8,
    returnRate: 2.1,
    rating: 4.8,
    cancellationRate: 0.4,
    totalOrders: 890,
    badge: 'Elite Partner',
  },
  {
    id: 'ven-audiocraft',
    name: 'AudioCraft Acoustics',
    slug: 'audiocraft',
    category: 'Audiophile & ANC',
    fulfillmentScore: 93,
    onTimeDispatch: 96.2,
    returnRate: 2.8,
    rating: 4.7,
    cancellationRate: 0.8,
    totalOrders: 640,
    badge: 'Standard',
  },
  {
    id: 'ven-voltstream',
    name: 'VoltStream Energy',
    slug: 'voltstream',
    category: 'GaN Chargers & Power Banks',
    fulfillmentScore: 96,
    onTimeDispatch: 98.9,
    returnRate: 0.9,
    rating: 4.9,
    cancellationRate: 0.2,
    totalOrders: 1120,
    badge: 'Elite Partner',
  },
  {
    id: 'ven-quantum',
    name: 'Quantum Dynamics',
    slug: 'quantum-dynamics',
    category: 'Displays & OLED Monitors',
    fulfillmentScore: 84,
    onTimeDispatch: 89.1,
    returnRate: 4.6,
    rating: 4.3,
    cancellationRate: 2.1,
    totalOrders: 430,
    badge: 'Watchlist',
  },
];

export default function VendorPerformancePage() {
  const { showToast } = useStore();
  const [scorecards, setScorecards] = useState<VendorScorecard[]>(initialScorecards);
  const [searchTerm, setSearchTerm] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('ALL');

  const filtered = scorecards.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBadge = badgeFilter === 'ALL' || s.badge === badgeFilter;
    return matchSearch && matchBadge;
  });

  const handleIssueWarning = (name: string) => {
    showToast('Performance Notice Issued', `SLA remediation notice dispatched to ${name}`, 'warning');
  };

  const handlePromoteBadge = (id: string) => {
    setScorecards((prev) =>
      prev.map((s) => (s.id === id ? { ...s, badge: 'Elite Partner' } : s))
    );
    showToast('Partner Tier Upgraded', 'Vendor assigned Elite Partner status with fee perks', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Vendor SLA & Performance
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Merchant Scorecards
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time fulfillment compliance, dispatch speed, customer satisfaction, and dispute ratios.
          </p>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform On-Time Dispatch</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            97.6%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +1.2% over target SLA (96%)
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mean Merchant CSAT</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            4.82 <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on 3,420 customer verified reviews</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Return Rate</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            1.8%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Well under 3.5% consumer tech benchmark</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Watchlist Merchants</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            1 Vendor
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Quantum Dynamics (SLA &lt; 90%)</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor by name or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Tiers</option>
          <option value="Elite Partner">Elite Partner</option>
          <option value="Standard">Standard</option>
          <option value="Watchlist">Watchlist</option>
        </select>
      </div>

      {/* Performance Scorecard Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Merchant & Category</th>
                <th className="py-3 px-4 text-center">Fulfillment SLA</th>
                <th className="py-3 px-4 text-center">On-Time Dispatch</th>
                <th className="py-3 px-4 text-center">Return Rate</th>
                <th className="py-3 px-4 text-center">Customer Rating</th>
                <th className="py-3 px-4 text-right">Orders Fulfilled</th>
                <th className="py-3 px-4 text-center">Tier Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.badge === 'Elite Partner' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{item.category}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 font-bold">
                      <span className={item.fulfillmentScore >= 95 ? 'text-emerald-600' : item.fulfillmentScore >= 90 ? 'text-blue-600' : 'text-rose-600'}>
                        {item.fulfillmentScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className={item.onTimeDispatch >= 96 ? 'text-emerald-600' : 'text-rose-600'}>
                      {item.onTimeDispatch}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className={item.returnRate <= 2.5 ? 'text-emerald-600' : 'text-amber-600'}>
                      {item.returnRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.rating}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                    {item.totalOrders.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.badge === 'Elite Partner'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : item.badge === 'Standard'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.badge === 'Watchlist' ? (
                        <button
                          onClick={() => handleIssueWarning(item.name)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          Issue Warning
                        </button>
                      ) : item.badge === 'Standard' ? (
                        <button
                          onClick={() => handlePromoteBadge(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          Promote
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600">Compliant</span>
                      )}
                    </div>
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
