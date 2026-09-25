'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../_context/StoreContext';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Store,
  AlertTriangle,
  ArrowRight,
  Plus,
  Package,
  CheckCircle2,
  Users,
  Wallet,
  Clock,
  Star,
  Check,
  X,
  FileText,
  BarChart3,
  Layers,
  Tag,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { products, orders, vendors, adjustStock, showToast } = useStore();
  const [timeRange, setTimeRange] = useState<'30d' | '7d'>('30d');

  // Operational State
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'app-1', name: 'NovaSync 100W GaN Travel Adapter', vendor: 'VoltStream Dynamics', category: 'Charging', price: 69.99, submitted: '2h ago' },
    { id: 'app-2', name: 'Vortex RGB Mechanical Keycaps Set', vendor: 'CyberForge Hardware', category: 'Gaming', price: 45.00, submitted: '5h ago' },
    { id: 'app-3', name: 'Studio One Precision Mic Arm', vendor: 'AudioCraft Precision', category: 'Audio', price: 119.00, submitted: '1d ago' },
  ]);

  const [vendorApplications, setVendorApplications] = useState([
    { id: 'va-1', storeName: 'OptiLens Optics', applicant: 'Marcus Vance', hub: 'Portland, OR', catalogSize: '32 SKUs', date: 'Yesterday' },
    { id: 'va-2', storeName: 'Quantum Thermal Labs', applicant: 'Elena Rostova', hub: 'San Jose, CA', catalogSize: '15 SKUs', date: '3 days ago' },
  ]);

  const [pendingPayouts, setPendingPayouts] = useState([
    { id: 'po-1', vendor: 'AeroTech Labs', amount: 8420.50, method: 'ACH Transfer', status: 'Pending' },
    { id: 'po-2', vendor: 'VoltStream Dynamics', amount: 4310.00, method: 'Stripe Connect', status: 'Pending' },
  ]);

  // Compute live metrics from actual orders & catalog
  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0) + 142800;
  const netRevenue = totalGMV * 0.125; // 12.5% marketplace commission
  const totalOrdersCount = orders.length + 1280;
  const totalCustomers = 4120;
  const activeVendorsCount = vendors.filter((v) => v.status === 'Active').length;
  const lowStockItems = products.filter((p) => p.stock < 16);

  const handleApproveProduct = (id: string, name: string) => {
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Approved', `"${name}" is now live in marketplace catalog`, 'success');
  };

  const handleRejectProduct = (id: string, name: string) => {
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
    showToast('Changes Requested', `Returned "${name}" for vendor revisions`, 'info');
  };

  const handleApproveApplication = (id: string, name: string) => {
    setVendorApplications((prev) => prev.filter((v) => v.id !== id));
    showToast('Merchant Onboarded', `Approved seller credentials for "${name}"`, 'success');
  };

  const handleReleasePayout = (id: string, vendor: string, amount: number) => {
    setPendingPayouts((prev) => prev.filter((p) => p.id !== id));
    showToast('Payout Dispatched', `Settlement of $${amount.toFixed(2)} sent to ${vendor}`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Marketplace Command Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time multi-vendor merchant pipeline, synchronized inventory, and financial performance.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              timeRange === '7d' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              timeRange === '30d' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* 8 Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Merchandise Value</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalGMV.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+16.4% MoM</span>
          </div>
        </div>

        {/* Net Revenue (Take-Rate) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Take-Rate (12.5%)</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            ${netRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-400">Platform earnings retained</div>
        </div>

        {/* Orders Count */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Dispatched</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalOrdersCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">{orders.length} in live demo state</div>
        </div>

        {/* Active Customers */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Customers</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalCustomers.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">+284 new buyers this week</div>
        </div>

        {/* Active Vendors */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorized Vendors</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Store className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            {activeVendorsCount} <span className="text-xs font-normal text-slate-400">Stores</span>
          </div>
          <div className="text-[10px] text-slate-400">100% verified SLA rating</div>
        </div>

        {/* Total Products */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catalog SKUs</span>
            <div className="w-7 h-7 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            {products.length} <span className="text-xs font-normal text-slate-400">Active</span>
          </div>
          <div className="text-[10px] text-slate-400">Multi-variant options enabled</div>
        </div>

        {/* Pending Approvals */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {pendingApprovals.length} <span className="text-xs font-normal text-slate-400">Submissions</span>
          </div>
          <div className="text-[10px] text-rose-500 font-bold">Requires moderator review</div>
        </div>

        {/* Pending Payouts */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</span>
            <div className="w-7 h-7 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            ${pendingPayouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-orange-500 font-bold">{pendingPayouts.length} merchant settlements</div>
        </div>
      </div>

      {/* 2 Primary Charts: Revenue Over Time & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue SVG Chart (Col 1-8) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Gross Merchandise Value Trend
              </h3>
              <p className="text-xs text-slate-400">Aggregated marketplace sales volume over 30 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-500">Sales ($)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-slate-500">Orders (Vol)</span>
              </div>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="relative h-60 w-full pt-4">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />

              {/* Area fill */}
              <path
                d="M 0,160 Q 60,140 120,110 T 240,80 T 360,50 T 480,70 T 600,20 L 600,190 L 0,190 Z"
                fill="url(#chartGrad)"
              />

              {/* Line path */}
              <path
                d="M 0,160 Q 60,140 120,110 T 240,80 T 360,50 T 480,70 T 600,20"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="120" cy="110" r="4.5" fill="#2563EB" className="animate-pulse" />
              <circle cx="240" cy="80" r="4.5" fill="#2563EB" />
              <circle cx="360" cy="50" r="4.5" fill="#2563EB" />
              <circle cx="480" cy="70" r="4.5" fill="#2563EB" />
              <circle cx="600" cy="20" r="5" fill="#2563EB" />
            </svg>

            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
              <span>Week 1 (Sep 1)</span>
              <span>Week 2 (Sep 8)</span>
              <span>Week 3 (Sep 15)</span>
              <span>Week 4 (Sep 22)</span>
              <span>Today (Live)</span>
            </div>
          </div>
        </div>

        {/* Sales by Category & Vendor Breakdown (Col 9-12) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Department Share
            </h3>
            <p className="text-xs text-slate-400">Share of GMV by hardware sector</p>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Laptops & Computers</span>
                  <span>42%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[42%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Smartphones & Foldables</span>
                  <span>26%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-[26%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>High-Fidelity Audio</span>
                  <span>18%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[18%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Gaming & Power Stations</span>
                  <span>14%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full w-[14%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">Top Performing Merchant:</span>
            <div className="flex items-center justify-between mt-1 text-slate-500">
              <span>AeroTech Labs</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">$64,200 (45% GMV)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Operational Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Panel 1: Pending Product Approvals */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Product Approvals ({pendingApprovals.length})
              </h4>
            </div>
            <Link href="/webapp-demo/ecommerce/demo-03/admin/approvals" className="text-[11px] font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingApprovals.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No pending submissions</p>
            ) : (
              pendingApprovals.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-900 dark:text-slate-100 font-bold line-clamp-1">{item.name}</strong>
                    <span className="font-black text-slate-900 dark:text-slate-100 shrink-0 ml-2">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{item.vendor}</span>
                    <span>{item.submitted}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => handleRejectProduct(item.id, item.name)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      Changes
                    </button>
                    <button
                      onClick={() => handleApproveProduct(item.id, item.name)}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 2: Vendor Applications */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Seller Applications ({vendorApplications.length})
              </h4>
            </div>
            <Link href="/webapp-demo/ecommerce/demo-03/admin/vendor-applications" className="text-[11px] font-bold text-blue-600 hover:underline">
              Review
            </Link>
          </div>

          <div className="space-y-2.5">
            {vendorApplications.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No new applications</p>
            ) : (
              vendorApplications.map((v) => (
                <div key={v.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">{v.storeName}</strong>
                    <span className="text-[10px] text-slate-400">{v.catalogSize}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Contact: {v.applicant}</span>
                    <span>{v.hub}</span>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleApproveApplication(v.id, v.storeName)}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                    >
                      Authorize
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 3: Pending Payouts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Pending Payouts ({pendingPayouts.length})
              </h4>
            </div>
            <Link href="/webapp-demo/ecommerce/demo-03/admin/payouts" className="text-[11px] font-bold text-blue-600 hover:underline">
              Ledger
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingPayouts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">All settlements cleared</p>
            ) : (
              pendingPayouts.map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">{p.vendor}</strong>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      ${p.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{p.method}</span>
                    <span className="text-amber-500 font-semibold">{p.status}</span>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleReleasePayout(p.id, p.vendor, p.amount)}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                    >
                      Release Funds
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 4: Low Stock Warnings */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Low Stock Reserves ({lowStockItems.length})
              </h4>
            </div>
            <Link href="/webapp-demo/ecommerce/demo-03/admin/inventory" className="text-[11px] font-bold text-blue-600 hover:underline">
              Inventory
            </Link>
          </div>

          <div className="space-y-2.5">
            {lowStockItems.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-slate-100 font-bold block line-clamp-1">{item.title}</strong>
                  <span className="text-[11px] text-slate-400">{item.vendorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold ${item.stock === 0 ? 'text-rose-500' : 'text-amber-500'}`}>
                    {item.stock} left
                  </span>
                  <button
                    onClick={() => {
                      adjustStock(item.id, 25);
                      showToast('Stock Replenished', `Added +25 units to ${item.title}`, 'success');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[10px]"
                  >
                    +25
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 5: Recent Fulfillment Orders */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Live Orders Pipeline ({orders.length})
              </h4>
            </div>
            <Link href="/webapp-demo/ecommerce/demo-03/admin/orders" className="text-[11px] font-bold text-blue-600 hover:underline">
              Orders
            </Link>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 3).map((o) => (
              <div key={o.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-blue-600">{o.orderNumber}</span>
                  <span className="font-black text-slate-900 dark:text-slate-100">${o.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{o.customerName}</span>
                  <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px]">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 6: Quick Admin Actions */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Quick Shortcuts
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/webapp-demo/ecommerce/demo-03/admin/products"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 font-bold flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
            >
              <Package className="w-5 h-5 text-blue-600" />
              <span>Add Product</span>
            </Link>

            <Link
              href="/webapp-demo/ecommerce/demo-03/admin/discounts"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 font-bold flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
            >
              <Tag className="w-5 h-5 text-emerald-600" />
              <span>New Coupon</span>
            </Link>

            <Link
              href="/webapp-demo/ecommerce/demo-03/admin/payouts"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 font-bold flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
            >
              <Wallet className="w-5 h-5 text-purple-600" />
              <span>Payouts</span>
            </Link>

            <Link
              href="/webapp-demo/ecommerce/demo-03/admin/analytics"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 font-bold flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
