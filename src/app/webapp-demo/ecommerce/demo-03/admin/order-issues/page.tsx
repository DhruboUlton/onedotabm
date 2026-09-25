'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  AlertCircle,
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  PackageX,
  Truck,
  DollarSign,
  User,
  Building,
  RefreshCw,
} from 'lucide-react';

interface OrderIssue {
  id: string;
  orderId: string;
  customerName: string;
  vendorName: string;
  issueType: 'Damaged in Transit' | 'Incorrect Variant' | 'Lost by Carrier' | 'Missing Accessories';
  severity: 'Critical' | 'Medium' | 'Low';
  description: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  filedDate: string;
  resolution?: string;
}

const initialIssues: OrderIssue[] = [
  {
    id: 'ISS-701',
    orderId: 'KG-89021',
    customerName: 'Marcus Vance',
    vendorName: 'AeroTech Labs',
    issueType: 'Damaged in Transit',
    severity: 'Critical',
    description: 'Outer carton crushed; OLED panel showing cracked corner under bubble wrap.',
    status: 'Open',
    filedDate: '2026-09-24',
  },
  {
    id: 'ISS-702',
    orderId: 'KG-89019',
    customerName: 'Aaliyah Patel',
    vendorName: 'CyberForge Systems',
    issueType: 'Incorrect Variant',
    severity: 'Medium',
    description: 'Customer ordered White / Hall-Effect Trigger edition; received Onyx Black Standard edition.',
    status: 'Investigating',
    filedDate: '2026-09-23',
  },
  {
    id: 'ISS-703',
    orderId: 'KG-89015',
    customerName: 'Carlos Mendez',
    vendorName: 'VoltStream Energy',
    issueType: 'Lost by Carrier',
    severity: 'Critical',
    description: 'Tracking stuck at Chicago freight sorting depot for 6 consecutive days without movement scan.',
    status: 'Open',
    filedDate: '2026-09-22',
  },
  {
    id: 'ISS-704',
    orderId: 'KG-89012',
    customerName: 'Sophia Lin',
    vendorName: 'AudioCraft Acoustics',
    issueType: 'Missing Accessories',
    severity: 'Low',
    description: 'Braided 3.5mm to 6.35mm gold adapter missing from original retail sleeve.',
    status: 'Resolved',
    filedDate: '2026-09-20',
    resolution: 'Vendor shipped replacement accessory kit via Priority Mail (Tracking #USPS-9921)',
  },
];

export default function OrderIssuesPage() {
  const { showToast } = useStore();
  const [issues, setIssues] = useState<OrderIssue[]>(initialIssues);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filtered = issues.filter((i) => {
    const matchSearch =
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.issueType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchSeverity = severityFilter === 'ALL' || i.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const handleResolve = (id: string, actionType: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'Resolved',
              resolution: `Admin resolved via ${actionType} on ${new Date().toISOString().split('T')[0]}`,
            }
          : i
      )
    );
    showToast('Issue Resolved', `Dispute ${id} marked as resolved (${actionType})`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Order Issues & Exceptions
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
              Dispute Triage
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resolve freight damage claims, incorrect variant dispatches, and lost package carrier indemnifications.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Incidents</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            {issues.filter((i) => i.status === 'Open' || i.status === 'Investigating').length} Active
          </div>
          <p className="text-[11px] text-slate-400 mt-1">2 critical severity</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Carrier Loss Claims</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            $129.99
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Carrier insurance claim filed</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolution SLA</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            18.5 Hours
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Exceeding 24h marketplace SLA</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolved Ratio</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            92.8%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">First-contact resolution rate</p>
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
            placeholder="Search dispute ID, order ID, customer, or issue type..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Issues Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Issue ID / Date</th>
                <th className="py-3 px-4">Order & Customer</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Issue Category</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.id}</div>
                    <div className="text-[11px] text-slate-400">{item.filedDate}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-blue-600 dark:text-blue-400">{item.orderId}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">{item.customerName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {item.vendorName}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.issueType}
                  </td>
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                    {item.resolution && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                        ✓ {item.resolution}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.severity === 'Critical'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          : item.severity === 'Medium'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'Investigating'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status !== 'Resolved' ? (
                        <>
                          <button
                            onClick={() => handleResolve(item.id, 'Replacement Unit')}
                            className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-colors"
                          >
                            Re-ship
                          </button>
                          <button
                            onClick={() => handleResolve(item.id, 'Partial Refund')}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors"
                          >
                            Refund
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">Closed</span>
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
