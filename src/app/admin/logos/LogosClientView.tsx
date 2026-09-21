'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Plus,
  ExternalLink,
  Star,
  Trash2,
  Edit3,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  ArrowUpDown,
  ImageIcon,
} from 'lucide-react';
import { LogoRecord } from '@/types/database';
import { createLogoAction, updateLogoAction, deleteLogoAction } from './actions';

interface LogosClientViewProps {
  initialLogos: LogoRecord[];
}

const CATEGORIES = ['Client', 'Partner', 'Portfolio', 'Enterprise', 'EdTech', 'Retail'];

export function LogosClientView({ initialLogos }: LogosClientViewProps) {
  const router = useRouter();
  const [logos, setLogos] = useState<LogoRecord[]>(initialLogos);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<LogoRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    company_name: '',
    logo_url: '',
    website: '',
    category: 'Client',
    featured: true,
    display_order: 0,
    published: true,
  });

  const filteredLogos = logos.filter((logo) => {
    if (selectedCategory === 'all') return true;
    return logo.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Metrics
  const totalCount = logos.length;
  const publishedCount = logos.filter((l) => l.published).length;
  const featuredCount = logos.filter((l) => l.featured).length;

  const openCreateModal = () => {
    setEditingLogo(null);
    setFormData({
      company_name: '',
      logo_url: '',
      website: '',
      category: 'Client',
      featured: true,
      display_order: logos.length,
      published: true,
    });
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const openEditModal = (logo: LogoRecord) => {
    setEditingLogo(logo);
    setFormData({
      company_name: logo.company_name,
      logo_url: logo.logo_url,
      website: logo.website || '',
      category: logo.category,
      featured: logo.featured,
      display_order: logo.display_order,
      published: logo.published,
    });
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim() || !formData.logo_url.trim()) {
      setErrorMessage('Company Name and Logo URL are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    if (editingLogo) {
      const res = await updateLogoAction(editingLogo.id, {
        company_name: formData.company_name.trim(),
        logo_url: formData.logo_url.trim(),
        website: formData.website || null,
        category: formData.category,
        featured: formData.featured,
        display_order: Number(formData.display_order) || 0,
        published: formData.published,
      });

      setIsSubmitting(false);

      if (res.success && res.data) {
        setLogos(logos.map((l) => (l.id === editingLogo.id ? res.data! : l)));
        setIsModalOpen(false);
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to update logo');
      }
    } else {
      const res = await createLogoAction({
        company_name: formData.company_name.trim(),
        logo_url: formData.logo_url.trim(),
        website: formData.website || null,
        category: formData.category,
        featured: formData.featured,
        display_order: Number(formData.display_order) || 0,
        published: formData.published,
      });

      setIsSubmitting(false);

      if (res.success && res.data) {
        setLogos([...logos, res.data]);
        setIsModalOpen(false);
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to add logo');
      }
    }
  };

  const handleTogglePublished = async (logo: LogoRecord) => {
    const nextState = !logo.published;
    setLogos(logos.map((l) => (l.id === logo.id ? { ...l, published: nextState } : l)));

    const res = await updateLogoAction(logo.id, { published: nextState });
    if (!res.success) {
      setLogos(logos.map((l) => (l.id === logo.id ? { ...l, published: logo.published } : l)));
      alert(res.error || 'Failed to toggle publication');
    }
  };

  const handleToggleFeatured = async (logo: LogoRecord) => {
    const nextFeatured = !logo.featured;
    setLogos(logos.map((l) => (l.id === logo.id ? { ...l, featured: nextFeatured } : l)));

    const res = await updateLogoAction(logo.id, { featured: nextFeatured });
    if (!res.success) {
      setLogos(logos.map((l) => (l.id === logo.id ? { ...l, featured: logo.featured } : l)));
      alert(res.error || 'Failed to toggle featured');
    }
  };

  const handleOrderChange = async (logo: LogoRecord, newOrder: number) => {
    setLogos(
      logos.map((l) => (l.id === logo.id ? { ...l, display_order: newOrder } : l))
    );
    await updateLogoAction(logo.id, { display_order: newOrder });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the logo cloud?`)) return;

    const res = await deleteLogoAction(id);
    if (res.success) {
      setLogos(logos.filter((l) => l.id !== id));
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete logo');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Client Logos Cloud</h1>
          <p className="text-sm text-[#858585] mt-1">
            Manage trusted brand partners, client badges, display order, and homepage social proof marquee.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Logo</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Total Brand Logos
            </span>
            <Building2 className="w-4 h-4 text-[#858585]" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{totalCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Active in Cloud
            </span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{publishedCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Featured Brands
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{featuredCount}</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-3 rounded-xl border border-[#E5E5E2]">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#1400FF] text-white'
              : 'bg-[#F0F0ED] text-[#555555] hover:bg-[#E5E5E2]'
          }`}
        >
          All ({logos.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = logos.filter(
            (l) => l.category.toLowerCase() === cat.toLowerCase()
          ).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#1400FF] text-white'
                  : 'bg-[#F0F0ED] text-[#555555] hover:bg-[#E5E5E2]'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Logos Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredLogos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-[#858585] bg-white rounded-xl border border-dashed border-[#E5E5E2]">
            No logos found matching category. Click &ldquo;Add Client Logo&rdquo; above.
          </div>
        ) : (
          filteredLogos.map((logo) => (
            <div
              key={logo.id}
              className={`p-5 rounded-xl border bg-white flex flex-col justify-between transition-all hover:shadow-xs ${
                logo.published ? 'border-[#E5E5E2]' : 'border-zinc-200 opacity-60'
              }`}
            >
              <div className="space-y-4">
                {/* Visual Logo Container */}
                <div className="h-20 w-full rounded-lg bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center p-3 relative group">
                  {logo.logo_url ? (
                    <img
                      src={logo.logo_url}
                      alt={logo.company_name}
                      className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).nextElementSibling;
                        if (fallback) (fallback as HTMLElement).style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span
                    style={{ display: logo.logo_url ? 'none' : 'block' }}
                    className="font-mono text-xs font-bold text-[#111111] tracking-wider text-center"
                  >
                    {logo.company_name}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[#111111] truncate">
                      {logo.company_name}
                    </h3>
                    <button
                      onClick={() => handleToggleFeatured(logo)}
                      className={`p-1 rounded ${
                        logo.featured
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${logo.featured ? 'fill-amber-500' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#858585] mt-1">
                    <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-medium text-[#555555]">
                      {logo.category}
                    </span>
                    {logo.website && (
                      <a
                        href={
                          logo.website.startsWith('http')
                            ? logo.website
                            : `https://${logo.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1400FF] hover:underline inline-flex items-center gap-0.5 text-[11px]"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-4 mt-4 border-t border-[#E5E5E2] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#858585]">Order:</span>
                  <input
                    type="number"
                    value={logo.display_order}
                    onChange={(e) => handleOrderChange(logo, Number(e.target.value))}
                    className="w-12 px-1.5 py-0.5 text-xs font-mono text-center rounded border border-[#E5E5E2] bg-[#F7F7F5] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublished(logo)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      logo.published
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-zinc-400 hover:bg-zinc-100'
                    }`}
                    title={logo.published ? 'Visible (Click to hide)' : 'Hidden (Click to show)'}
                  >
                    {logo.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => openEditModal(logo)}
                    className="p-1.5 text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                    title="Edit Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(logo.id, logo.company_name)}
                    className="p-1.5 text-[#858585] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5E2] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111111]">
                {editingLogo ? 'Edit Client Logo' : 'Add Brand Logo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-black hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Company / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solution Point"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Logo Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://... or /logos/brand.svg"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
                {formData.logo_url && (
                  <div className="mt-2.5 h-16 w-full rounded-lg bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-center p-2">
                    <img
                      src={formData.logo_url}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://client.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-2 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111]">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1400FF] focus:ring-[#1400FF]"
                    />
                    <span>Active in Cloud</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111]">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1400FF] focus:ring-[#1400FF]"
                    />
                    <span>Featured Brand</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#555555] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingLogo
                    ? 'Update Logo'
                    : 'Add Logo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
