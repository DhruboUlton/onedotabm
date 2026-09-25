'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { ActivityLogItem } from '../../_types';
import {
  History,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Layers,
  ArrowRight,
  ShieldAlert,
  ShoppingBag,
  Package,
  Boxes,
  Tag,
  Sliders,
  Settings,
  Users,
} from 'lucide-react';

export default function AdminActivityLogPage() {
  const { activityLogs, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  const uniqueUsers = Array.from(new Set(activityLogs.map((log) => log.user)));
  const uniqueAreas = Array.from(new Set(activityLogs.map((log) => log.area)));

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea = selectedArea === 'all' || log.area === selectedArea;
    const matchesUser = selectedUser === 'all' || log.user === selectedUser;

    return matchesSearch && matchesArea && matchesUser;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User', 'Area', 'Action', 'Entity', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.area}"`,
      `"${l.action}"`,
      `"${l.entity.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auraglass_activity_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Activity audit log exported to CSV.', 'success');
  };

  const getAreaBadgeColor = (area: ActivityLogItem['area']) => {
    switch (area) {
      case 'Orders':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Products':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Inventory':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Coupons':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Banners':
      case 'Popups':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            System Compliance & Audit Trail
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Merchant Activity & Audit Log
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time chronological record of orders placed, inventory receipts, price adjustments, and administrative changes.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search action, entity, user, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Area:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 bg-white font-medium focus:outline-none"
            >
              <option value="all">All Areas</option>
              {uniqueAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Actor:</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 bg-white font-medium focus:outline-none"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-zinc-100">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No audit log entries found matching criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 hover:bg-zinc-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                    {log.area === 'Orders' ? (
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                    ) : log.area === 'Products' ? (
                      <Package className="w-4 h-4 text-purple-600" />
                    ) : log.area === 'Inventory' ? (
                      <Boxes className="w-4 h-4 text-amber-600" />
                    ) : log.area === 'Coupons' ? (
                      <Tag className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <History className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getAreaBadgeColor(
                          log.area
                        )}`}
                      >
                        {log.area}
                      </span>
                      <strong className="text-xs font-bold text-zinc-900">
                        {log.action}
                      </strong>
                      <span className="text-zinc-400 text-[11px]">—</span>
                      <span className="text-xs font-semibold text-zinc-700 font-mono truncate max-w-xs">
                        {log.entity}
                      </span>
                    </div>

                    <p className="text-zinc-600 text-xs leading-relaxed">{log.details}</p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 font-medium text-zinc-700">
                        <User className="w-3 h-3 text-zinc-400" />
                        {log.user}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
