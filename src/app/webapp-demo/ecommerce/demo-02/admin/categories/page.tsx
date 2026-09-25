'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { Category } from '../../_types';
import { FolderTree, Plus, Trash2, Edit2, Eye, EyeOff, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('/demo-assets/ecommerce/demo-02/poster-porsche-gt3.jpg');
  const [description, setDescription] = useState('');

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      slug: slug.trim() || 'cat-' + Date.now(),
      image,
      isVisible: true,
      order: categories.length + 1,
      description: description.trim(),
    });

    setName('');
    setSlug('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Catalog Taxonomy
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Categories & Genres
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Organize glass posters by automotive, anime, motivational, and spiritual wall art categories.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Poster Count</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.slug).length;
                return (
                  <tr key={c.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900">{c.name}</p>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">{c.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-500">{c.slug}</td>

                    <td className="py-3.5 px-4 font-bold text-zinc-900">{count} designs</td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => updateCategory(c.id, { isVisible: !c.isVisible })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                          c.isVisible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                        }`}
                      >
                        {c.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {c.isVisible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-extrabold text-base text-zinc-900">Add New Category</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cinema & Marvel Legends"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. High-definition Marvel superhero artwork on glass."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-xl font-bold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 cursor-pointer shadow-xs"
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
