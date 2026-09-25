'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  ShoppingBag,
  DollarSign,
  Heart,
  RotateCcw,
  Star,
  Activity,
  UserCheck,
  UserX,
  Calendar,
  MapPin,
  Clock,
  X,
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  ordersCount: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: string;
  status: 'Active' | 'VIP Platinum' | 'Suspended';
  wishlistCount: number;
  reviewsCount: number;
  returnsCount: number;
  recentActivity: string;
}

const initialCustomers: CustomerRecord[] = [
  {
    id: 'CUST-001',
    name: 'Marcus Vance',
    email: 'm.vance@techlabs.io',
    city: 'San Francisco, CA',
    country: 'United States',
    ordersCount: 8,
    totalSpent: 6420.00,
    avgOrderValue: 802.50,
    lastOrderDate: '2026-09-24',
    status: 'VIP Platinum',
    wishlistCount: 4,
    reviewsCount: 6,
    returnsCount: 1,
    recentActivity: 'Placed order KG-89021 (AeroBlade 16 Titanium Pro)',
  },
  {
    id: 'CUST-002',
    name: 'Elena Rostova',
    email: 'elena.rostova@designworks.com',
    city: 'Seattle, WA',
    country: 'United States',
    ordersCount: 5,
    totalSpent: 2190.00,
    avgOrderValue: 438.00,
    lastOrderDate: '2026-09-23',
    status: 'Active',
    wishlistCount: 7,
    reviewsCount: 3,
    returnsCount: 0,
    recentActivity: 'Saved ApexView 34" Curved OLED to Wishlist',
  },
  {
    id: 'CUST-003',
    name: 'David Kim',
    email: 'david.kim@streamerhub.gg',
    city: 'Austin, TX',
    country: 'United States',
    ordersCount: 12,
    totalSpent: 4890.50,
    avgOrderValue: 407.54,
    lastOrderDate: '2026-09-22',
    status: 'VIP Platinum',
    wishlistCount: 11,
    reviewsCount: 8,
    returnsCount: 1,
    recentActivity: 'Left 5-star review on Valkyrie Hall-Effect Controller',
  },
  {
    id: 'CUST-004',
    name: 'Chloe Bennett',
    email: 'chloe.b@creativecorp.org',
    city: 'Toronto, ON',
    country: 'Canada',
    ordersCount: 2,
    totalSpent: 350.00,
    avgOrderValue: 175.00,
    lastOrderDate: '2026-09-18',
    status: 'Active',
    wishlistCount: 2,
    reviewsCount: 1,
    returnsCount: 0,
    recentActivity: 'Subscribed to Hardware Drop Alerts',
  },
  {
    id: 'CUST-005',
    name: 'Alexander Ward',
    email: 'award.suspicious@tempmail.xyz',
    city: 'Miami, FL',
    country: 'United States',
    ordersCount: 1,
    totalSpent: 129.99,
    avgOrderValue: 129.99,
    lastOrderDate: '2026-09-02',
    status: 'Suspended',
    wishlistCount: 0,
    reviewsCount: 0,
    returnsCount: 2,
    recentActivity: 'Flagged for multiple chargeback filings',
  },
];

export default function CustomersPage() {
  const { showToast } = useStore();
  const [customers, setCustomers] = useState<CustomerRecord[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCustomers = customers.length;
  const totalLTV = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpend = totalLTV / (totalCustomers || 1);

  const handleToggleSuspend = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newStatus = c.status === 'Suspended' ? 'Active' : 'Suspended';
        showToast('Customer Status Changed', `${c.name} account is now ${newStatus}`, newStatus === 'Suspended' ? 'warning' : 'success');
        return { ...c, status: newStatus };
      })
    );
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer((prev) =>
        prev ? { ...prev, status: prev.status === 'Suspended' ? 'Active' : 'Suspended' } : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Customer Directory
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {totalCustomers} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Buyer lifetime value profiles, purchase frequency, wishlist affinity, and account status controls.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Customer Base</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalCustomers.toLocaleString()} Registered
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+18.2% this quarter</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Aggregate Lifetime Value</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalLTV.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all order cohorts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Spend / User</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            ${avgSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">High basket electronics buyers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">VIP Platinum Buyers</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            {customers.filter((c) => c.status === 'VIP Platinum').length} VIPs
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Spend &gt; $4,000 threshold</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email, city, or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="VIP Platinum">VIP Platinum</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Total Spent</th>
                <th className="py-3 px-4 text-right">AOV</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.name}</div>
                    <div className="text-[11px] text-slate-400">{item.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    <div>{item.city}</div>
                    <div className="text-[10px] text-slate-400">{item.country}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-slate-100">
                    {item.ordersCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                    ${item.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400 font-semibold">
                    ${item.avgOrderValue.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {item.lastOrderDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'VIP Platinum'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : item.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCustomer(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Customer Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(item.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.status === 'Suspended'
                            ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                            : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                        }`}
                        title={item.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
                      >
                        {item.status === 'Suspended' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Slide-Over Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{selectedCustomer.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {selectedCustomer.id}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400">{selectedCustomer.email} • {selectedCustomer.city}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Spent</span>
                <span className="font-black text-slate-900 dark:text-slate-100">${selectedCustomer.totalSpent.toFixed(0)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Orders</span>
                <span className="font-black text-slate-900 dark:text-slate-100">{selectedCustomer.ordersCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Wishlist</span>
                <span className="font-black text-blue-600 dark:text-blue-400">{selectedCustomer.wishlistCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reviews</span>
                <span className="font-black text-amber-500">{selectedCustomer.reviewsCount}</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Latest Buyer Activity</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {selectedCustomer.recentActivity}
              </p>
              <div className="text-[10px] text-slate-400 pt-1">Timestamp: {selectedCustomer.lastOrderDate} 14:32:10 UTC</div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleToggleSuspend(selectedCustomer.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedCustomer.status === 'Suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                }`}
              >
                {selectedCustomer.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
              </button>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
