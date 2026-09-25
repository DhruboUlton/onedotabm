'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';
import { Banner } from '../../_types';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
  ImageIcon,
} from 'lucide-react';

export default function AdminBannersPage() {
  const { banners, updateBanner, addBanner, deleteBanner, showToast } = useStore();

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    ctaText: 'Explore Collections',
    ctaUrl: '/webapp-demo/ecommerce/demo-02/products',
    image: '/demo-assets/ecommerce/demo-02/hero-banner.jpg',
    type: 'hero_main' as Banner['type'],
    isActive: true,
  });

  const availableImages = [
    { label: 'Hero 4-Piece Living Room Showcase', url: '/demo-assets/ecommerce/demo-02/hero-banner.jpg' },
    { label: 'Glass Craftsmanship & Reflection Feature', url: '/demo-assets/ecommerce/demo-02/spec-glass-feature.jpg' },
    { label: 'Red Bull Racing F1 Glass Wall', url: '/demo-assets/ecommerce/demo-02/poster-f1-redbull.jpg' },
    { label: 'Porsche 911 GT3 RS Obsidian Black', url: '/demo-assets/ecommerce/demo-02/poster-porsche-gt3.jpg' },
    { label: 'Cyberpunk Neo Tokyo Neon Art', url: '/demo-assets/ecommerce/demo-02/poster-anime-cyberpunk.jpg' },
    { label: 'Ayatul Kursi Gold Islamic Art', url: '/demo-assets/ecommerce/demo-02/poster-islamic-calligraphy.jpg' },
    { label: 'Wall Street Charging Bull Gold', url: '/demo-assets/ecommerce/demo-02/poster-wallstreet-bull.jpg' },
    { label: 'Midnight Football Arena Floodlights', url: '/demo-assets/ecommerce/demo-02/poster-football-stadium.jpg' },
  ];

  const handleOpenAdd = () => {
    setFormData({
      title: 'New Luxury Glass Art Collection',
      tagline: 'PREMIUM INTERIOR STATEMENT',
      description: 'Hand-inspected 4mm diamond tempered glass posters with rich optical luminosity.',
      ctaText: 'Shop New Arrivals',
      ctaUrl: '/webapp-demo/ecommerce/demo-02/products',
      image: '/demo-assets/ecommerce/demo-02/hero-banner.jpg',
      type: 'hero_main',
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      tagline: b.tagline || '',
      description: b.description,
      ctaText: b.ctaText,
      ctaUrl: b.ctaUrl,
      image: b.image,
      type: b.type,
      isActive: b.isActive,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    updateBanner(editingBanner.id, {
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      ctaText: formData.ctaText,
      ctaUrl: formData.ctaUrl,
      image: formData.image,
      type: formData.type,
      isActive: formData.isActive,
    });

    setEditingBanner(null);
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    addBanner({
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      ctaText: formData.ctaText,
      ctaUrl: formData.ctaUrl,
      image: formData.image,
      type: formData.type,
      isActive: formData.isActive,
      order: banners.length + 1,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Marketing & Visual Merchandising
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Homepage Banner Manager
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure primary hero slides, seasonal marketing highlights, and promotional banners with live preview.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Main Grid: Banners list + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Banner List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-4 flex items-center justify-between">
              <span>Active & Scheduled Banners ({banners.length})</span>
              <span className="text-xs font-normal text-zinc-500">Instant storefront sync</span>
            </h2>

            <div className="space-y-3">
              {banners.map((b, idx) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border transition-all ${
                    editingBanner?.id === b.id
                      ? 'border-black ring-2 ring-black/5 bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-zinc-200">
                      <Image
                        src={b.image}
                        alt={b.title}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          {b.type.replace('_', ' ')}
                        </span>
                        {b.isActive ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                        {b.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                        {b.description}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" /> Edit Slide
                        </button>
                        <button
                          onClick={() => updateBanner(b.id, { isActive: !b.isActive })}
                          className="text-zinc-600 hover:text-black cursor-pointer"
                        >
                          {b.isActive ? 'Deactivate' : 'Publish'}
                        </button>
                        {banners.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete banner "${b.title}"?`)) {
                                deleteBanner(b.id);
                              }
                            }}
                            className="text-rose-600 hover:text-rose-700 cursor-pointer ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-zinc-900">Storefront Live Preview</h3>
              </div>
              <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                16:9 Aspect
              </span>
            </div>

            {/* Mock Storefront Hero Rendering */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-zinc-200 bg-zinc-950 text-white shadow-inner flex flex-col justify-end p-5">
              <Image
                src={
                  editingBanner
                    ? formData.image
                    : banners[0]?.image || '/demo-assets/ecommerce/demo-02/hero-banner.jpg'
                }
                alt="Banner preview"
                fill
                className="object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              <div className="relative z-10 space-y-2">
                <span className="inline-block text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/20 backdrop-blur-md px-2 py-0.5 rounded">
                  {editingBanner ? formData.tagline || 'HERO SPOTLIGHT' : banners[0]?.tagline || 'SPOTLIGHT'}
                </span>
                <h4 className="text-sm sm:text-base font-black leading-tight text-white line-clamp-2">
                  {editingBanner ? formData.title : banners[0]?.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {editingBanner ? formData.description : banners[0]?.description}
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-bold text-[10px] rounded-lg shadow-sm">
                    {editingBanner ? formData.ctaText : banners[0]?.ctaText || 'Shop Now'}
                    <span className="text-[9px]">→</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 text-center mt-3">
              This preview matches the top hero section of the main storefront homepage.
            </p>
          </div>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {(editingBanner || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200 my-8">
            <h2 className="text-lg font-extrabold text-zinc-900 mb-1">
              {editingBanner ? 'Edit Homepage Banner' : 'Create New Banner'}
            </h2>
            <p className="text-xs text-zinc-500 mb-5">
              Update marketing copy, call-to-action buttons, and featured background image.
            </p>

            <form
              onSubmit={editingBanner ? handleSaveEdit : handleCreateBanner}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Tagline / Overline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. ULTRA-REFLECTIVE GLASS POSTERS"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Main Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Description / Body Text
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Button CTA Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Button Destination URL
                  </label>
                  <input
                    type="text"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Select Banner Image Asset
                </label>
                <select
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white font-medium"
                >
                  {availableImages.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span>Publish banner immediately on storefront</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBanner(null);
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
