'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Layers, Plus, Edit2, Trash2, Eye, EyeOff, X, Check } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Category } from '../../_types';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategoryVisibility } =
    useStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/demo-assets/ecommerce/demo-04/abacus-board.jpg');

  const openCreator = () => {
    setEditingCategory(null);
    setIsCreating(true);
    setName('');
    setSlug('');
    setDescription('Montessori developmental activity collection.');
    setImage('/demo-assets/ecommerce/demo-04/abacus-board.jpg');
  };

  const openEditor = (c: Category) => {
    setEditingCategory(c);
    setIsCreating(false);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description);
    setImage(c.image);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (isCreating) {
      addCategory({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        image,
        productCount: 0,
        isVisible: true,
        displayOrder: categories.length + 1,
      });
    } else if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        slug: slug || editingCategory.slug,
        description,
        image,
      });
    }

    setEditingCategory(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">Category Taxonomy</h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            Manage educational categories and organize storefront navigation visibility.
          </p>
        </div>

        <button
          onClick={openCreator}
          className="ws-btn-primary px-5 py-2.5 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-nunito">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FFEFE4]/40 text-[#0A6375] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Category Details</th>
                <th className="py-3.5 px-4">Slug Identifier</th>
                <th className="py-3.5 px-4">Catalog Count</th>
                <th className="py-3.5 px-4">Storefront Display</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-[#FFEFE4] overflow-hidden shrink-0 border border-slate-200">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0F172A]">{cat.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{cat.description}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600">/collection/{cat.slug}</td>

                  <td className="py-3.5 px-4 font-bold text-[#0A6375]">
                    {cat.productCount} products
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleCategoryVisibility(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                        cat.isVisible
                          ? 'bg-[#008000]/10 text-[#008000]'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{cat.isVisible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditor(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0A6375] hover:bg-slate-100"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#EB1551] hover:bg-slate-100"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {(editingCategory || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setEditingCategory(null);
              setIsCreating(false);
            }}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bubblegum text-2xl text-[#0A6375]">
                {isCreating ? 'Create Category' : `Edit: ${editingCategory?.name}`}
              </h3>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCreating(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 font-nunito text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Slug URL</label>
                <input
                  type="text"
                  placeholder="e.g. montessori-learning"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="ws-btn-primary px-6 py-2 text-xs uppercase font-bold">
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
