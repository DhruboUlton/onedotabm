'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Star,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  Tag,
  Eye,
  EyeOff,
} from 'lucide-react';
import { PortfolioItemRecord } from '@/types/database';
import { ClientOption } from '@/lib/services/operationsService';
import {
  createPortfolioItemAction,
  deletePortfolioItemAction,
  togglePortfolioPublishedAction,
  updatePortfolioItemAction,
} from './actions';

interface PortfolioClientViewProps {
  initialItems: PortfolioItemRecord[];
  clients: ClientOption[];
}

const CATEGORIES = [
  'Websites',
  'E-commerce',
  'Web Applications',
  'Marketing',
  'Branding',
];

export function PortfolioClientView({ initialItems, clients }: PortfolioClientViewProps) {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItemRecord[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client_id: '',
    category: 'Web Applications',
    description: '',
    featured_image: '',
    services: 'Web Development, UI/UX Design',
    technologies: 'Next.js, TypeScript, Tailwind CSS',
    project_url: '',
    completion_date: new Date().toISOString().split('T')[0],
    featured: false,
    published: true,
    sort_order: 0,
  });

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.services && item.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.technologies &&
        item.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.published) ||
      (statusFilter === 'draft' && !item.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Metrics
  const totalItems = items.length;
  const publishedCount = items.filter((i) => i.published).length;
  const draftCount = items.filter((i) => !i.published).length;
  const featuredCount = items.filter((i) => i.featured).length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Title is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await createPortfolioItemAction({
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      client_id: formData.client_id || null,
      category: formData.category,
      description: formData.description || null,
      featured_image: formData.featured_image || null,
      services: formData.services
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      project_url: formData.project_url || null,
      completion_date: formData.completion_date || null,
      featured: formData.featured,
      published: formData.published,
      sort_order: Number(formData.sort_order) || 0,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setItems([res.data, ...items]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        slug: '',
        client_id: '',
        category: 'Web Applications',
        description: '',
        featured_image: '',
        services: 'Web Development, UI/UX Design',
        technologies: 'Next.js, TypeScript, Tailwind CSS',
        project_url: '',
        completion_date: new Date().toISOString().split('T')[0],
        featured: false,
        published: true,
        sort_order: 0,
      });
      router.refresh();
    } else {
      setErrorMessage(res.error || 'Failed to create portfolio item');
    }
  };

  const handleTogglePublished = async (item: PortfolioItemRecord) => {
    const nextState = !item.published;
    setItems(items.map((i) => (i.id === item.id ? { ...i, published: nextState } : i)));

    const res = await togglePortfolioPublishedAction(item.id, nextState);
    if (!res.success) {
      setItems(items.map((i) => (i.id === item.id ? { ...i, published: item.published } : i)));
      alert(res.error || 'Failed to update publication status');
    }
  };

  const handleToggleFeatured = async (item: PortfolioItemRecord) => {
    const nextFeatured = !item.featured;
    setItems(items.map((i) => (i.id === item.id ? { ...i, featured: nextFeatured } : i)));

    const res = await updatePortfolioItemAction(item.id, { featured: nextFeatured });
    if (!res.success) {
      setItems(items.map((i) => (i.id === item.id ? { ...i, featured: item.featured } : i)));
      alert(res.error || 'Failed to update featured flag');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const res = await deletePortfolioItemAction(id);
    if (res.success) {
      setItems(items.filter((i) => i.id !== id));
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete portfolio item');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Portfolio Items CMS</h1>
          <p className="text-sm text-[#858585] mt-1">
            Manage showcase projects, client deliverables, technology tags, and case previews.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Portfolio Item</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Total Items
            </span>
            <Briefcase className="w-4 h-4 text-[#858585]" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{totalItems}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Published
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{publishedCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Drafts
            </span>
            <XCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{draftCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Featured on Home
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{featuredCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white p-4 rounded-xl border border-[#E5E5E2] shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, category, service, stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'published', 'draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#F0F0ED] text-[#666666] hover:bg-[#E5E5E2] hover:text-[#111111]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#E5E5E2]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1400FF] text-white'
                : 'bg-[#F0F0ED] text-[#555555] hover:bg-[#E5E5E2]'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#1400FF] text-white'
                  : 'bg-[#F0F0ED] text-[#555555] hover:bg-[#E5E5E2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F7F5] border-b border-[#E5E5E2] text-[11px] font-mono uppercase text-[#858585] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Item & Slug</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Tags (Tech & Services)</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-center">Featured</th>
                <th className="px-6 py-3.5 text-center">Order</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#858585]">
                    No portfolio items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs text-[#858585] font-mono mt-0.5">
                          /{item.slug}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F0ED] text-[#333333]">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {item.technologies?.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {t}
                          </span>
                        ))}
                        {(item.technologies?.length || 0) > 3 && (
                          <span className="text-[10px] text-[#858585]">
                            +{(item.technologies?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublished(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                          item.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}
                        title="Click to toggle published"
                      >
                        {item.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1 rounded transition-colors ${
                          item.featured
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star
                          className={`w-4 h-4 ${item.featured ? 'fill-amber-500' : ''}`}
                        />
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center font-mono text-xs text-[#858585]">
                      {item.sort_order}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="p-1.5 text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                          title="Edit Portfolio Item"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        {item.project_url && (
                          <a
                            href={item.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                            title="Visit Live URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-[#858585] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Create Portfolio Item</h3>
                <p className="text-xs text-[#858585]">
                  Add a new client project to your portfolio showcase.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanzie Fashion Storefront & ERP"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. kanzie-ecommerce"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Category *
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Associated Client (Optional)
                  </label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    <option value="">None / Custom Client</option>
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
                    placeholder="https://kanzie.shop"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or /projects/image.png"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Services (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Web Development, E-Commerce, UI/UX"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Technologies (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, PostgreSQL, Tailwind"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Executive overview of the project and value delivered..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111]">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1400FF] focus:ring-[#1400FF]"
                  />
                  <span>Publish Immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111]">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1400FF] focus:ring-[#1400FF]"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#555555] hover:text-[#111111] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
