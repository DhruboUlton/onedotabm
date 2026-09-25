'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { ActivityLogItem } from '../../_types';
import {
  History,
  Search,
  Filter,
  User,
  Calendar,
  Layers,
  ArrowUpDown,
  Download,
  CheckCircle,
  Tag,
  Package,
  ShoppingBag,
  Sliders,
  Sparkles,
  Users,
  Settings,
  Shield,
  MessageSquare
} from 'lucide-react';

export default function ActivityLogPage() {
  const { activityLogs, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Extract unique users
  const uniqueUsers = Array.from(new Set(activityLogs.map((l) => l.user)));
  const uniqueAreas: ActivityLogItem['area'][] = [
    'Products',
    'Orders',
    'Inventory',
    'Combos',
    'Coupons',
    'Banners',
    'Popups',
    'Reviews',
    'Staff',
    'Settings',
  ];

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());

    const matchesArea = areaFilter === 'all' || log.area === areaFilter;
    const matchesUser = userFilter === 'all' || log.user === userFilter;

    let matchesDate = true;
    if (dateFilter === 'today') {
      const todayStr = new Date().toISOString().substring(0, 10);
      matchesDate = log.timestamp.startsWith(todayStr);
    }

    return matchesSearch && matchesArea && matchesUser && matchesDate;
  });

  const getAreaBadge = (area: ActivityLogItem['area']) => {
    switch (area) {
      case 'Orders':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <ShoppingBag className="w-3 h-3" />,
        };
      case 'Products':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Package className="w-3 h-3" />,
        };
      case 'Inventory':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Sliders className="w-3 h-3" />,
        };
      case 'Coupons':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Tag className="w-3 h-3" />,
        };
      case 'Banners':
      case 'Popups':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <Sparkles className="w-3 h-3" />,
        };
      case 'Reviews':
        return {
          bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          icon: <MessageSquare className="w-3 h-3" />,
        };
      case 'Staff':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <Users className="w-3 h-3" />,
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Settings className="w-3 h-3" />,
        };
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,User,Action,Area,Entity,Details\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.area}","${l.entity.replace(/"/g, '""')}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shuddha_activity_log_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    showToast('Activity log exported as CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-6 h-6 text-[#0f4a38]" />
            Audit & Activity Log
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time chronological ledger of all storefront orders, catalog alterations, inventory reconciliations, and staff actions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export Audit Trail
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Events</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{activityLogs.length}</p>
          <p className="text-xs text-slate-500 mt-1">Logged across session</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-400">Active Operators</p>
          <p className="text-2xl font-bold text-[#0f4a38] mt-1">{uniqueUsers.length}</p>
          <p className="text-xs text-slate-500 mt-1">Admins & automated events</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-400">Audit Status</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">Immutable</p>
          <p className="text-xs text-slate-500 mt-1">Real-time memory sync</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold uppercase text-slate-400">Filtered Events</p>
          <p className="text-2xl font-bold text-[#e86f1e] mt-1">{filteredLogs.length}</p>
          <p className="text-xs text-slate-500 mt-1">Matching criteria</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, entity or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-[#0f4a38]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-[#0f4a38]"
          >
            <option value="all">All Areas</option>
            {uniqueAreas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-[#0f4a38]"
          >
            <option value="all">All Actors</option>
            {uniqueUsers.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-slate-200 rounded-lg text-sm px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-[#0f4a38]"
          >
            <option value="all">All Time</option>
            <option value="today">Today Only</option>
          </select>
        </div>
      </div>

      {/* Activity Log Table / Stream */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Details / Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No activity entries found matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getAreaBadge(log.area);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 text-xs">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {log.user}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}
                        >
                          {badge.icon}
                          {log.area}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800 text-xs">
                        {log.action}
                      </td>

                      <td className="py-3 px-4 text-xs font-medium text-slate-700">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[11px]">
                          {log.entity}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600 max-w-md truncate">
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
