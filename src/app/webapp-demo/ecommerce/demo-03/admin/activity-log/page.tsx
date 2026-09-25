'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Shield,
  Layers,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  module: 'Catalog' | 'Marketplace' | 'Orders' | 'Finance' | 'Moderation' | 'System';
  timestamp: string;
  ipAddress: string;
  result: 'Success' | 'Warning' | 'Blocked';
}

const initialLogs: AuditLogEntry[] = [
  { id: 'LOG-9001', adminName: 'Devon Bradley', adminEmail: 'd.bradley@kineticgear.internal', action: 'Approved ACH Payout #PAY-4091 ($5,000.00 to AeroTech Labs)', module: 'Finance', timestamp: '2026-09-25 14:10:02 UTC', ipAddress: '198.51.100.24', result: 'Success' },
  { id: 'LOG-9002', adminName: 'Siddharth Rao', adminEmail: 's.rao@kineticgear.internal', action: 'Approved vendor product listing "AeroBlade 16 Titanium Pro"', module: 'Catalog', timestamp: '2026-09-25 11:42:15 UTC', ipAddress: '198.51.100.89', result: 'Success' },
  { id: 'LOG-9003', adminName: 'Julian Foster', adminEmail: 'j.foster@kineticgear.internal', action: 'Quarantined flagged SKU #PMOD-103 due to CSV pricing glitch', module: 'Moderation', timestamp: '2026-09-24 16:22:40 UTC', ipAddress: '203.0.113.12', result: 'Warning' },
  { id: 'LOG-9004', adminName: 'Carlos Mendez', adminEmail: 'c.mendez@kineticgear.internal', action: 'Advanced Order #KG-89021 status from Processing to Shipped', module: 'Orders', timestamp: '2026-09-24 09:15:33 UTC', ipAddress: '198.51.100.41', result: 'Success' },
  { id: 'LOG-9005', adminName: 'Devon Bradley', adminEmail: 'd.bradley@kineticgear.internal', action: 'Adjusted free shipping cart threshold from $75 to $50', module: 'System', timestamp: '2026-09-23 18:30:19 UTC', ipAddress: '198.51.100.24', result: 'Success' },
  { id: 'LOG-9006', adminName: 'Unknown Automated Session', adminEmail: 'sec-scanner@bot.local', action: 'Failed 2FA challenge attempt for user award.suspicious@tempmail.xyz', module: 'System', timestamp: '2026-09-23 03:12:08 UTC', ipAddress: '185.220.101.5', result: 'Blocked' },
];

export default function ActivityLogPage() {
  const { showToast } = useStore();
  const [logs, setLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = moduleFilter === 'ALL' || l.module === moduleFilter;
    return matchSearch && matchModule;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              System Audit Trail & Activity Log
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Immutable Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time compliance logging of administrative actions, payouts authorization, and catalog mutations.
          </p>
        </div>

        <button
          onClick={() => showToast('Audit Logs Exported', 'Downloaded encrypted immutable audit archive', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Audit Archive</span>
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
            placeholder="Search audit trail by operator, action keywords, or log ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Modules</option>
          <option value="Catalog">Catalog</option>
          <option value="Marketplace">Marketplace</option>
          <option value="Orders">Orders</option>
          <option value="Finance">Finance</option>
          <option value="Moderation">Moderation</option>
          <option value="System">System</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Log ID / Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action Summary</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.adminName}</div>
                    <div className="text-[11px] text-slate-400">{item.adminEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-[340px]">
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {item.action}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {item.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.result === 'Success'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.result === 'Warning'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.result}
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
