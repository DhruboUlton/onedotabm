'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Percent,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Building,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  orderId: string;
  date: string;
  vendorName: string;
  grossAmount: number;
  feePercentage: number;
  platformFee: number;
  netVendorShare: number;
  status: 'Settled' | 'In Escrow' | 'Clawback';
}

const initialLedger: LedgerEntry[] = [
  { id: 'LED-7801', orderId: 'KG-89021', date: '2026-09-24', vendorName: 'AeroTech Labs', grossAmount: 2499.00, feePercentage: 10, platformFee: 249.90, netVendorShare: 2249.10, status: 'Settled' },
  { id: 'LED-7802', orderId: 'KG-89022', date: '2026-09-24', vendorName: 'CyberForge Systems', grossAmount: 179.99, feePercentage: 12, platformFee: 21.60, netVendorShare: 158.39, status: 'Settled' },
  { id: 'LED-7803', orderId: 'KG-89023', date: '2026-09-23', vendorName: 'AudioCraft Acoustics', grossAmount: 449.00, feePercentage: 14, platformFee: 62.86, netVendorShare: 386.14, status: 'Settled' },
  { id: 'LED-7804', orderId: 'KG-89024', date: '2026-09-23', vendorName: 'VoltStream Energy', grossAmount: 129.99, feePercentage: 15, platformFee: 19.50, netVendorShare: 110.49, status: 'In Escrow' },
  { id: 'LED-7805', orderId: 'KG-89025', date: '2026-09-22', vendorName: 'Quantum Dynamics', grossAmount: 899.99, feePercentage: 8, platformFee: 72.00, netVendorShare: 827.99, status: 'In Escrow' },
  { id: 'LED-7806', orderId: 'KG-89020', date: '2026-09-21', vendorName: 'AeroTech Labs', grossAmount: 1199.00, feePercentage: 10, platformFee: 119.90, netVendorShare: 1079.10, status: 'Clawback' },
];

export default function FinanceCommissionLedgerPage() {
  const { showToast } = useStore();
  const [entries, setEntries] = useState<LedgerEntry[]>(initialLedger);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = entries.filter((e) => {
    const matchSearch =
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSettle = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Settled' } : e))
    );
    showToast('Ledger Settled', `Escrow release executed for entry ${id}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Commission Ledger
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300">
              Take-Rate Journal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Auditable per-transaction fee breakdown, escrow holding schedules, and clawback adjustments.
          </p>
        </div>

        <button
          onClick={() => showToast('Export Complete', 'Exported commission journal to XLSX', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export XLSX</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ledger ID, order ID, or vendor name..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Entries</option>
          <option value="Settled">Settled</option>
          <option value="In Escrow">In Escrow</option>
          <option value="Clawback">Clawback</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ledger ID / Date</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4 text-right">Gross GMV</th>
                <th className="py-3 px-4 text-center">Fee %</th>
                <th className="py-3 px-4 text-right">Platform Fee</th>
                <th className="py-3 px-4 text-right">Vendor Share</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.date}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                    {item.orderId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 dark:text-slate-100 font-semibold">
                    {item.vendorName}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-900 dark:text-slate-100 font-bold">
                    ${item.grossAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-purple-600 dark:text-purple-400">
                    {item.feePercentage}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-purple-600 dark:text-purple-400">
                    ${item.platformFee.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                    ${item.netVendorShare.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Settled'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'In Escrow'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'In Escrow' ? (
                      <button
                        onClick={() => handleSettle(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                      >
                        Release
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">Locked</span>
                    )}
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
