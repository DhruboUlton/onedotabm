'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Boxes,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Product } from '../../_types';

const baseHref = '/webapp-demo/ecommerce/demo-01';
const adminBase = `${baseHref}/admin`;

export default function AdminProductsPage() {
  const { products, categories, deleteProduct, duplicateProduct, updateProduct } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');

  // Quick Inline Edit Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [quickPrice, setQuickPrice] = useState(0);
  const [quickStock, setQuickStock] = useState(0);

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            (p.bengaliName && p.bengaliName.includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return b.price - a.price;
        if (sortBy === 'stock') return a.stock - b.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, selectedCategory, selectedStatus, search, sortBy]);

  const handleOpenQuickEdit = (p: Product) => {
    setEditingProduct(p);
    setQuickPrice(p.price);
    setQuickStock(p.stock);
  };

  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      price: Number(quickPrice),
      stock: Number(quickStock),
    });
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage product items, prices, inventory batches, and storefront visibility
          </p>
        </div>

        <Link
          href={`${adminBase}/products/new`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#072D24] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c4437] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Product</span>
        </Link>
      </div>

      {/* Filter and search bar */}
      <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, SKU or Bengali title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] py-2 pl-9 pr-4 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-[#DCD6CA] bg-white px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121]"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-[#DCD6CA] bg-white px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-[#DCD6CA] bg-white px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121]"
          >
            <option value="name">Sort by: Name</option>
            <option value="price">Sort by: Price (High to Low)</option>
            <option value="stock">Sort by: Stock (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-[#ECE6DC] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE6DC] text-zinc-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-400">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const isLow = product.stock > 0 && product.stock <= 15;
                  const isOut = product.stock <= 0;

                  return (
                    <tr key={product.id} className="hover:bg-[#FAF8F5] transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg'}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover bg-[#FAF8F5] border border-[#ECE6DC] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-zinc-900 line-clamp-1">{product.name}</p>
                            {product.bengaliName && (
                              <p className="text-[11px] text-zinc-400 line-clamp-1">
                                {product.bengaliName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono font-bold text-zinc-700">
                        {product.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-zinc-600 font-medium">
                        {product.categoryName}
                      </td>

                      {/* Price (Clickable to quick edit) */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleOpenQuickEdit(product)}
                          className="font-bold text-[#E87121] hover:underline"
                          title="Click to quick adjust price"
                        >
                          ৳{product.price.toLocaleString()}
                        </button>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="block text-[10px] text-zinc-400 line-through">
                            ৳{product.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold inline-block rounded-md px-2 py-0.5 text-[11px] ${
                            isOut
                              ? 'bg-rose-100 text-rose-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            updateProduct(product.id, {
                              status: product.status === 'active' ? 'draft' : 'active',
                            })
                          }
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                            product.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                          }`}
                          title="Click to toggle status"
                        >
                          {product.status}
                        </button>
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4">
                        {product.badge ? (
                          <span className="rounded-full bg-[#E87121]/15 px-2 py-0.5 text-[10px] font-bold text-[#E87121]">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-zinc-500">
                          {/* Quick Edit */}
                          <button
                            onClick={() => handleOpenQuickEdit(product)}
                            className="p-1 hover:text-[#072D24] hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Quick Edit Price/Stock"
                          >
                            <Boxes className="h-4 w-4" />
                          </button>

                          {/* Full Edit Page */}
                          <Link
                            href={`${adminBase}/products/${product.id}`}
                            className="p-1 hover:text-[#072D24] hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Edit Product Details"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {/* View on Storefront */}
                          <Link
                            href={`${baseHref}/products/${product.slug}`}
                            target="_blank"
                            className="p-1 hover:text-[#E87121] hover:bg-zinc-100 rounded-lg transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            onClick={() => duplicateProduct(product.id)}
                            className="p-1 hover:text-blue-600 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${product.name}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1 hover:text-rose-600 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Quick Edit Modal (Changes stock or price instantly!) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setEditingProduct(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#ECE6DC] space-y-4">
            <h3 className="text-base font-bold text-[#1F2923]">
              Quick Price & Stock Update
            </h3>
            <p className="text-xs text-zinc-500 font-semibold">{editingProduct.name}</p>

            <form onSubmit={handleSaveQuickEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Price (৳ Taka)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quickPrice}
                  onChange={(e) => setQuickPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Inventory Stock (Units on hand)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={quickStock}
                  onChange={(e) => setQuickStock(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Setting stock to 0 immediately renders &quot;Out of Stock&quot; on the storefront.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#072D24] px-5 py-2 text-xs font-bold text-white hover:bg-[#0c4437]"
                >
                  Save & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
