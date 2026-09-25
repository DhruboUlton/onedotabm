'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  BookOpen,
  Search,
  Plus,
  Calendar,
  User,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  FileText,
} from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  author: string;
  category: string;
  readTime: string;
  publishedDate: string;
  status: 'Published' | 'Draft' | 'Archived';
  views: number;
}

const initialArticles: ArticleItem[] = [
  {
    id: 'ART-01',
    title: 'The Liquid-Metal Revolution: How Vapor Chambers Tamed Next-Gen Laptops',
    author: 'Dr. Ethan Vance, Thermal Engineering',
    category: 'Hardware Deep-Dives',
    readTime: '6 min read',
    publishedDate: '2026-09-22',
    status: 'Published',
    views: 14200,
  },
  {
    id: 'ART-02',
    title: 'Electromagnetic vs Mechanical: Why Hall-Effect Sensors Ended Controller Stick Drift',
    author: 'Maya Lin, Esports Peripheral Lab',
    category: 'Gaming Hardware',
    readTime: '4 min read',
    publishedDate: '2026-09-18',
    status: 'Published',
    views: 9800,
  },
  {
    id: 'ART-03',
    title: 'Gallium Nitride 200W: The Death of Bulky Power Bricks',
    author: 'Kenji Sato, Power Architecture',
    category: 'Power & Charging',
    readTime: '5 min read',
    publishedDate: '2026-09-12',
    status: 'Published',
    views: 11500,
  },
  {
    id: 'ART-04',
    title: 'Inside Next-Gen Quantum Dot OLED: Sub-Millisecond Response Times Explored',
    author: 'Dr. Ethan Vance, Thermal Engineering',
    category: 'Displays',
    readTime: '7 min read',
    publishedDate: '2026-10-02',
    status: 'Draft',
    views: 0,
  },
];

export default function ArticlesBlogPage() {
  const { showToast } = useStore();
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Article Form
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('Hardware Deep-Dives');

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleToggleStatus = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const newStatus = a.status === 'Published' ? 'Draft' : 'Published';
        showToast('Article Status Updated', `"${a.title}" is now ${newStatus}`, 'info');
        return { ...a, status: newStatus };
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const newArt: ArticleItem = {
      id: `ART-${Math.floor(10 + Math.random() * 90)}`,
      title: formTitle,
      author: formAuthor || 'Kinetic Editorial Staff',
      category: formCategory,
      readTime: '5 min read',
      publishedDate: new Date().toISOString().split('T')[0],
      status: 'Published',
      views: 1,
    };

    setArticles((prev) => [newArt, ...prev]);
    showToast('Article Published', `Article "${formTitle}" posted to Tech Journal`, 'success');
    setIsModalOpen(false);
    setFormTitle('');
    setFormAuthor('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Tech Journal & Articles
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              CMS Articles
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Author engineering whitepapers, publish hardware tear-downs, and manage tech journal SEO copy.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title, author, or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Article Headline</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Department / Topic</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Lifetime Reads</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-[320px]">
                    <div className="line-clamp-1">{item.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.readTime}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {item.author}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-blue-600 dark:text-blue-400">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {item.publishedDate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                    {item.views.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        {item.status === 'Published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href="/webapp-demo/ecommerce/demo-03/blog"
                        target="_blank"
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Write Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Compose Tech Journal Article
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Wi-Fi 7 vs Ethernet in Esports Laptops"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Author Byline
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Dr. Alex Mercer"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Topic Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Hardware Deep-Dives">Hardware Deep-Dives</option>
                    <option value="Gaming Hardware">Gaming Hardware</option>
                    <option value="Power & Charging">Power & Charging</option>
                    <option value="Displays">Displays</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Article Excerpt / Body
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter markdown or summary intro text for customer technical review..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Publish to Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
