'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';

const baseHref = '/webapp-demo/ecommerce/demo-01';

export default function AdminInventoryPage() {
  const { products, updateProduct } = useStore();
  const [search, setSearch] = useState('');

  // Calculations
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const retailValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const costValue = Math.round(retailValue * 0.65);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 15).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdjustStock = (productId: string, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    updateProduct(productId, { stock: nextStock });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor real-time warehouse stock, batches, and storefront synchronization
          </p>
        </div>

        <Link
          href={`${baseHref}/products`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#072D24] px-4 py-2 text-xs font-bold text-[#072D24] hover:bg-[#072D24] hover:text-white transition-all"
        >
          <span>Verify on Storefront</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Total Units on Hand</span>
          <p className="mt-2 text-2xl font-extrabold text-[#1F2923]">{totalUnits} units</p>
          <span className="mt-1 text-[11px] text-zinc-400">Across {products.length} SKUs</span>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Retail Inventory Value</span>
          <p className="mt-2 text-2xl font-extrabold text-[#E87121]">
            ৳{retailValue.toLocaleString()}
          </p>
          <span className="mt-1 text-[11px] text-zinc-400">Current selling prices</span>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Estimated Cost Value</span>
          <p className="mt-2 text-2xl font-extrabold text-[#072D24]">
            ৳{costValue.toLocaleString()}
          </p>
          <span className="mt-1 text-[11px] text-zinc-400">At ~65% wholesale cost</span>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Restock Requirements</span>
          <p className="mt-2 text-2xl font-extrabold text-rose-600">
            {outOfStockCount + lowStockCount}
          </p>
          <span className="mt-1 text-[11px] text-zinc-500">
            {outOfStockCount} out of stock, {lowStockCount} low
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search inventory by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#DCD6CA] bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121]"
        />
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-[#ECE6DC] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE6DC] text-zinc-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Stock on Hand</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filtered.map((product) => {
                const isOut = product.stock <= 0;
                const isLow = product.stock > 0 && product.stock <= 15;

                return (
                  <tr key={product.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover bg-zinc-100 border border-[#ECE6DC]"
                        />
                        <div>
                          <p className="font-bold text-zinc-900 line-clamp-1">{product.name}</p>
                          <p className="text-[11px] text-zinc-400">{product.categoryName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-700">
                      {product.sku}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-zinc-900">
                      ৳{product.price.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-sm font-extrabold text-zinc-900">
                        {product.stock}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isOut
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center rounded-xl border border-[#DCD6CA] bg-white shadow-xs">
                        <button
                          onClick={() => handleAdjustStock(product.id, product.stock, -5)}
                          className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 rounded-l-xl transition-colors font-bold"
                          title="Decrease by 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(product.id, product.stock, -1)}
                          className="px-2 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                          title="Decrease by 1"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center font-bold text-zinc-900">
                          {product.stock}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(product.id, product.stock, 1)}
                          className="px-2 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                          title="Increase by 1"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(product.id, product.stock, 10)}
                          className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 rounded-r-xl transition-colors font-bold text-emerald-700"
                          title="Add 10 units"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
