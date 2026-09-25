'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Product } from '../../_types';
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
  Sliders,
  X,
  Check,
  AlertCircle,
  Star,
  Eye,
} from 'lucide-react';

const adminBase = '/webapp-demo/ecommerce/demo-02/admin';
const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function AdminProductsPage() {
  const { products, categories, updateProduct, deleteProduct, duplicateProduct, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Quick edit modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [quickPrice, setQuickPrice] = useState(0);
  const [quickStock, setQuickStock] = useState(0);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenQuickEdit = (p: Product) => {
    setEditingProduct(p);
    setQuickPrice(p.price);
    setQuickStock(p.stock);
  };

  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      price: quickPrice,
      stock: quickStock,
    });
    setEditingProduct(null);
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      deleteProduct(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Glass Catalogue Manager
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Products & Glass Wall Art
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage pricing, inventory levels, badges, and sizing options for all glass posters.
          </p>
        </div>

        <Link
          href={`${adminBase}/products/new`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Glass Poster</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search glass posters by name, SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-zinc-200 rounded-xl text-xs px-3 py-2 bg-white text-zinc-700 focus:outline-hidden focus:border-black"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-zinc-200 rounded-xl text-xs px-3 py-2 bg-white text-zinc-700 focus:outline-hidden focus:border-black"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <th className="py-3 px-4">Glass Poster</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    No glass posters found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Visual & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`${adminBase}/products/${product.id}`}
                            className="font-bold text-zinc-900 hover:text-black line-clamp-1 text-xs"
                          >
                            {product.name}
                          </Link>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{product.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-zinc-700">{product.categoryName}</td>

                    <td className="py-3.5 px-4 font-extrabold text-zinc-900">
                      ৳{product.price.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${
                          product.stock <= 0
                            ? 'bg-rose-50 text-rose-700'
                            : product.stock <= 10
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          product.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {product.badge ? (
                        <span className="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`${baseHref}/products/${product.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenQuickEdit(product)}
                          title="Quick Price & Stock"
                          className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`${adminBase}/products/${product.id}`}
                          title="Full Edit Form"
                          className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => duplicateProduct(product.id)}
                          title="Duplicate Poster"
                          className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(product)}
                          title="Delete / Archive"
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit Price & Stock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-extrabold text-sm text-zinc-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-black" />
                Quick Stock & Price Sync
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-zinc-700 mb-4 line-clamp-1">
              {editingProduct.name}
            </p>

            <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Base Price (৳)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={quickPrice}
                  onChange={(e) => setQuickPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-sm focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Inventory Count (Units)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={quickStock}
                  onChange={(e) => setQuickStock(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-sm focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-xl font-bold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Save & Sync Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-sm text-zinc-900 mb-2">Delete Glass Poster?</h3>
            <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
              Are you sure you want to remove &quot;{deleteCandidate.name}&quot;? It will be immediately delisted from the active customer storefront.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-bold cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
