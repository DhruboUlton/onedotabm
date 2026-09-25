'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Review } from '../../_types';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const { reviews, products, updateReviewStatus, showToast } = useStore();
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'Hidden'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReviews = reviews.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      r.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getProduct = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const handleApprove = (id: string) => {
    updateReviewStatus(id, 'Approved');
    showToast('Review Approved', 'Customer review is now visible on PDP', 'success');
  };

  const handleHide = (id: string) => {
    updateReviewStatus(id, 'Hidden');
    showToast('Review Hidden', 'Customer review hidden from storefront', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Customer Reviews Moderation
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {reviews.length} Feedbacks
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Moderate community feedback, verify authentic buyer testimonials, and manage public ratings.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, rating comment, or keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {(['all', 'Pending', 'Approved', 'Hidden'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors capitalize ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'all' ? 'All Reviews' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Queue List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs font-medium">
            No customer reviews found matching your filter selection.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const product = getProduct(r.productId);

            return (
              <div
                key={r.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {r.author}
                    </span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">• {r.date}</span>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        r.status === 'Approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : r.status === 'Hidden'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  {/* Stars & Title */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {r.title}
                    </span>
                  </div>

                  {/* Body text */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {r.comment}
                  </p>

                  {/* Related Product */}
                  {product && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>Reviewed for:</span>
                      <Link
                        href={`/webapp-demo/ecommerce/demo-03/products/${product.slug}`}
                        target="_blank"
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{product.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Moderation Controls */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {r.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {r.status !== 'Hidden' && (
                    <button
                      onClick={() => handleHide(r.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Hide Review</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
