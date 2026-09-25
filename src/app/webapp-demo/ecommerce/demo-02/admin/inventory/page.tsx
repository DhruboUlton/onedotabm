'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Boxes, Search, Plus, Minus, AlertTriangle, CheckCircle2, Sliders } from 'lucide-react';

const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function AdminInventoryPage() {
  const { products, adjustStock } = useStore();
  const [search, setSearch] = useState('');

  const totalUnitsOnHand = products.reduce((acc, p) => acc + p.stock, 0);
  const totalRetailValue = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const totalValueAtCost = Math.round(totalRetailValue * 0.38); // cost of tempered glass + float ink ~38%

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Warehouse & Stock Control
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Inventory & Float Glass Raw Stock
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Reconcile warehouse inventory, quick-adjust safety stock, and audit asset valuations.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-zinc-400">Units On Hand</span>
          <h3 className="text-2xl font-black text-zinc-900 mt-1">{totalUnitsOnHand}</h3>
          <p className="text-[11px] text-zinc-500 mt-1">Across all glass variants</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-zinc-400">Total Retail Value</span>
          <h3 className="text-2xl font-black text-zinc-900 mt-1">৳{totalRetailValue.toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Ready for fulfillment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-zinc-400">Estimated Cost Value</span>
          <h3 className="text-2xl font-black text-zinc-600 mt-1">৳{totalValueAtCost.toLocaleString()}</h3>
          <p className="text-[11px] text-zinc-500 mt-1">Raw glass & sublimation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-zinc-400">Low Stock Alert</span>
          <h3 className="text-2xl font-black text-amber-500 mt-1">
            {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
          </h3>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Needs tempering batch</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory by title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
          />
        </div>
        <span className="text-xs font-medium text-zinc-400">
          {filteredProducts.length} items listed
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <th className="py-3 px-4">Glass Poster</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">In Stock</th>
                <th className="py-3 px-4">Reserved</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-zinc-400">{p.categoryName}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-700">{p.sku}</td>

                  <td className="py-3.5 px-4 font-black text-sm text-zinc-900">
                    {p.stock}
                  </td>

                  <td className="py-3.5 px-4 text-zinc-500 font-medium">
                    2 reserved
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock <= 0
                          ? 'bg-rose-50 text-rose-700'
                          : p.stock <= 10
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {p.stock <= 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>

                  {/* Stock adjuster buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => adjustStock(p.id, -5)}
                        className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md font-mono text-[11px] font-bold"
                        title="Reduce 5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => adjustStock(p.id, -1)}
                        className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md font-mono text-[11px] font-bold"
                        title="Reduce 1"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => adjustStock(p.id, 1)}
                        className="px-2 py-1 bg-black hover:bg-zinc-800 text-white rounded-md font-mono text-[11px] font-bold"
                        title="Add 1"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => adjustStock(p.id, 10)}
                        className="px-2 py-1 bg-black hover:bg-zinc-800 text-white rounded-md font-mono text-[11px] font-bold"
                        title="Add 10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
