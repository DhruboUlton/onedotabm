'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Trash2,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  ImageIcon,
  Globe,
  Share2,
} from 'lucide-react';
import { BlogPostRecord, ContentStatus } from '@/types/database';
import { ProfileOption } from '@/lib/services/operationsService';
import { updateBlogPostAction, deleteBlogPostAction } from '../actions';

interface BlogEditorClientViewProps {
  post: BlogPostRecord & { author_name?: string };
  authors: ProfileOption[];
}

const CATEGORIES = [
  'Marketing',
  'Web Development',
  'ABM Strategy',
  'Engineering',
  'Analytics',
  'Case Insights',
];

export function BlogEditorClientView({
  post: initialPost,
  authors,
}: BlogEditorClientViewProps) {
  const router = useRouter();
  const [post, setPost] = useState(initialPost);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write');

  // Form State
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    category: post.category,
    author_id: post.author_id || '',
    excerpt: post.excerpt || '',
    content: post.content,
    featured_image: post.featured_image || '',
    tags: (post.tags || []).join(', '),
    seo_title: post.seo_title || '',
    seo_description: post.seo_description || '',
    canonical_url: post.canonical_url || '',
    status: post.status,
    published_at: post.published_at ? post.published_at.slice(0, 16) : '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMessage('Title and Content are required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await updateBlogPostAction(post.id, {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      category: formData.category,
      author_id: formData.author_id || null,
      excerpt: formData.excerpt || null,
      content: formData.content,
      featured_image: formData.featured_image || null,
      tags: tagsArray,
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
      canonical_url: formData.canonical_url || null,
      status: formData.status,
      published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null,
    });

    setIsSaving(false);

    if (res.success && res.data) {
      const selectedAuthor = authors.find((a) => a.id === formData.author_id);
      setPost({
        ...res.data,
        author_name: selectedAuthor?.full_name || post.author_name,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    } else {
      setErrorMessage(res.error || 'Failed to save changes');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    const res = await deleteBlogPostAction(post.id);
    if (res.success) {
      router.push('/admin/blog');
    } else {
      alert(res.error || 'Failed to delete post');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-lg bg-white border border-[#E5E5E2] text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] tracking-tight">{post.title}</h1>
            <p className="text-xs font-mono text-[#858585] mt-0.5">
              Article Editor • /{post.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Delete Post"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Article'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Post updated successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata inputs */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Post Title *
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

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Author</label>
                <select
                  value={formData.author_id}
                  onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                >
                  <option value="">OneDot Editorial</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.full_name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Excerpt / Summary
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
              />
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E2]">
              <h2 className="text-base font-bold text-[#111111]">Article Content (Markdown)</h2>
              <div className="flex items-center gap-1 bg-[#F7F7F5] p-1 rounded-lg border border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setPreviewTab('write')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewTab === 'write'
                      ? 'bg-white text-[#111111] shadow-xs'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewTab === 'preview'
                      ? 'bg-white text-[#111111] shadow-xs'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {previewTab === 'write' ? (
              <textarea
                rows={16}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-4 text-sm bg-[#F7F7F5] rounded-xl border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white font-mono leading-relaxed"
              />
            ) : (
              <div className="p-6 rounded-xl border border-[#E5E5E2] bg-white min-h-[350px] prose prose-zinc max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {formData.content}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Publishing & SEO */}
        <div className="space-y-6">
          {/* Status & Schedule */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111]">Publication Controls</h3>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Post Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ContentStatus })
                }
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] capitalize"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Publish / Schedule Date
              </label>
              <input
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
              <span className="text-[10px] text-[#858585] mt-1 block">
                Leave empty to auto-set upon publication.
              </span>
            </div>
          </div>

          {/* Cover Image & Tags */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#1400FF]" />
              <span>Media & Tags</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Featured Cover Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
              {formData.featured_image && (
                <div className="mt-2.5 relative h-36 w-full rounded-lg overflow-hidden border border-[#E5E5E2] bg-[#F7F7F5]">
                  <img
                    src={formData.featured_image}
                    alt="Cover preview"
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
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {t}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#1400FF]" />
              <span>Search Engine Optimization</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Custom SEO Title
              </label>
              <input
                type="text"
                placeholder={formData.title}
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                placeholder={formData.excerpt}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Canonical URL
              </label>
              <input
                type="url"
                placeholder="https://onedotabm.com/blog/..."
                value={formData.canonical_url}
                onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
