'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Building,
  Search,
  Wallet,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface VendorBalanceAccount {
  id: string;
  vendorName: string;
  vendorSlug: string;
  availableBalance: number;
  escrowPending: number;
  reserveHold: number; // 5% rolling reserve for returns
  lifetimeEarnings: number;
  payoutSchedule: 'Weekly (Every Friday)' | 'Bi-Weekly' | 'Monthly';
  nextPayoutDate: string;
  payoutReadiness: 'Ready' | 'Under Minimum Threshold' | 'Audit Hold';
}

const initialBalances: VendorBalanceAccount[] = [
  {
    id: 'BAL-101',
    vendorName: 'AeroTech Labs',
    vendorSlug: 'aerotech-labs',
    availableBalance: 14250.00,
    escrowPending: 3200.00,
    reserveHold: 1500.00,
    lifetimeEarnings: 124800.00,
    payoutSchedule: 'Weekly (Every Friday)',
    nextPayoutDate: '2026-09-29',
    payoutReadiness: 'Ready',
  },
  {
    id: 'BAL-102',
    vendorName: 'CyberForge Systems',
    vendorSlug: 'cyberforge',
    availableBalance: 6840.50,
    escrowPending: 1450.00,
    reserveHold: 650.00,
    lifetimeEarnings: 68400.00,
    payoutSchedule: 'Weekly (Every Friday)',
    nextPayoutDate: '2026-09-29',
    payoutReadiness: 'Ready',
  },
  {
    id: 'BAL-103',
    vendorName: 'AudioCraft Acoustics',
    vendorSlug: 'audiocraft',
    availableBalance: 8120.00,
    escrowPending: 2100.00,
    reserveHold: 800.00,
    lifetimeEarnings: 48900.00,
    payoutSchedule: 'Bi-Weekly',
    nextPayoutDate: '2026-10-05',
    payoutReadiness: 'Ready',
  },
  {
    id: 'BAL-104',
    vendorName: 'VoltStream Energy',
    vendorSlug: 'voltstream',
    availableBalance: 3410.00,
    escrowPending: 950.00,
    reserveHold: 350.00,
    lifetimeEarnings: 32500.00,
    payoutSchedule: 'Weekly (Every Friday)',
    nextPayoutDate: '2026-09-29',
    payoutReadiness: 'Ready',
  },
  {
    id: 'BAL-105',
    vendorName: 'Quantum Dynamics',
    vendorSlug: 'quantum-dynamics',
    availableBalance: 12500.00,
    escrowPending: 4800.00,
    reserveHold: 2000.00,
    lifetimeEarnings: 54100.00,
    payoutSchedule: 'Weekly (Every Friday)',
    nextPayoutDate: '2026-09-29',
    payoutReadiness: 'Audit Hold',
  },
];

export default function VendorBalancesPage() {
  const { showToast } = useStore();
  const [balances, setBalances] = useState<VendorBalanceAccount[]>(initialBalances);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = balances.filter((b) => {
    return (
      b.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.payoutSchedule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.payoutReadiness.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalAvailable = balances.reduce((sum, b) => sum + b.availableBalance, 0);
  const totalEscrow = balances.reduce((sum, b) => sum + b.escrowPending, 0);
  const totalReserve = balances.reduce((sum, b) => sum + b.reserveHold, 0);

  const handleTriggerManualDisbursal = (name: string, amount: number) => {
    showToast('Disbursal Initiated', `Authorized manual ACH batch of $${amount.toFixed(2)} to ${name}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Vendor Balances & Escrow Ledger
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Merchant Capital
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor merchant wallet holdings, transit escrow clearance, and rolling warranty reserve buffers.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Available for Payout</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${totalAvailable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for scheduled batch cycle</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Transit Escrow Buffer</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalEscrow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Clears 72h post delivery</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rolling Warranty Reserve</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalReserve.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">5% SLA defect safeguard</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accounts on Audit Hold</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            1 Account
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Quantum Dynamics (SLA breach review)</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor name, payout frequency, or readiness state..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Balances Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4 text-right">Available Balance</th>
                <th className="py-3 px-4 text-right">Pending Escrow</th>
                <th className="py-3 px-4 text-right">Reserve (5%)</th>
                <th className="py-3 px-4 text-right">Lifetime Earnings</th>
                <th className="py-3 px-4">Payout Frequency</th>
                <th className="py-3 px-4">Readiness Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.vendorName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{item.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    ${item.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400 font-semibold">
                    ${item.escrowPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500 font-medium">
                    ${item.reserveHold.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                    ${item.lifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <div>{item.payoutSchedule}</div>
                    <div className="text-[10px] text-slate-400">Next: {item.nextPayoutDate}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.payoutReadiness === 'Ready'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.payoutReadiness === 'Under Minimum Threshold'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.payoutReadiness}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.payoutReadiness === 'Ready' ? (
                      <button
                        onClick={() => handleTriggerManualDisbursal(item.vendorName, item.availableBalance)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                      >
                        Disburse
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">On Hold</span>
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
