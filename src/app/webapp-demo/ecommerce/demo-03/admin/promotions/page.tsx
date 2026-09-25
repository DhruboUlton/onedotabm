'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Zap,
  Search,
  Plus,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  Percent,
  Layers,
  ArrowUpRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
} from 'lucide-react';

interface PromotionCampaign {
  id: string;
  name: string;
  scope: string; // e.g., 'All Audio Hardware' or 'GaN Chargers'
  discountText: string;
  discountType: 'Percentage' | 'Fixed Amount';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Expired';
  salesGenerated: number;
}

const initialPromotions: PromotionCampaign[] = [
  {
    id: 'PROM-01',
    name: 'Fall Hardware Fest 2026',
    scope: 'Site-wide Audio & Gaming',
    discountText: '15% Off Select Labs',
    discountType: 'Percentage',
    startDate: '2026-09-20',
    endDate: '2026-10-05',
    status: 'Active',
    salesGenerated: 42800.00,
  },
  {
    id: 'PROM-02',
    name: 'GaN Energy Upgrade Week',
    scope: 'Power & Charging Department',
    discountText: '$25 Off Over $150',
    discountType: 'Fixed Amount',
    startDate: '2026-09-22',
    endDate: '2026-09-30',
    status: 'Active',
    salesGenerated: 18450.00,
  },
  {
    id: 'PROM-03',
    name: 'Early Black Friday Preview',
    scope: 'Workstations & Displays',
    discountText: '20% Off Bundles',
    discountType: 'Percentage',
    startDate: '2026-11-01',
    endDate: '2026-11-15',
    status: 'Scheduled',
    salesGenerated: 0,
  },
  {
    id: 'PROM-04',
    name: 'Labor Day Esports Drop',
    scope: 'Peripherals & Keyboards',
    discountText: '10% Off Orders > $100',
    discountType: 'Percentage',
    startDate: '2026-09-01',
    endDate: '2026-09-08',
    status: 'Expired',
    salesGenerated: 31200.00,
  },
];

export default function PromotionsPage() {
  const { showToast } = useStore();
  const [promotions, setPromotions] = useState<PromotionCampaign[]>(initialPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Promotion Form state
  const [formName, setFormName] = useState('');
  const [formScope, setFormScope] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');

  const filtered = promotions.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.discountText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalSales = promotions.reduce((sum, p) => sum + p.salesGenerated, 0);

  const handleToggleStatus = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStatus = p.status === 'Active' ? 'Expired' : 'Active';
        showToast('Promotion Status Toggled', `Campaign "${p.name}" is now ${newStatus}`, 'info');
        return { ...p, status: newStatus };
      })
    );
  };

  const handleCreatePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formScope || !formDiscount) return;

    const newPromo: PromotionCampaign = {
      id: `PROM-${Math.floor(100 + Math.random() * 900)}`,
      name: formName,
      scope: formScope,
      discountText: formDiscount,
      discountType: 'Percentage',
      startDate: formStart || '2026-10-01',
      endDate: formEnd || '2026-10-15',
      status: 'Scheduled',
      salesGenerated: 0,
    };

    setPromotions((prev) => [newPromo, ...prev]);
    showToast('Promotion Created', `Created campaign "${formName}"`, 'success');
    setIsModalOpen(false);
    setFormName('');
    setFormScope('');
    setFormDiscount('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Seasonal Promotions
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Department Sales
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure site-wide percentage sales, category bundle markdowns, and scheduled promotional windows.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Promotion</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Campaigns</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            {promotions.filter((p) => p.status === 'Active').length} Running
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Driving 38% of marketplace traffic</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attributed Sales</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all promotional periods</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Next</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            1 Upcoming
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Black Friday Preview starting Nov 1</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mean Markdown</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            14.5%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Co-funded with vendor partners</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns by name, category scope, or discount terms..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Promotion Name</th>
                <th className="py-3 px-4">Department Scope</th>
                <th className="py-3 px-4">Discount Incentive</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Attributed GMV</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <div>{item.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{item.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {item.scope}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                    {item.discountText}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {item.startDate} → {item.endDate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                    ${item.salesGenerated.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'Scheduled'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                      title="Toggle Active/Expired"
                    >
                      {item.status === 'Active' ? (
                        <ToggleRight className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Launch New Promotional Campaign
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromotion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Cyber Weekend Flash Sale"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Department / Scope
                </label>
                <input
                  type="text"
                  required
                  value={formScope}
                  onChange={(e) => setFormScope(e.target.value)}
                  placeholder="e.g., All Drones & Cameras"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Discount Incentive Terms
                </label>
                <input
                  type="text"
                  required
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(e.target.value)}
                  placeholder="e.g., 18% Off with code CYBER18"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Launch Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
