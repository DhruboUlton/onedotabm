'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  AlertTriangle,
  PackageX,
  PackageCheck,
  Boxes,
  Search,
  Plus,
  ArrowUpRight,
  TrendingDown,
  RotateCcw,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const { products, adjustStock, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical' | 'low' | 'healthy'>('all');

  const stats = useMemo(() => {
    const critical = products.filter((p) => p.stock === 0);
    const low = products.filter((p) => p.stock > 0 && p.stock <= 15);
    const healthy = products.filter((p) => p.stock > 15);
    const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);

    return {
      criticalCount: critical.length,
      lowCount: low.length,
      healthyCount: healthy.length,
      totalUnits,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const firstSku = p.variants?.[0]?.sku || '';
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firstSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (filter === 'critical') matchesFilter = p.stock === 0;
      else if (filter === 'low') matchesFilter = p.stock > 0 && p.stock <= 15;
      else if (filter === 'healthy') matchesFilter = p.stock > 15;

      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, filter]);

  const handleRestock = (productId: string, title: string, amount: number) => {
    adjustStock(productId, amount);
    showToast('Inventory Restocked', `Added +${amount} units to ${title}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          Inventory & Stock Health
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor warehouse stock reserves, trigger automated replenishment batches, and resolve stockout risks.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Out of Stock */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Out of Stock</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <PackageX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats.criticalCount} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
            Customer order blocking active
          </p>
        </div>

        {/* Low Stock */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Reserves</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats.lowCount} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            Below safe 15 units buffer
          </p>
        </div>

        {/* Healthy Stock */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Optimal Inventory</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats.healthyCount} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Standard delivery guaranteed
          </p>
        </div>

        {/* Total Catalog Units */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Warehouse Units</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {stats.totalUnits.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Across {products.length} hardware models
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory by title, SKU, or brand..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all', label: 'All Catalog' },
            { id: 'critical', label: `Out of Stock (${stats.criticalCount})` },
            { id: 'low', label: `Low Stock (${stats.lowCount})` },
            { id: 'healthy', label: `Healthy (${stats.healthyCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Hardware SKU</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Vendor Origin</th>
                <th className="py-3.5 px-3">Units in Stock</th>
                <th className="py-3.5 px-3">Stock Capacity Bar</th>
                <th className="py-3.5 px-4 text-right">Instant Restock Batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No hardware units found under this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.stock === 0;
                  const isLow = p.stock > 0 && p.stock <= 15;
                  const percent = Math.min(100, Math.round((p.stock / 60) * 100));

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* SKU & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                            <Image
                              src={p.primaryImage}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                              {p.title}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">
                              {p.variants?.[0]?.sku || 'KNT-SKU'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 capitalize text-slate-600 dark:text-slate-300">
                        {p.category}
                      </td>

                      {/* Vendor */}
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        {p.vendorName}
                      </td>

                      {/* Units */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isOut
                              ? 'text-rose-600 dark:text-rose-400'
                              : isLow
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>

                      {/* Stock Capacity Progress Bar */}
                      <td className="py-3.5 px-3 w-48">
                        <div className="space-y-1">
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isOut
                                  ? 'bg-rose-500 w-0'
                                  : isLow
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>{percent}% safe buffer</span>
                          </div>
                        </div>
                      </td>

                      {/* Quick Restock Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRestock(p.id, p.title, 10)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] transition-colors"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleRestock(p.id, p.title, 25)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-[11px] transition-colors"
                          >
                            +25
                          </button>
                          <button
                            onClick={() => handleRestock(p.id, p.title, 50)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] transition-colors"
                          >
                            +50
                          </button>
                        </div>
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
