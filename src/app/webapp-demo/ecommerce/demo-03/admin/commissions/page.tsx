'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Percent,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  Download,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface CommissionRecord {
  id: string;
  orderId: string;
  vendorName: string;
  vendorSlug: string;
  productName: string;
  orderValue: number;
  commissionRate: number; // e.g. 12%
  commissionAmount: number;
  vendorEarnings: number;
  date: string;
  status: 'Settled' | 'Pending Escrow' | 'Refund Clawback';
}

const initialCommissions: CommissionRecord[] = [
  {
    id: 'COM-8821',
    orderId: 'KG-89021',
    vendorName: 'AeroTech Labs',
    vendorSlug: 'aerotech-labs',
    productName: 'AeroBlade 16 Titanium Pro',
    orderValue: 2499.00,
    commissionRate: 10,
    commissionAmount: 249.90,
    vendorEarnings: 2249.10,
    date: '2026-09-24',
    status: 'Settled',
  },
  {
    id: 'COM-8822',
    orderId: 'KG-89022',
    vendorName: 'CyberForge Systems',
    vendorSlug: 'cyberforge',
    productName: 'Valkyrie Hall-Effect Wireless Controller',
    orderValue: 179.99,
    commissionRate: 12,
    commissionAmount: 21.60,
    vendorEarnings: 158.39,
    date: '2026-09-24',
    status: 'Settled',
  },
  {
    id: 'COM-8823',
    orderId: 'KG-89023',
    vendorName: 'AudioCraft Acoustics',
    vendorSlug: 'audiocraft',
    productName: 'Aura Studio Wireless ANC Headphones',
    orderValue: 449.00,
    commissionRate: 14,
    commissionAmount: 62.86,
    vendorEarnings: 386.14,
    date: '2026-09-23',
    status: 'Settled',
  },
  {
    id: 'COM-8824',
    orderId: 'KG-89024',
    vendorName: 'VoltStream Energy',
    vendorSlug: 'voltstream',
    productName: 'VoltStation 200W GaN Desktop Charger',
    orderValue: 129.99,
    commissionRate: 15,
    commissionAmount: 19.50,
    vendorEarnings: 110.49,
    date: '2026-09-23',
    status: 'Pending Escrow',
  },
  {
    id: 'COM-8825',
    orderId: 'KG-89025',
    vendorName: 'Quantum Dynamics',
    vendorSlug: 'quantum-dynamics',
    productName: 'ApexView 34" Curved OLED Monitor',
    orderValue: 899.99,
    commissionRate: 8,
    commissionAmount: 72.00,
    vendorEarnings: 827.99,
    date: '2026-09-22',
    status: 'Pending Escrow',
  },
  {
    id: 'COM-8826',
    orderId: 'KG-89020',
    vendorName: 'AeroTech Labs',
    vendorSlug: 'aerotech-labs',
    productName: 'Zenith X1 Pro Studio 5G',
    orderValue: 1199.00,
    commissionRate: 10,
    commissionAmount: 119.90,
    vendorEarnings: 1079.10,
    date: '2026-09-21',
    status: 'Refund Clawback',
  },
];

export default function VendorCommissionsPage() {
  const { showToast } = useStore();
  const [commissions, setCommissions] = useState<CommissionRecord[]>(initialCommissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vendorFilter, setVendorFilter] = useState('ALL');

  const filtered = commissions.filter((c) => {
    const matchSearch =
      c.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchVendor = vendorFilter === 'ALL' || c.vendorName === vendorFilter;

    return matchSearch && matchStatus && matchVendor;
  });

  const totalGMV = commissions.reduce((sum, c) => sum + c.orderValue, 0);
  const totalCommission = commissions
    .filter((c) => c.status !== 'Refund Clawback')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalVendorPayouts = commissions
    .filter((c) => c.status !== 'Refund Clawback')
    .reduce((sum, c) => sum + c.vendorEarnings, 0);
  const avgTakeRate = (totalCommission / (totalGMV || 1)) * 100;

  const handleExportCSV = () => {
    showToast('Report Exported', 'Commission ledger exported as CSV spreadsheet', 'info');
  };

  const handleSettlePending = (id: string) => {
    setCommissions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Settled' } : c))
    );
    showToast('Commission Settled', `Escrow released for ${id}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Vendor Commissions
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Take-Rate Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated take-rate splits, marketplace fee attribution, and merchant escrow schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Order Volume</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalGMV.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.8% vs last month
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Marketplace Take-Rate</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            ${totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Effective blend: <span className="font-bold text-slate-700 dark:text-slate-300">{avgTakeRate.toFixed(1)}%</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vendor Net Payouts</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalVendorPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Guaranteed 7-day settlement
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Escrow</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            $91.50
          </div>
          <p className="text-[11px] text-slate-400 mt-1">2 orders under return buffer</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, vendor, product, or ledger ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Settled">Settled</option>
            <option value="Pending Escrow">Pending Escrow</option>
            <option value="Refund Clawback">Refund Clawback</option>
          </select>

          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Vendors</option>
            <option value="AeroTech Labs">AeroTech Labs</option>
            <option value="CyberForge Systems">CyberForge Systems</option>
            <option value="AudioCraft Acoustics">AudioCraft Acoustics</option>
            <option value="VoltStream Energy">VoltStream Energy</option>
            <option value="Quantum Dynamics">Quantum Dynamics</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ledger ID / Date</th>
                <th className="py-3 px-4">Order & Product</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4 text-right">Order Value</th>
                <th className="py-3 px-4 text-center">Rate</th>
                <th className="py-3 px-4 text-right">Platform Fee</th>
                <th className="py-3 px-4 text-right">Vendor Net</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No commission ledger records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{item.id}</div>
                      <div className="text-[11px] text-slate-400">{item.date}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-bold text-blue-600 dark:text-blue-400">{item.orderId}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.productName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {item.vendorName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      ${item.orderValue.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-purple-600 dark:text-purple-400">
                      {item.commissionRate}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-purple-700 dark:text-purple-300">
                      ${item.commissionAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                      ${item.vendorEarnings.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'Settled'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : item.status === 'Pending Escrow'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'Pending Escrow' && (
                        <button
                          onClick={() => handleSettlePending(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          Settle Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
