'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PenTool,
  Plus,
  Search,
  Calendar,
  Tag,
  Clock,
  CheckCircle2,
  FileText,
  Trash2,
  Edit3,
  X,
  AlertCircle,
  User,
} from 'lucide-react';
import { BlogPostRecord, ContentStatus } from '@/types/database';
import { ProfileOption } from '@/lib/services/operationsService';
import { createBlogPostAction, deleteBlogPostAction } from './actions';

interface BlogClientViewProps {
  initialPosts: (BlogPostRecord & { author_name?: string })[];
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

export function BlogClientView({ initialPosts, authors }: BlogClientViewProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<(BlogPostRecord & { author_name?: string })[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Marketing',
    author_id: authors[0]?.id || '',
    excerpt: '',
    content: 'Write your article here in Markdown format...',
    tags: 'ABM, Growth, B2B Marketing',
    status: 'draft' as ContentStatus,
  });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      categoryFilter === 'all' || post.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Metrics
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMessage('Title and Content are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await createBlogPostAction({
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      category: formData.category,
      author_id: formData.author_id || null,
      excerpt: formData.excerpt || null,
      content: formData.content,
      tags: tagsArray,
      status: formData.status,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      const selectedAuthor = authors.find((a) => a.id === formData.author_id);
      const newPost = {
        ...res.data,
        author_name: selectedAuthor?.full_name || 'Admin',
      };
      setPosts([newPost, ...posts]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        slug: '',
        category: 'Marketing',
        author_id: authors[0]?.id || '',
        excerpt: '',
        content: 'Write your article here in Markdown format...',
        tags: 'ABM, Growth, B2B Marketing',
        status: 'draft',
      });
      router.refresh();
    } else {
      setErrorMessage(res.error || 'Failed to create post');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const res = await deleteBlogPostAction(id);
    if (res.success) {
      setPosts(posts.filter((p) => p.id !== id));
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete post');
    }
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'archived':
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Blog & Insights CMS</h1>
          <p className="text-sm text-[#858585] mt-1">
            Publish thought leadership, ABM frameworks, tech playbooks, and strategic updates.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Post</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Total Posts
            </span>
            <FileText className="w-4 h-4 text-[#858585]" />
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
              Drafts
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{draftCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Scheduled
            </span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{scheduledCount}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 bg-white p-4 rounded-xl border border-[#E5E5E2] shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, excerpt, tag, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'published', 'draft', 'scheduled'] as const).map((st) => (
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
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-[#1400FF] text-white'
                : 'bg-[#F0F0ED] text-[#555555] hover:bg-[#E5E5E2]'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-colors ${
                categoryFilter.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#1400FF] text-white'
                  : 'bg-[#F0F0ED] text-[#555555] hover:bg-[#E5E5E2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F7F5] border-b border-[#E5E5E2] text-[11px] font-mono uppercase text-[#858585] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Post Title & Slug</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Tags</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Published Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#858585]">
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
                        >
                          {post.title}
                        </Link>
                        <span className="text-xs text-[#858585] font-mono mt-0.5">
                          /{post.slug}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F0ED] text-[#333333]">
                        {post.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                          post.status
                        )}`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-[#555555]">
                      {post.published_at ? post.published_at.split('T')[0] : 'Unpublished'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1.5 text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                          title="Edit Post"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 text-[#858585] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Post"
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
                <h3 className="text-lg font-bold text-[#111111]">Write New Article</h3>
                <p className="text-xs text-[#858585]">
                  Draft a strategic article or framework breakdown.
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
                  Post Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Account-Based Marketing vs Traditional Lead Generation in 2026"
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
                    placeholder="e.g. abm-vs-lead-generation"
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

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise summary of key insights..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as ContentStatus })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white capitalize"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published Immediately</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
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
                  {isSubmitting ? 'Creating...' : 'Create Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
