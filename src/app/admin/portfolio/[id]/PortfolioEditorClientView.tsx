'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Tag,
  Star,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Building2,
  ImageIcon,
} from 'lucide-react';
import { PortfolioItemRecord } from '@/types/database';
import { ClientOption } from '@/lib/services/operationsService';
import { updatePortfolioItemAction, deletePortfolioItemAction } from '../actions';

interface PortfolioEditorClientViewProps {
  item: PortfolioItemRecord;
  clients: ClientOption[];
}

const CATEGORIES = [
  'Websites',
  'E-commerce',
  'Web Applications',
  'Marketing',
  'Branding',
];

export function PortfolioEditorClientView({
  item: initialItem,
  clients,
}: PortfolioEditorClientViewProps) {
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItemRecord>(initialItem);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: item.title,
    slug: item.slug,
    client_id: item.client_id || '',
    category: item.category,
    description: item.description || '',
    featured_image: item.featured_image || '',
    gallery: (item.gallery || []).join('\n'),
    services: (item.services || []).join(', '),
    technologies: (item.technologies || []).join(', '),
    project_url: item.project_url || '',
    completion_date: item.completion_date ? item.completion_date.split('T')[0] : '',
    featured: item.featured,
    published: item.published,
    sort_order: item.sort_order,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Title is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    const galleryArray = formData.gallery
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const servicesArray = formData.services
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const technologiesArray = formData.technologies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await updatePortfolioItemAction(item.id, {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      client_id: formData.client_id || null,
      category: formData.category,
      description: formData.description || null,
      featured_image: formData.featured_image || null,
      gallery: galleryArray,
      services: servicesArray,
      technologies: technologiesArray,
      project_url: formData.project_url || null,
      completion_date: formData.completion_date || null,
      featured: formData.featured,
      published: formData.published,
      sort_order: Number(formData.sort_order) || 0,
    });

    setIsSaving(false);

    if (res.success && res.data) {
      setItem(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    } else {
      setErrorMessage(res.error || 'Failed to save changes');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    const res = await deletePortfolioItemAction(item.id);
    if (res.success) {
      router.push('/admin/portfolio');
    } else {
      alert(res.error || 'Failed to delete item');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="p-2 rounded-lg bg-white border border-[#E5E5E2] text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] tracking-tight">{item.title}</h1>
            <p className="text-xs font-mono text-[#858585] mt-0.5">
              Portfolio Item Editor • /{item.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {item.project_url && (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Delete Portfolio Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Portfolio item updated successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Layout (2 Cols: Form + Sidebar Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#111111]">General Information</h2>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Category</label>
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

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Executive Summary / Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
              />
            </div>
          </div>

          {/* Media & Gallery */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#1400FF]" />
              <span>Media & Assets</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Featured Cover Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or /images/..."
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
              />
              {formData.featured_image && (
                <div className="mt-3 relative h-48 w-full rounded-xl overflow-hidden border border-[#E5E5E2] bg-[#F7F7F5]">
                  <img
                    src={formData.featured_image}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Gallery Image URLs (One per line)
              </label>
              <textarea
                rows={3}
                placeholder="https://...&#10;https://..."
                value={formData.gallery}
                onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white font-mono text-xs"
              />
            </div>
          </div>

          {/* Tags & Taxonomy */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#111111]">Capabilities & Stack Tags</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Services Provided (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.services
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {s}
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.technologies
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {t}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Publishing & Relationships */}
        <div className="space-y-6">
          {/* Publishing Settings */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111]">Publishing Status</h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-[#E5E5E2] hover:bg-[#F9F9F8] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  {formData.published ? (
                    <Eye className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-[#858585]" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-[#111111] block">Published</span>
                    <span className="text-[11px] text-[#858585]">Visible on the live website</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1400FF] focus:ring-[#1400FF]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[#E5E5E2] hover:bg-[#F9F9F8] cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <Star
                    className={`w-4 h-4 ${
                      formData.featured ? 'text-amber-500 fill-amber-500' : 'text-[#858585]'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#111111] block">
                      Featured Showcase
                    </span>
                    <span className="text-[11px] text-[#858585]">
                      Highlighted on home & work landing
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1400FF] focus:ring-[#1400FF]"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-[#E5E5E2]">
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
              <span className="text-[10px] text-[#858585] mt-1 block">
                Lower numbers appear first in the directory (e.g. 0, 1, 2).
              </span>
            </div>
          </div>

          {/* Client & External Links */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111]">Client & Execution</h3>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Associated Client
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              >
                <option value="">None / Independent Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Live Project URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Completion Date
              </label>
              <input
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
