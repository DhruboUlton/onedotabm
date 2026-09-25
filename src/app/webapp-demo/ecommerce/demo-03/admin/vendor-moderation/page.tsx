'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  Flag,
  UserX,
  UserCheck,
  Scale,
  Clock,
} from 'lucide-react';

interface VendorAuditItem {
  id: string;
  vendorName: string;
  category: string;
  infraction: string;
  severity: 'Critical' | 'Moderate' | 'Minor';
  flagDate: string;
  accountStatus: 'Active' | 'Suspended' | 'Under Investigation' | 'Warned';
}

const initialAudits: VendorAuditItem[] = [
  {
    id: 'VAUD-201',
    vendorName: 'Quantum Dynamics',
    category: 'Displays & OLED Monitors',
    infraction: 'SLA breach: 3.2% consecutive late shipment dispatch rate exceeding agreed 2.0% merchant agreement threshold.',
    severity: 'Moderate',
    flagDate: '2026-09-24',
    accountStatus: 'Under Investigation',
  },
  {
    id: 'VAUD-202',
    vendorName: 'VoltStream Energy',
    category: 'GaN Chargers & Power Banks',
    infraction: 'UL-94 fire retardancy certification renewal paper submitted 4 days past expiration date. Audit resolved.',
    severity: 'Minor',
    flagDate: '2026-09-22',
    accountStatus: 'Warned',
  },
  {
    id: 'VAUD-203',
    vendorName: 'Nexus Audio Labs (Unverified Candidate)',
    category: 'Audiophile DACs',
    infraction: 'EIN tax matching failed with IRS business registry; forged corporate incorporation articles suspected.',
    severity: 'Critical',
    flagDate: '2026-09-18',
    accountStatus: 'Suspended',
  },
];

export default function VendorModerationPage() {
  const { showToast } = useStore();
  const [audits, setAudits] = useState<VendorAuditItem[]>(initialAudits);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = audits.filter((a) => {
    const matchSearch =
      a.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.infraction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.accountStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: VendorAuditItem['accountStatus']) => {
    setAudits((prev) =>
      prev.map((a) => (a.id === id ? { ...a, accountStatus: newStatus } : a))
    );
    showToast('Merchant Audit Updated', `Audit case ${id} marked as ${newStatus}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Merchant Integrity & Moderation
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              KYC & SLA Audits
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enforce marketplace seller terms, investigate fraudulent tax credentials, and manage seller suspension holds.
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
            placeholder="Search vendor audit by name, category, or infraction..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Audit Statuses</option>
          <option value="Under Investigation">Under Investigation</option>
          <option value="Warned">Warned</option>
          <option value="Suspended">Suspended</option>
          <option value="Active">Active</option>
        </select>
      </div>

      {/* Audits Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Audit ID / Date</th>
                <th className="py-3 px-4">Merchant Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Infraction Summary</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Sanction Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.flagDate}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {item.vendorName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 max-w-[260px]">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.infraction}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.severity === 'Critical'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                          : item.severity === 'Moderate'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.accountStatus === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.accountStatus === 'Under Investigation'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : item.accountStatus === 'Warned'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.accountStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.accountStatus !== 'Suspended' ? (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Suspended')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Active')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                        >
                          Reactivate
                        </button>
                      )}
                      {item.accountStatus === 'Under Investigation' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Warned')}
                          className="px-2 py-1 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-[11px] font-semibold hover:bg-amber-50"
                        >
                          Issue Warning
                        </button>
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
