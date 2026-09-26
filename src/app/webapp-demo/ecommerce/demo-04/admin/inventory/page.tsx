'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Archive, Plus, Minus, Search, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Product } from '../../_types';

export default function AdminInventoryPage() {
  const { products, adjustStock } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState(0);

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalRetailValuation = products.reduce((sum, p) => sum + p.stock * p.basePrice, 0);
  const totalCostValuation = totalRetailValuation * 0.38; // 38% cost of goods

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()));
    let matchesStatus = true;
    if (statusFilter === 'In Stock') matchesStatus = p.stock > 20;
    if (statusFilter === 'Low Stock') matchesStatus = p.stock > 0 && p.stock <= 20;
    if (statusFilter === 'Out of Stock') matchesStatus = p.stock <= 0;
    return matchesSearch && matchesStatus;
  });

  const handleApplyAdjustment = () => {
    if (!adjustingProduct) return;
    const newStock = Math.max(0, adjustingProduct.stock + adjustmentValue);
    adjustStock(adjustingProduct.id, newStock);
    setAdjustingProduct(null);
    setAdjustmentValue(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">Inventory Management</h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            Monitor real-time warehouse inventory, stock alerts, and valuation metrics.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Units on Hand</span>
          <span className="text-3xl font-extrabold text-[#0A6375] block mt-1">{totalUnits}</span>
          <span className="text-[11px] text-slate-400">Across {products.length} product SKUs</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Retail Inventory Value</span>
          <span className="text-3xl font-extrabold text-[#1CBBB4] block mt-1">
            ${totalRetailValuation.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400">Gross storefront retail</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Estimated COGS Asset</span>
          <span className="text-3xl font-extrabold text-[#F7941E] block mt-1">
            ${totalCostValuation.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400">Raw beechwood & production</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search inventory by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-nunito font-bold text-[#0F172A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold font-nunito">
          {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                statusFilter === st
                  ? 'bg-[#0A6375] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-[#FFEFE4]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-nunito">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FFEFE4]/40 text-[#0A6375] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Toy SKU & Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">On Hand</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Retail Value</th>
                <th className="py-3.5 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl bg-[#FFEFE4] overflow-hidden shrink-0 border border-slate-200">
                        <Image src={prod.primaryImage} alt={prod.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0F172A] line-clamp-1">{prod.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {prod.variants[0]?.sku || 'WS-SKU'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-600">{prod.category}</td>

                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-sm text-[#0F172A]">{prod.stock} units</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        prod.stock > 20
                          ? 'bg-[#008000]/10 text-[#008000]'
                          : prod.stock > 0
                          ? 'bg-[#F7941E]/10 text-[#F7941E]'
                          : 'bg-[#EB1551]/10 text-[#EB1551]'
                      }`}
                    >
                      {prod.stock > 20 ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> In Stock
                        </>
                      ) : prod.stock > 0 ? (
                        <>
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </>
                      ) : (
                        'Out of Stock'
                      )}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-[#0A6375]">
                    ${(prod.stock * prod.basePrice).toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setAdjustingProduct(prod);
                        setAdjustmentValue(0);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#1CBBB4] hover:text-[#0A6375] font-bold text-xs"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAdjustingProduct(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <h3 className="font-bubblegum text-2xl text-[#0A6375]">
              Adjust Stock: {adjustingProduct.title}
            </h3>
            <p className="text-xs text-[#6B6B84] font-nunito">
              Current warehouse stock: <strong className="text-[#0F172A]">{adjustingProduct.stock} units</strong>
            </p>

            <div className="p-4 rounded-2xl bg-[#FFEFE4] flex items-center justify-between">
              <span className="text-xs font-bold text-[#0A6375]">Delta Adjustment:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdjustmentValue((prev) => prev - 5)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                >
                  -5
                </button>
                <button
                  onClick={() => setAdjustmentValue((prev) => prev - 1)}
                  className="p-1 rounded-lg bg-white border border-slate-200"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-extrabold text-sm text-[#0F172A]">
                  {adjustmentValue > 0 ? `+${adjustmentValue}` : adjustmentValue}
                </span>
                <button
                  onClick={() => setAdjustmentValue((prev) => prev + 1)}
                  className="p-1 rounded-lg bg-white border border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setAdjustmentValue((prev) => prev + 5)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                >
                  +5
                </button>
              </div>
            </div>

            <p className="text-xs text-[#0F172A] font-bold">
              New resulting stock:{' '}
              <span className="text-[#EB1551] font-extrabold">
                {Math.max(0, adjustingProduct.stock + adjustmentValue)} units
              </span>
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyAdjustment}
                className="ws-btn-primary px-6 py-2 text-xs uppercase font-bold"
              >
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
