'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
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
  TrendingUp,
  Building2,
  Zap,
} from 'lucide-react';
import { CaseStudyRecord, ContentStatus } from '@/types/database';
import { ClientOption } from '@/lib/services/operationsService';
import {
  createCaseStudyAction,
  deleteCaseStudyAction,
  updateCaseStudyAction,
} from './actions';

interface CaseStudiesClientViewProps {
  initialStudies: CaseStudyRecord[];
  clients: ClientOption[];
}

export function CaseStudiesClientView({
  initialStudies,
  clients,
}: CaseStudiesClientViewProps) {
  const router = useRouter();
  const [studies, setStudies] = useState<CaseStudyRecord[]>(initialStudies);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client_id: '',
    client_name: '',
    industry: 'Retail & E-Commerce',
    hero_metric_value: '+380%',
    hero_metric_label: 'ROAS Performance',
    challenge: '',
    strategy: '',
    execution: '',
    result: '',
    status: 'published' as ContentStatus,
    featured: false,
  });

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      !searchQuery ||
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || study.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCount = studies.length;
  const publishedCount = studies.filter((s) => s.status === 'published').length;
  const featuredCount = studies.filter((s) => s.featured).length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.client_name.trim()) {
      setErrorMessage('Title and Client Name are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await createCaseStudyAction({
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      client_id: formData.client_id || null,
      client_name: formData.client_name.trim(),
      industry: formData.industry.trim(),
      hero_metric_value: formData.hero_metric_value.trim() || null,
      hero_metric_label: formData.hero_metric_label.trim() || null,
      challenge: formData.challenge || 'Challenge details pending.',
      strategy: formData.strategy || 'Strategy details pending.',
      execution: formData.execution || 'Execution details pending.',
      result: formData.result || 'Result details pending.',
      status: formData.status,
      featured: formData.featured,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setStudies([res.data, ...studies]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        slug: '',
        client_id: '',
        client_name: '',
        industry: 'Retail & E-Commerce',
        hero_metric_value: '+380%',
        hero_metric_label: 'ROAS Performance',
        challenge: '',
        strategy: '',
        execution: '',
        result: '',
        status: 'published',
        featured: false,
      });
      router.refresh();
    } else {
      setErrorMessage(res.error || 'Failed to create case study');
    }
  };

  const handleToggleFeatured = async (study: CaseStudyRecord) => {
    const nextFeatured = !study.featured;
    setStudies(
      studies.map((s) => (s.id === study.id ? { ...s, featured: nextFeatured } : s))
    );

    const res = await updateCaseStudyAction(study.id, { featured: nextFeatured });
    if (!res.success) {
      setStudies(
        studies.map((s) => (s.id === study.id ? { ...s, featured: study.featured } : s))
      );
      alert(res.error || 'Failed to update featured flag');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const res = await deleteCaseStudyAction(id);
    if (res.success) {
      setStudies(studies.filter((s) => s.id !== id));
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete case study');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Case Studies CMS</h1>
          <p className="text-sm text-[#858585] mt-1">
            Showcase measurable client ROI, strategy breakdowns, execution details, and verified metrics.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Case Study</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Total Studies
            </span>
            <BookOpen className="w-4 h-4 text-[#858585]" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{totalCount}</p>
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
              Featured Case Studies
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{featuredCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-xl border border-[#E5E5E2] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, client, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
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

      {/* Case Studies Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F7F5] border-b border-[#E5E5E2] text-[11px] font-mono uppercase text-[#858585] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Case Study & Slug</th>
                <th className="px-6 py-3.5">Client & Industry</th>
                <th className="px-6 py-3.5">Hero Metric</th>
                <th className="px-6 py-3.5">Verified Metrics</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-center">Featured</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {filteredStudies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#858585]">
                    No case studies found.
                  </td>
                </tr>
              ) : (
                filteredStudies.map((study) => (
                  <tr key={study.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/case-studies/${study.id}`}
                          className="font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
                        >
                          {study.title}
                        </Link>
                        <span className="text-xs text-[#858585] font-mono mt-0.5">
                          /{study.slug}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-[#111111]">{study.client_name}</span>
                        <span className="text-[#858585]">{study.industry}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {study.hero_metric_value ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-mono font-bold text-xs">
                            {study.hero_metric_value}
                          </span>
                          <span className="text-[10px] text-emerald-700">
                            {study.hero_metric_label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#858585] font-mono">No metric set</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-[#555555]">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{study.metrics?.length || 0} metrics verified</span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                          study.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}
                      >
                        {study.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(study)}
                        className={`p-1 rounded transition-colors ${
                          study.featured
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star
                          className={`w-4 h-4 ${study.featured ? 'fill-amber-500' : ''}`}
                        />
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/case-studies/${study.id}`}
                          className="p-1.5 text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                          title="Edit Case Study"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/case-studies/${study.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                          title="Preview Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(study.id, study.title)}
                          className="p-1.5 text-[#858585] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Case Study"
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
                <h3 className="text-lg font-bold text-[#111111]">Create Case Study</h3>
                <p className="text-xs text-[#858585]">
                  Initiate a client success case study with the 4-pillar methodology.
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
                  Case Study Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scaling Solution Point to 4.8x ROAS with Account-Based Acquisition"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solution Point"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Industry *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Professional Education / EdTech"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Hero Metric Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +380% or 4.8x"
                    value={formData.hero_metric_value}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_metric_value: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Hero Metric Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ROAS Growth"
                    value={formData.hero_metric_label}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_metric_label: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Challenge Snapshot
                </label>
                <textarea
                  rows={2}
                  placeholder="What was the client's primary obstacle or revenue bottleneck?"
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111]">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1400FF] focus:ring-[#1400FF]"
                  />
                  <span>Feature on Case Studies Showcase</span>
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
                  {isSubmitting ? 'Creating...' : 'Create Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
