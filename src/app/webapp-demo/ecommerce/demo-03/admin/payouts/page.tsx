'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Wallet,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Building,
  CreditCard,
  ArrowUpRight,
  Filter,
  DollarSign,
  Download,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';

interface PayoutRequest {
  id: string;
  vendorName: string;
  vendorSlug: string;
  availableBalance: number;
  requestedAmount: number;
  paymentMethod: string;
  accountDetails: string;
  requestDate: string;
  status: 'Pending' | 'Processing' | 'Paid' | 'Failed';
  processedDate?: string;
  referenceNo?: string;
}

const initialPayouts: PayoutRequest[] = [
  {
    id: 'PAY-4091',
    vendorName: 'AeroTech Labs',
    vendorSlug: 'aerotech-labs',
    availableBalance: 14250.00,
    requestedAmount: 5000.00,
    paymentMethod: 'Direct ACH Wire',
    accountDetails: 'Chase Bank •••• 4892',
    requestDate: '2026-09-25',
    status: 'Pending',
  },
  {
    id: 'PAY-4092',
    vendorName: 'CyberForge Systems',
    vendorSlug: 'cyberforge',
    availableBalance: 6840.50,
    requestedAmount: 3500.00,
    paymentMethod: 'Stripe Connect Payout',
    accountDetails: 'acct_1M687CYB...',
    requestDate: '2026-09-24',
    status: 'Processing',
  },
  {
    id: 'PAY-4093',
    vendorName: 'AudioCraft Acoustics',
    vendorSlug: 'audiocraft',
    availableBalance: 8120.00,
    requestedAmount: 4200.00,
    paymentMethod: 'Direct ACH Wire',
    accountDetails: 'Wells Fargo •••• 9104',
    requestDate: '2026-09-23',
    status: 'Paid',
    processedDate: '2026-09-24',
    referenceNo: 'ACH-9948271',
  },
  {
    id: 'PAY-4094',
    vendorName: 'VoltStream Energy',
    vendorSlug: 'voltstream',
    availableBalance: 3410.00,
    requestedAmount: 2000.00,
    paymentMethod: 'PayPal Business',
    accountDetails: 'payouts@voltstreamenergy.io',
    requestDate: '2026-09-22',
    status: 'Paid',
    processedDate: '2026-09-23',
    referenceNo: 'PP-7839120',
  },
  {
    id: 'PAY-4095',
    vendorName: 'Quantum Dynamics',
    vendorSlug: 'quantum-dynamics',
    availableBalance: 12500.00,
    requestedAmount: 6000.00,
    paymentMethod: 'SWIFT International',
    accountDetails: 'UBS Zurich •••• 1109',
    requestDate: '2026-09-21',
    status: 'Failed',
    processedDate: '2026-09-22',
    referenceNo: 'ERR-INVALID-IBAN',
  },
];

export default function PayoutsSettlementsPage() {
  const { showToast } = useStore();
  const [payouts, setPayouts] = useState<PayoutRequest[]>(initialPayouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = payouts.filter((p) => {
    const matchSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.accountDetails.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPending = payouts
    .filter((p) => p.status === 'Pending' || p.status === 'Processing')
    .reduce((sum, p) => sum + p.requestedAmount, 0);

  const totalDisbursed = payouts
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.requestedAmount, 0);

  const handleUpdateStatus = (id: string, newStatus: PayoutRequest['status']) => {
    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          status: newStatus,
          processedDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : p.processedDate,
          referenceNo: newStatus === 'Paid' ? `ACH-${Math.floor(1000000 + Math.random() * 9000000)}` : p.referenceNo,
        };
      })
    );

    showToast('Payout Status Updated', `Disbursement ${id} marked as ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Payouts & Settlements
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
              Escrow Disbursals
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authorize ACH transfers, Stripe merchant balances, and weekly batch payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Batch Dispatch Queued', '3 pending payouts queued for overnight ACH transmission', 'info')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Process Batch ACH</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Authorization</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">2 requests requiring sign-off</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Disbursed MTD</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalDisbursed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% on-time settlement</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Escrow Reserved</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            $45,120.50
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 12 verified merchant accounts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Failed / Flagged</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            $6,000.00
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">1 international wire bounced</p>
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
            placeholder="Search payout ID, vendor, or bank account..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Payouts Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Payout ID / Date</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Available Balance</th>
                <th className="py-3 px-4 text-right">Requested</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Ref / Note</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payout records found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{item.id}</div>
                      <div className="text-[11px] text-slate-400">{item.requestDate}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {item.vendorName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{item.paymentMethod}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.accountDetails}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-500 dark:text-slate-400">
                      ${item.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100 text-sm">
                      ${item.requestedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'Paid'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : item.status === 'Processing'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : item.status === 'Pending'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {item.referenceNo || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'Processing')}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'Failed')}
                              className="px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {item.status === 'Processing' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Paid')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                        {item.status === 'Failed' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Pending')}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
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
