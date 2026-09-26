'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { ActivityLogItem } from '../../_types';

export default function AdminActivityLogPage() {
  const { activityLog, staff } = useStore();

  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  const filteredLogs = activityLog.filter((item) => {
    if (areaFilter !== 'all' && item.area !== areaFilter) return false;
    if (userFilter !== 'all' && item.user !== userFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchAction = item.action.toLowerCase().includes(q);
      const matchEntity = item.entity.toLowerCase().includes(q);
      const matchDetails = item.details.toLowerCase().includes(q);
      const matchUser = item.user.toLowerCase().includes(q);
      if (!matchAction && !matchEntity && !matchDetails && !matchUser) return false;
    }
    return true;
  });

  const getAreaBadgeColor = (area: ActivityLogItem['area']) => {
    switch (area) {
      case 'Products':
        return 'bg-pink-50 text-[#EB1551]';
      case 'Orders':
        return 'bg-teal-50 text-[#0A6375]';
      case 'Inventory':
        return 'bg-amber-50 text-amber-700';
      case 'Coupons':
        return 'bg-purple-50 text-purple-700';
      case 'Categories':
        return 'bg-blue-50 text-blue-700';
      case 'Banners':
      case 'Popups':
        return 'bg-rose-50 text-rose-600';
      case 'Reviews':
        return 'bg-yellow-50 text-yellow-700';
      case 'Staff':
      case 'Settings':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6375] uppercase tracking-wider mb-1">
            <Link href="/webapp-demo/ecommerce/demo-04/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <span>Security & Governance</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-bubblegum">
            Administrative Audit & Activity Log 📜
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete chronologic audit trail of merchant changes, stock adjustments, customer orders, and promotional edits.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2">
          <span>Total Recorded Events:</span>
          <span className="font-mono text-gray-900 font-black">{activityLog.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="relative md:col-span-6">
          <svg className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search audit trail by action, entity, user, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#EB1551]"
          />
        </div>

        {/* Area Filter */}
        <div className="md:col-span-3">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700"
          >
            <option value="all">All Operational Areas</option>
            <option value="Orders">Orders</option>
            <option value="Products">Products</option>
            <option value="Inventory">Inventory</option>
            <option value="Coupons">Coupons</option>
            <option value="Categories">Categories</option>
            <option value="Banners">Banners</option>
            <option value="Popups">Popups</option>
            <option value="Reviews">Reviews</option>
            <option value="Staff">Staff</option>
            <option value="Settings">Settings</option>
          </select>
        </div>

        {/* User Filter */}
        <div className="md:col-span-3">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700"
          >
            <option value="all">All Actors / Users</option>
            <option value="Customer (Storefront)">Customer (Storefront Checkout)</option>
            <option value="Admin">Admin (Active Session)</option>
            {staff.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Area</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No activity log records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-gray-500">
                      {item.timestamp}
                    </td>

                    {/* Actor */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <span>{item.user.includes('Customer') ? '🛍️' : '👤'}</span>
                        <span>{item.user}</span>
                      </div>
                    </td>

                    {/* Area Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getAreaBadgeColor(
                          item.area
                        )}`}
                      >
                        {item.area}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 whitespace-nowrap font-semibold text-gray-800">
                      {item.action}
                    </td>

                    {/* Entity */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-medium text-[#0A6375]">
                      {item.entity}
                    </td>

                    {/* Details */}
                    <td className="py-3 px-4 text-gray-600 max-w-sm line-clamp-1 leading-normal">
                      {item.details}
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
