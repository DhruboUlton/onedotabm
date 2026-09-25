'use client';

import React, { useState } from 'react';
import { FolderTree, Plus, Trash2, Edit, Check, X, ArrowUpDown, Eye } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { ProductCategory } from '../../_types';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [bengaliName, setBengaliName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    addCategory({
      name,
      bengaliName,
      slug,
      iconName: 'Sparkles',
      productCount: 0,
      order: categories.length + 1,
      isActive: true,
      description,
    });

    setName('');
    setBengaliName('');
    setSlug('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Organize store hierarchy, navigation taxonomy, and category merchandising
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#072D24] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c4437] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-[#ECE6DC] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE6DC] text-zinc-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Bengali Title</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Active Products</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {categories.map((cat, idx) => {
                const count = products.filter((p) => p.category === cat.slug).length;

                return (
                  <tr key={cat.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-400">
                      #{idx + 1}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-zinc-900">
                      {cat.name}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-600 font-medium">
                      {cat.bengaliName || '—'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-500">
                      {cat.slug}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#E87121]">{count} products</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                          cat.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {cat.isActive ? 'Visible' : 'Hidden'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#ECE6DC] space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#1F2923]">Add New Category</h3>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Seeds"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Bengali Title</label>
                <input
                  type="text"
                  placeholder="e.g. অর্গানিক সীডস"
                  value={bengaliName}
                  onChange={(e) => setBengaliName(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0ECE4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#072D24] px-5 py-2 font-bold text-white hover:bg-[#0c4437]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
