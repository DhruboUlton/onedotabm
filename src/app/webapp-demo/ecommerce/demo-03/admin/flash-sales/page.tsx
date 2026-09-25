'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Flame,
  Search,
  Plus,
  Clock,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  Play,
  Pause,
} from 'lucide-react';

interface FlashSaleItem {
  id: string;
  productName: string;
  category: string;
  vendorName: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  totalQuota: number;
  soldCount: number;
  startTime: string;
  endTime: string;
  status: 'Live Now' | 'Upcoming' | 'Concluded';
}

const initialFlashSales: FlashSaleItem[] = [
  {
    id: 'FLASH-101',
    productName: 'Chrono Ultra Titanium Multisport Watch',
    category: 'Wearables',
    vendorName: 'AeroTech Labs',
    originalPrice: 799.00,
    salePrice: 599.00,
    discountPercent: 25,
    totalQuota: 50,
    soldCount: 38,
    startTime: 'Today, 00:00 UTC',
    endTime: 'Today, 23:59 UTC',
    status: 'Live Now',
  },
  {
    id: 'FLASH-102',
    productName: 'Valkyrie Hall-Effect Wireless Controller',
    category: 'Gaming',
    vendorName: 'CyberForge Systems',
    originalPrice: 179.99,
    salePrice: 129.99,
    discountPercent: 28,
    totalQuota: 80,
    soldCount: 65,
    startTime: 'Today, 06:00 UTC',
    endTime: 'Today, 18:00 UTC',
    status: 'Live Now',
  },
  {
    id: 'FLASH-103',
    productName: 'VoltStation 200W GaN Desktop Charger',
    category: 'Power',
    vendorName: 'VoltStream Energy',
    originalPrice: 129.99,
    salePrice: 89.99,
    discountPercent: 31,
    totalQuota: 100,
    soldCount: 0,
    startTime: 'Tomorrow, 00:00 UTC',
    endTime: 'Tomorrow, 23:59 UTC',
    status: 'Upcoming',
  },
  {
    id: 'FLASH-104',
    productName: 'ApexView 34" Curved OLED Monitor',
    category: 'Displays',
    vendorName: 'Quantum Dynamics',
    originalPrice: 899.99,
    salePrice: 699.99,
    discountPercent: 22,
    totalQuota: 30,
    soldCount: 30,
    startTime: 'Yesterday, 00:00 UTC',
    endTime: 'Yesterday, 23:59 UTC',
    status: 'Concluded',
  },
];

export default function FlashSalesPage() {
  const { showToast } = useStore();
  const [sales, setSales] = useState<FlashSaleItem[]>(initialFlashSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New flash sale state
  const [formProduct, setFormProduct] = useState('');
  const [formOriginal, setFormOriginal] = useState(199);
  const [formSale, setFormSale] = useState(149);
  const [formQuota, setFormQuota] = useState(50);

  const filtered = sales.filter((s) => {
    return (
      s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleToggleStatus = (id: string) => {
    setSales((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newStatus = s.status === 'Live Now' ? 'Concluded' : 'Live Now';
        showToast('Flash Drop Toggled', `${s.productName} is now ${newStatus}`, 'info');
        return { ...s, status: newStatus };
      })
    );
  };

  const handleCreateFlashSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProduct) return;

    const discount = Math.round(((formOriginal - formSale) / formOriginal) * 100);

    const newItem: FlashSaleItem = {
      id: `FLASH-${Math.floor(100 + Math.random() * 900)}`,
      productName: formProduct,
      category: 'Electronics',
      vendorName: 'AeroTech Labs',
      originalPrice: formOriginal,
      salePrice: formSale,
      discountPercent: discount,
      totalQuota: formQuota,
      soldCount: 0,
      startTime: 'Upcoming Drop',
      endTime: '24 Hour Countdown',
      status: 'Upcoming',
    };

    setSales((prev) => [newItem, ...prev]);
    showToast('Flash Drop Scheduled', `Scheduled flash drop for ${formProduct}`, 'success');
    setIsModalOpen(false);
    setFormProduct('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Flash Drops & Hourly Sales
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-600 dark:text-orange-300 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              <span>Live Drops</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time-gated limited stock clearance drops with countdown tickers and automated allocation quotas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Flash Drop</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Drops Live Right Now</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            {sales.filter((s) => s.status === 'Live Now').length} Active
          </div>
          <p className="text-[11px] text-orange-600 font-semibold mt-1">Countdown tickers ticking</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mean Quota Sell-Through</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            81.2%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">High urgency conversion</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Discount Rate</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            31% Off
          </div>
          <p className="text-[11px] text-slate-400 mt-1">VoltStation 200W GaN</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Pipeline</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
            1 Queued
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Auto-activates midnight</p>
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
            placeholder="Search flash items by product or vendor..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Hardware Item</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4 text-right">MSRP</th>
                <th className="py-3 px-4 text-right">Flash Price</th>
                <th className="py-3 px-4 text-center">Quota Progress</th>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => {
                const remaining = item.totalQuota - item.soldCount;
                const percentSold = Math.round((item.soldCount / (item.totalQuota || 1)) * 100);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      <div>{item.productName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{item.category}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {item.vendorName}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-orange-600 dark:text-orange-400 text-sm">
                      ${item.salePrice.toFixed(2)}
                      <span className="ml-1 text-[10px] text-emerald-600 font-bold">(-{item.discountPercent}%)</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32 mx-auto space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                          <span>{item.soldCount} sold</span>
                          <span>{remaining} left</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${percentSold}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                      <div>{item.startTime}</div>
                      <div className="text-[10px] text-slate-400">to {item.endTime}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'Live Now'
                            ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                            : item.status === 'Upcoming'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.status === 'Live Now' && <Flame className="w-3 h-3 fill-current" />}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-orange-600 transition-colors"
                        title={item.status === 'Live Now' ? 'Pause Flash Drop' : 'Make Live Now'}
                      >
                        {item.status === 'Live Now' ? (
                          <Pause className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Play className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>Schedule Flash Drop</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFlashSale} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  placeholder="e.g. AeroBlade 16 Gaming Rig"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Original MSRP ($)
                  </label>
                  <input
                    type="number"
                    value={formOriginal}
                    onChange={(e) => setFormOriginal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Flash Price ($)
                  </label>
                  <input
                    type="number"
                    value={formSale}
                    onChange={(e) => setFormSale(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Flash Allocation Quota (Units)
                </label>
                <input
                  type="number"
                  value={formQuota}
                  onChange={(e) => setFormQuota(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
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
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-500/25"
                >
                  Confirm Flash Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
