'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Flag,
  ShieldCheck,
  Building,
  Package,
} from 'lucide-react';

interface ProductModerationItem {
  id: string;
  productName: string;
  vendorName: string;
  flagReason: string;
  flagType: 'Misleading Technical Specs' | 'Unverified CE/FCC Compliance' | 'Counterfeit IP Risk' | 'Pricing Glitch';
  severity: 'High' | 'Medium' | 'Low';
  reportedDate: string;
  status: 'Pending Review' | 'Cleared' | 'Taken Down' | 'Changes Demanded';
}

const initialModerationItems: ProductModerationItem[] = [
  {
    id: 'PMOD-101',
    productName: 'Zenith X1 Pro Studio 5G (Grey Market Edition)',
    vendorName: 'AeroTech Labs',
    flagReason: 'Vendor listed global band compatibility without band 71 / mmWave regional certification documentation.',
    flagType: 'Unverified CE/FCC Compliance',
    severity: 'High',
    reportedDate: '2026-09-24',
    status: 'Pending Review',
  },
  {
    id: 'PMOD-102',
    productName: 'Vortex Falcon 4K Gimbal Drone Kit',
    vendorName: 'CyberForge Systems',
    flagReason: 'Claimed 48-minute flight time, customer benchmark tests average 28 minutes under normal payload.',
    flagType: 'Misleading Technical Specs',
    severity: 'Medium',
    reportedDate: '2026-09-23',
    status: 'Pending Review',
  },
  {
    id: 'PMOD-103',
    productName: 'UltraFast GaN 300W SuperStation',
    vendorName: 'VoltStream Energy',
    flagReason: 'Pricing anomaly: Item listed at $12.99 instead of $129.99 MSRP due to vendor CSV upload comma displacement.',
    flagType: 'Pricing Glitch',
    severity: 'High',
    reportedDate: '2026-09-22',
    status: 'Taken Down',
  },
  {
    id: 'PMOD-104',
    productName: 'Aura Studio Wireless ANC Pro Edition',
    vendorName: 'AudioCraft Acoustics',
    flagReason: 'Patent trademark challenge filed by third-party acoustic group regarding "Aura" branding.',
    flagType: 'Counterfeit IP Risk',
    severity: 'Low',
    reportedDate: '2026-09-19',
    status: 'Cleared',
  },
];

export default function ProductModerationPage() {
  const { showToast } = useStore();
  const [items, setItems] = useState<ProductModerationItem[]>(initialModerationItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = items.filter((item) => {
    const matchSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.flagType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: ProductModerationItem['status']) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    showToast('Moderation Decision Recorded', `Product flag ${id} updated to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Product Compliance & Moderation
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
              Audit Queue
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Investigate technical spec discrepancies, verify regulatory CE/FCC filings, and protect catalog integrity.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Flags Awaiting Audit</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            {items.filter((i) => i.status === 'Pending Review').length} Items
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires engineering spec check</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quarantined / Taken Down</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            1 Listing
          </div>
          <p className="text-[11px] text-slate-400 mt-1">De-listed from search index</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cleared Compliance</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            98.5%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Catalog cleanliness benchmark</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mean Triage Speed</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            4.2 Hours
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Fast turn-around SLA</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search flagged product, vendor name, or violation type..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Cleared">Cleared</option>
          <option value="Taken Down">Taken Down</option>
          <option value="Changes Demanded">Changes Demanded</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Flag ID / Date</th>
                <th className="py-3 px-4">Flagged Product</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Violation Category</th>
                <th className="py-3 px-4">Investigation Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.reportedDate}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-[200px]">
                    <div className="truncate">{item.productName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {item.vendorName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-rose-600 dark:text-rose-400">
                    {item.flagType}
                  </td>
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.flagReason}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Cleared'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'Pending Review'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status === 'Pending Review' ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Cleared')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Taken Down')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                          >
                            Take Down
                          </button>
                        </>
                      ) : item.status === 'Taken Down' ? (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Cleared')}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold hover:bg-slate-50 transition-colors"
                        >
                          Reinstate
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">Audited</span>
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
