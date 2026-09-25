'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  BookmarkCheck,
  Search,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  X,
  Save,
} from 'lucide-react';

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  featured: boolean;
  status: 'Published' | 'Draft';
}

const initialCollections: CollectionItem[] = [
  { id: 'col-1', name: 'Creator Workstations 2026', slug: 'creator-workstations', description: 'Color-accurate Liquid OLED laptops and M5 Pro chipsets for studio professionals.', productCount: 6, featured: true, status: 'Published' },
  { id: 'col-2', name: 'Minimalist Desktop Ecosystem', slug: 'minimalist-desktop', description: 'GaN power docks, magnetic wireless chargers, and mechanical peripherals.', productCount: 8, featured: true, status: 'Published' },
  { id: 'col-3', name: 'Esports Competitive Hardware', slug: 'esports-competitive', description: 'Hall-effect low-latency controllers, mechanical switches, and high-DPI mice.', productCount: 5, featured: false, status: 'Published' },
  { id: 'col-4', name: 'Reference Spatial Audio', slug: 'reference-audio', description: 'Studio-grade ANC headphones and lossless DAC amplifiers.', productCount: 4, featured: true, status: 'Published' },
];

export default function AdminCollectionsPage() {
  const { showToast } = useStore();
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const filtered = collections.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFeatured = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
    showToast('Collection Updated', 'Featured status updated', 'info');
  };

  const handleDelete = (id: string, name: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    showToast('Collection Removed', `Deleted "${name}"`, 'info');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const newCol: CollectionItem = {
      id: `col-${Date.now()}`,
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      productCount: 0,
      featured: false,
      status: 'Published',
    };
    setCollections([newCol, ...collections]);
    showToast('Collection Created', `Published "${formData.name}"`, 'success');
    setIsModalOpen(false);
    setFormData({ name: '', slug: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Curated Collections
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Group hardware into editorial theme bundles, promotional lookbooks, and seasonal campaigns.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{c.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">/collections/{c.slug}</span>
                </div>
                <button
                  onClick={() => handleToggleFeatured(c.id)}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                    c.featured ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{c.featured ? 'Featured' : 'Standard'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {c.description}
              </p>

              <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{c.productCount} curated devices linked</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                href={`/webapp-demo/ecommerce/demo-03/products`}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View on Store</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">Create Editorial Collection</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold rounded-xl text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white">
                  Publish Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
