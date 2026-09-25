'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Package,
  User,
  Building,
  ArrowRight,
  Filter,
  Check,
  X,
} from 'lucide-react';

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  vendorName: string;
  reason: string;
  refundAmount: number;
  requestDate: string;
  status: 'Requested' | 'Reviewing' | 'Approved' | 'Rejected' | 'Refunded' | 'Completed';
}

const initialReturns: ReturnRequest[] = [
  {
    id: 'RET-1091',
    orderId: 'KG-89021',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techlabs.io',
    productName: 'AeroBlade 16 Titanium Pro',
    vendorName: 'AeroTech Labs',
    reason: 'Defective trackpad firmware calibration',
    refundAmount: 2499.00,
    requestDate: '2026-09-24',
    status: 'Requested',
  },
  {
    id: 'RET-1092',
    orderId: 'KG-89023',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designworks.com',
    productName: 'Aura Studio Wireless ANC Headphones',
    vendorName: 'AudioCraft Acoustics',
    reason: 'Ordered incorrect ear cup leather colorway',
    refundAmount: 449.00,
    requestDate: '2026-09-23',
    status: 'Reviewing',
  },
  {
    id: 'RET-1093',
    orderId: 'KG-89018',
    customerName: 'David Kim',
    customerEmail: 'david.kim@streamerhub.gg',
    productName: 'Valkyrie Hall-Effect Wireless Controller',
    vendorName: 'CyberForge Systems',
    reason: 'Unopened box, buyer preference change',
    refundAmount: 179.99,
    requestDate: '2026-09-22',
    status: 'Approved',
  },
  {
    id: 'RET-1094',
    orderId: 'KG-89014',
    customerName: 'Chloe Bennett',
    customerEmail: 'chloe.b@creativecorp.org',
    productName: 'VoltStation 200W GaN Desktop Charger',
    vendorName: 'VoltStream Energy',
    reason: 'Customer claims box was unsealed; inspection verified intact',
    refundAmount: 129.99,
    requestDate: '2026-09-20',
    status: 'Rejected',
  },
  {
    id: 'RET-1095',
    orderId: 'KG-89010',
    customerName: 'Jonathan Hayes',
    customerEmail: 'jhayes@soundeng.net',
    productName: 'ApexView 34" Curved OLED Monitor',
    vendorName: 'Quantum Dynamics',
    reason: 'Sub-pixel dead cluster on right edge',
    refundAmount: 899.99,
    requestDate: '2026-09-18',
    status: 'Refunded',
  },
];

export default function ReturnsRefundsPage() {
  const { showToast } = useStore();
  const [returns, setReturns] = useState<ReturnRequest[]>(initialReturns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = returns.filter((r) => {
    const matchSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRefunded = returns
    .filter((r) => r.status === 'Refunded' || r.status === 'Completed')
    .reduce((sum, r) => sum + r.refundAmount, 0);

  const totalPending = returns
    .filter((r) => r.status === 'Requested' || r.status === 'Reviewing' || r.status === 'Approved')
    .reduce((sum, r) => sum + r.refundAmount, 0);

  const handleUpdateStatus = (id: string, newStatus: ReturnRequest['status']) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast('Return RMA Updated', `RMA #${id} status changed to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Returns & RMA Refunds
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
              Dispute Resolution
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage customer return merchandise authorizations (RMA), warehouse inspection approvals, and ledger refunds.
          </p>
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
          <p className="text-[11px] text-slate-400 mt-1">3 active customer claims</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Refunded MTD</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalRefunded.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Credited back to payment source</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mean Resolution Time</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            22.4 Hours
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Target SLA &lt; 48 hours</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Claim Rejection Ratio</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            4.2%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Primarily buyer remorse outside 30-day</p>
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
            placeholder="Search RMA ID, order ID, customer, product, or vendor..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Requested">Requested</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Approved">Approved</option>
          <option value="Refunded">Refunded</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* RMA Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">RMA / Order</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product & Vendor</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4 text-right">Refund Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.id}</div>
                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{item.orderId}</div>
                    <div className="text-[10px] text-slate-400">{item.requestDate}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.customerName}</div>
                    <div className="text-[11px] text-slate-400">{item.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{item.productName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{item.vendorName}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-[220px]">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                      "{item.reason}"
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-sm text-slate-900 dark:text-slate-100">
                    ${item.refundAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Refunded' || item.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : item.status === 'Approved'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : item.status === 'Reviewing' || item.status === 'Requested'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status === 'Requested' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                            className="px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {item.status === 'Reviewing' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Approved')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors"
                        >
                          Pass Inspection
                        </button>
                      )}
                      {item.status === 'Approved' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Refunded')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          Execute Refund
                        </button>
                      )}
                      {(item.status === 'Refunded' || item.status === 'Rejected') && (
                        <span className="text-[11px] font-semibold text-slate-400">Archived</span>
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
