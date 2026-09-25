'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Flag,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  ShoppingBag,
  MessageSquare,
  Package,
  Store,
  ShieldAlert,
} from 'lucide-react';

interface UserReport {
  id: string;
  targetType: 'Product' | 'Vendor' | 'Review' | 'Order';
  targetTitle: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: 'Open' | 'Investigating' | 'Dismissed' | 'Action Taken';
}

const initialReports: UserReport[] = [
  {
    id: 'REP-801',
    targetType: 'Review',
    targetTitle: 'Review on AeroBlade 16 ("Complete scam, do not buy")',
    reportedBy: 'AeroTech Labs (Vendor)',
    reason: 'Suspected competitor smear campaign; reviewer never purchased this model.',
    date: '2026-09-24',
    status: 'Open',
  },
  {
    id: 'REP-802',
    targetType: 'Product',
    targetTitle: 'ApexView 34" Curved OLED Monitor',
    reportedBy: 'Marcus Vance (Customer)',
    reason: 'Product specification claims 240Hz refresh rate, but HDMI 2.0 port only supports 144Hz.',
    date: '2026-09-23',
    status: 'Investigating',
  },
  {
    id: 'REP-803',
    targetType: 'Vendor',
    targetTitle: 'Quantum Dynamics',
    reportedBy: 'David Kim (Customer)',
    reason: 'Merchant ignored 3 support queries regarding delayed tracking generation.',
    date: '2026-09-21',
    status: 'Action Taken',
  },
  {
    id: 'REP-804',
    targetType: 'Order',
    targetTitle: 'Order #KG-89020',
    reportedBy: 'Finance Automations Bot',
    reason: 'Repeated credit card CVV mismatches from Russian IP range.',
    date: '2026-09-20',
    status: 'Dismissed',
  },
];

export default function ReportsComplaintsPage() {
  const { showToast } = useStore();
  const [reports, setReports] = useState<UserReport[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.targetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'ALL' || r.targetType === typeFilter;
    return matchSearch && matchType;
  });

  const handleResolve = (id: string, newStatus: UserReport['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast('Report Status Updated', `Report ${id} marked as "${newStatus}"`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Community Reports & Complaints
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
              {reports.filter((r) => r.status === 'Open').length} Open Reports
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Triage user-submitted grievances across catalog products, merchant conduct, fake reviews, and fraudulent orders.
          </p>
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
            placeholder="Search report by subject, filer, or complaint details..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Entity Types</option>
          <option value="Product">Products</option>
          <option value="Vendor">Vendors</option>
          <option value="Review">Reviews</option>
          <option value="Order">Orders</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Report ID / Date</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Complaint Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.date}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-[200px]">
                    <div className="truncate">{item.targetTitle}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      {item.targetType === 'Product' && <Package className="w-3.5 h-3.5 text-blue-500" />}
                      {item.targetType === 'Vendor' && <Store className="w-3.5 h-3.5 text-purple-500" />}
                      {item.targetType === 'Review' && <MessageSquare className="w-3.5 h-3.5 text-amber-500" />}
                      {item.targetType === 'Order' && <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>{item.targetType}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {item.reportedBy}
                  </td>
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.reason}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Open'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                          : item.status === 'Investigating'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                          : item.status === 'Action Taken'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status === 'Open' && (
                        <>
                          <button
                            onClick={() => handleResolve(item.id, 'Action Taken')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                          >
                            Take Action
                          </button>
                          <button
                            onClick={() => handleResolve(item.id, 'Dismissed')}
                            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 hover:bg-slate-50"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                      {item.status === 'Investigating' && (
                        <button
                          onClick={() => handleResolve(item.id, 'Action Taken')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                        >
                          Resolve
                        </button>
                      )}
                      {(item.status === 'Action Taken' || item.status === 'Dismissed') && (
                        <span className="text-[11px] font-semibold text-slate-400">Resolved</span>
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
