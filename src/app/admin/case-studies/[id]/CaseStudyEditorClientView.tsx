'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus,
  Code2,
  List,
  MessageSquareQuote,
  Layers,
  Zap,
} from 'lucide-react';
import { CaseStudyRecord, ContentStatus } from '@/types/database';
import { ClientOption } from '@/lib/services/operationsService';
import { updateCaseStudyAction, deleteCaseStudyAction } from '../actions';

interface CaseStudyEditorClientViewProps {
  study: CaseStudyRecord;
  clients: ClientOption[];
}

export function CaseStudyEditorClientView({
  study: initialStudy,
  clients,
}: CaseStudyEditorClientViewProps) {
  const router = useRouter();
  const [study, setStudy] = useState<CaseStudyRecord>(initialStudy);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // JSON Mode Toggle
  const [jsonMode, setJsonMode] = useState(false);
  const [rawJsonText, setRawJsonText] = useState(
    JSON.stringify(initialStudy.metrics || [], null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: study.title,
    slug: study.slug,
    client_id: study.client_id || '',
    client_name: study.client_name,
    industry: study.industry,
    challenge: study.challenge,
    strategy: study.strategy,
    execution: study.execution,
    result: study.result,
    hero_metric_value: study.hero_metric_value || '',
    hero_metric_label: study.hero_metric_label || '',
    metrics: study.metrics || [],
    services: (study.services || []).join(', '),
    images: (study.images || []).join('\n'),
    testimonial: study.testimonial || '',
    status: study.status,
    featured: study.featured,
  });

  // Interactive Metric Row Handlers
  const handleAddMetricRow = () => {
    const next = [...formData.metrics, { metric: '', label: '', detail: '' }];
    setFormData({ ...formData, metrics: next });
    setRawJsonText(JSON.stringify(next, null, 2));
  };

  const handleUpdateMetricRow = (
    index: number,
    field: 'metric' | 'label' | 'detail',
    value: string
  ) => {
    const next = [...formData.metrics];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, metrics: next });
    setRawJsonText(JSON.stringify(next, null, 2));
  };

  const handleRemoveMetricRow = (index: number) => {
    const next = formData.metrics.filter((_, i) => i !== index);
    setFormData({ ...formData, metrics: next });
    setRawJsonText(JSON.stringify(next, null, 2));
  };

  // Sync Raw JSON Text into structured metrics
  const handleJsonTextChange = (text: string) => {
    setRawJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setFormData((prev) => ({ ...prev, metrics: parsed }));
        setJsonError(null);
      } else {
        setJsonError('JSON must be an array of objects: [{ metric, label, detail }]');
      }
    } catch (e: any) {
      setJsonError('Invalid JSON syntax: ' + e.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.client_name.trim()) {
      setErrorMessage('Title and Client Name are required.');
      return;
    }

    if (jsonMode && jsonError) {
      setErrorMessage('Please fix JSON errors before saving.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    const servicesArray = formData.services
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const imagesArray = formData.images
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await updateCaseStudyAction(study.id, {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      client_id: formData.client_id || null,
      client_name: formData.client_name.trim(),
      industry: formData.industry.trim(),
      challenge: formData.challenge,
      strategy: formData.strategy,
      execution: formData.execution,
      result: formData.result,
      hero_metric_value: formData.hero_metric_value.trim() || null,
      hero_metric_label: formData.hero_metric_label.trim() || null,
      metrics: formData.metrics,
      services: servicesArray,
      images: imagesArray,
      testimonial: formData.testimonial || null,
      status: formData.status,
      featured: formData.featured,
    });

    setIsSaving(false);

    if (res.success && res.data) {
      setStudy(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    } else {
      setErrorMessage(res.error || 'Failed to save changes');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${study.title}"?`)) return;

    const res = await deleteCaseStudyAction(study.id);
    if (res.success) {
      router.push('/admin/case-studies');
    } else {
      alert(res.error || 'Failed to delete case study');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/case-studies"
            className="p-2 rounded-lg bg-white border border-[#E5E5E2] text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] tracking-tight">{study.title}</h1>
            <p className="text-xs font-mono text-[#858585] mt-0.5">
              Case Study Editor • {study.client_name} ({study.industry}) • /{study.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/case-studies/${study.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <span>Preview Public</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Delete Case Study"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Case Study'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Case study updated successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Left 2 Cols (4 Pillars & Metrics) + Right 1 Col (Meta & Testimonial) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Bar */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#111111]">Core Case Details</h2>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Case Study Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Industry Sector
                </label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>
            </div>

            {/* Hero Metric Banner */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1400FF]">
                <TrendingUp className="w-4 h-4" />
                <span>Hero Highlight Metric (Primary Impact Stat)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#555555] mb-1">
                    Value (e.g. +380% or 4.8x)
                  </label>
                  <input
                    type="text"
                    placeholder="+380%"
                    value={formData.hero_metric_value}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_metric_value: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#555555] mb-1">
                    Label (e.g. ROAS Growth)
                  </label>
                  <input
                    type="text"
                    placeholder="ROAS Growth"
                    value={formData.hero_metric_label}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_metric_label: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* THE FOUR PILLARS */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#111111]">
                The Four Pillars of Delivery
              </h2>
              <p className="text-xs text-[#858585] mt-0.5">
                Detailed breakdowns of Challenge, Strategy, Execution, and Result.
              </p>
            </div>

            {/* 1. Challenge */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-mono">
                  1
                </span>
                <span>The Challenge (Bottlenecks, Inefficiencies, Market Friction)</span>
              </div>
              <textarea
                rows={3}
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white leading-relaxed"
              />
            </div>

            {/* 2. Strategy */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-mono">
                  2
                </span>
                <span>The Strategy (ABM Positioning, Architectural Blueprint)</span>
              </div>
              <textarea
                rows={3}
                value={formData.strategy}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white leading-relaxed"
              />
            </div>

            {/* 3. Execution */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-mono">
                  3
                </span>
                <span>The Execution (Systems Built, Funnels Targeted, Code Deployed)</span>
              </div>
              <textarea
                rows={3}
                value={formData.execution}
                onChange={(e) => setFormData({ ...formData, execution: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white leading-relaxed"
              />
            </div>

            {/* 4. Result */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-mono">
                  4
                </span>
                <span>The Result (Quantifiable Outcomes, Revenue, Conversion)</span>
              </div>
              <textarea
                rows={3}
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* VERIFIED METRICS JSON / KEY-VALUE EDITOR */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Verified Metrics Editor</span>
                </h2>
                <p className="text-xs text-[#858585] mt-0.5">
                  Audit trail metrics displayed in data cards on the public study.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setJsonMode(!jsonMode)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E2] bg-[#F7F7F5] text-xs font-mono text-[#555555] hover:text-[#111111]"
              >
                {jsonMode ? <List className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                <span>{jsonMode ? 'Visual Builder' : 'Raw JSON Mode'}</span>
              </button>
            </div>

            {jsonMode ? (
              <div className="space-y-2">
                {jsonError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                    {jsonError}
                  </div>
                )}
                <textarea
                  rows={8}
                  value={rawJsonText}
                  onChange={(e) => handleJsonTextChange(e.target.value)}
                  className="w-full p-3 text-xs bg-[#1A1A1A] text-emerald-400 font-mono rounded-xl border border-zinc-800 focus:outline-none focus:border-[#1400FF]"
                />
                <span className="text-[11px] text-[#858585]">
                  Schema format: Array of objects with keys: `metric`, `label`, and optional `detail`.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.metrics.length === 0 ? (
                  <p className="text-xs text-[#858585] py-4 text-center border border-dashed border-[#E5E5E2] rounded-xl">
                    No verified metrics added yet. Click &ldquo;+ Add Metric&rdquo; below.
                  </p>
                ) : (
                  formData.metrics.map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                    >
                      <input
                        type="text"
                        placeholder="Metric e.g. 4.8x or ৳1.8M"
                        value={row.metric}
                        onChange={(e) => handleUpdateMetricRow(idx, 'metric', e.target.value)}
                        className="w-full sm:w-1/4 px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E5E5E2] font-mono font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Label e.g. ROAS Multiplier"
                        value={row.label}
                        onChange={(e) => handleUpdateMetricRow(idx, 'label', e.target.value)}
                        className="w-full sm:w-1/3 px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E5E5E2]"
                      />
                      <input
                        type="text"
                        placeholder="Detail e.g. Across 6 months of scaling"
                        value={row.detail || ''}
                        onChange={(e) => handleUpdateMetricRow(idx, 'detail', e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E5E5E2]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMetricRow(idx)}
                        className="p-1.5 text-[#858585] hover:text-rose-600 rounded-lg"
                        title="Remove Metric"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={handleAddMetricRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E5E5E2] bg-white text-[#1400FF] hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Verified Metric</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Publishing, Testimonial & Assets */}
        <div className="space-y-6">
          {/* Status & Featured */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111]">Publishing Controls</h3>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ContentStatus })
                }
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] capitalize"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E5E5E2] hover:bg-[#F9F9F8] cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5">
                <Star
                  className={`w-4 h-4 ${
                    formData.featured ? 'text-amber-500 fill-amber-500' : 'text-[#858585]'
                  }`}
                />
                <div>
                  <span className="text-xs font-semibold text-[#111111] block">
                    Featured Study
                  </span>
                  <span className="text-[11px] text-[#858585]">
                    Showcase on home and landing pages
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

          {/* Testimonial Quote */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-[#1400FF]" />
              <span>Client Testimonial Quote</span>
            </h3>
            <textarea
              rows={3}
              placeholder="&ldquo;Working with OneDot ABM transformed our acquisition engine...&rdquo;"
              value={formData.testimonial}
              onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white leading-relaxed italic"
            />
          </div>

          {/* Services & Images */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1400FF]" />
              <span>Services & Imagery</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Services (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.services}
                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Visual Artifacts / Screenshots (One URL per line)
              </label>
              <textarea
                rows={3}
                placeholder="https://...&#10;https://..."
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
