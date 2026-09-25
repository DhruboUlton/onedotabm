'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';
import {
  Bell,
  AlertTriangle,
  PackageX,
  PackageCheck,
  Search,
  Filter,
  Plus,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';

export default function AdminStockAlertsPage() {
  const { products, adjustStock, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical' | 'low'>('all');

  const alertProducts = products.filter((p) => p.stock <= 15);

  const filtered = alertProducts.filter((p) => {
    const firstSku = p.variants?.[0]?.sku || '';
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firstSku.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filter === 'critical') matchesFilter = p.stock === 0;
    if (filter === 'low') matchesFilter = p.stock > 0 && p.stock <= 15;
    return matchesSearch && matchesFilter;
  });

  const handleBatchRestock = (id: string, name: string, qty: number) => {
    adjustStock(id, qty);
    showToast('Warehouse Replenished', `Injected +${qty} units into ${name}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Automated Stock & Safety Alerts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time threshold monitoring for hardware items dipping below the 15-unit minimum safe warehouse buffer.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Depletion (0 Units)</span>
          <div className="text-2xl font-black text-rose-600">
            {products.filter((p) => p.stock === 0).length} SKUs
          </div>
          <span className="text-[11px] text-rose-500 font-bold block">Immediate purchase orders required</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Warning (1-15 Units)</span>
          <div className="text-2xl font-black text-amber-500">
            {products.filter((p) => p.stock > 0 && p.stock <= 15).length} SKUs
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">Delivery buffers active</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Automated Supplier Reorder</span>
          <div className="text-2xl font-black text-blue-600">Enabled</div>
          <span className="text-[11px] text-slate-400 block">Vendor EDI notification triggered</span>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Device & SKU</th>
                <th className="py-3.5 px-3">Merchant Hub</th>
                <th className="py-3.5 px-3">Available Stock</th>
                <th className="py-3.5 px-3">Safety Buffer</th>
                <th className="py-3.5 px-3">Alert Severity</th>
                <th className="py-3.5 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No active stock warnings! All inventory is currently healthy.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isOut = p.stock === 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                            <Image src={p.primaryImage} alt={p.title} fill className="object-cover" sizes="40px" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100 block line-clamp-1">{p.title}</span>
                            <span className="text-[10px] font-mono text-slate-400">{p.variants?.[0]?.sku || 'KNT-SKU'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{p.vendorName}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-sm">
                        <span className={isOut ? 'text-rose-600' : 'text-amber-600'}>{p.stock} units</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">Min: 15 Units</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isOut
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          {isOut ? 'Stockout Risk' : 'Low Buffer'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleBatchRestock(p.id, p.title, 15)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-[11px]"
                          >
                            +15 Units
                          </button>
                          <button
                            onClick={() => handleBatchRestock(p.id, p.title, 50)}
                            className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs"
                          >
                            +50 Units
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
