'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  ArrowLeftRight,
  Search,
  Filter,
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  DollarSign,
} from 'lucide-react';

interface GatewayTx {
  id: string;
  gatewayTxId: string;
  gateway: 'Stripe Payments' | 'Apple Pay / Touch ID' | 'PayPal Checkout' | 'Cash on Delivery';
  orderId: string;
  customerName: string;
  amount: number;
  gatewayFee: number;
  netSettled: number;
  timestamp: string;
  status: 'Captured' | 'Pending Auth' | 'Refunded' | 'Failed';
}

const initialTransactions: GatewayTx[] = [
  {
    id: 'TXN-901',
    gatewayTxId: 'ch_3M4819xZ482910',
    gateway: 'Stripe Payments',
    orderId: 'KG-89021',
    customerName: 'Marcus Vance',
    amount: 2499.00,
    gatewayFee: 72.77, // 2.9% + 30c
    netSettled: 2426.23,
    timestamp: '2026-09-24 14:32:11',
    status: 'Captured',
  },
  {
    id: 'TXN-902',
    gatewayTxId: 'apl_99210283401',
    gateway: 'Apple Pay / Touch ID',
    orderId: 'KG-89022',
    customerName: 'David Kim',
    amount: 179.99,
    gatewayFee: 5.52,
    netSettled: 174.47,
    timestamp: '2026-09-24 11:15:04',
    status: 'Captured',
  },
  {
    id: 'TXN-903',
    gatewayTxId: 'PAYID-M991823-PP',
    gateway: 'PayPal Checkout',
    orderId: 'KG-89023',
    customerName: 'Elena Rostova',
    amount: 449.00,
    gatewayFee: 15.96, // 3.49% + 49c
    netSettled: 433.04,
    timestamp: '2026-09-23 18:40:22',
    status: 'Captured',
  },
  {
    id: 'TXN-904',
    gatewayTxId: 'COD-OFFLINE-89024',
    gateway: 'Cash on Delivery',
    orderId: 'KG-89024',
    customerName: 'Chloe Bennett',
    amount: 129.99,
    gatewayFee: 0.00,
    netSettled: 129.99,
    timestamp: '2026-09-23 09:21:40',
    status: 'Pending Auth',
  },
  {
    id: 'TXN-905',
    gatewayTxId: 're_1892019482',
    gateway: 'Stripe Payments',
    orderId: 'KG-89020',
    customerName: 'AeroTech Customer',
    amount: 1199.00,
    gatewayFee: 0.00,
    netSettled: -1199.00,
    timestamp: '2026-09-21 16:02:18',
    status: 'Refunded',
  },
];

export default function TransactionsFinancePage() {
  const { showToast } = useStore();
  const [transactions, setTransactions] = useState<GatewayTx[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('ALL');

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gatewayTxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGateway = gatewayFilter === 'ALL' || t.gateway === gatewayFilter;
    return matchSearch && matchGateway;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Gateway Transactions Log
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Payment Rails
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Raw payment gateway capture logs, merchant discount rate (MDR) deductions, and net settled amounts.
          </p>
        </div>

        <button
          onClick={() => showToast('Exported Logs', 'Downloaded gateway settlement logs as CSV', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Gateway Log</span>
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
            placeholder="Search by transaction ID, charge ID, order ID, or customer..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={gatewayFilter}
          onChange={(e) => setGatewayFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Gateways</option>
          <option value="Stripe Payments">Stripe Payments</option>
          <option value="Apple Pay / Touch ID">Apple Pay / Touch ID</option>
          <option value="PayPal Checkout">PayPal Checkout</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">TXN / Charge ID</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Order ID & Customer</th>
                <th className="py-3 px-4 text-right">Gross Amount</th>
                <th className="py-3 px-4 text-right">MDR Fee</th>
                <th className="py-3 px-4 text-right">Net Settled</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate max-w-[140px]">{item.gatewayTxId}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {item.gateway}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-blue-600 dark:text-blue-400">{item.orderId}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">{item.customerName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                    ${item.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-600 dark:text-rose-400 font-medium">
                    -${item.gatewayFee.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    ${item.netSettled.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {item.timestamp}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Captured'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'Pending Auth'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.status}
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
