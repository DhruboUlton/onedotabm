'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Review } from '../../_types';

const baseHref = '/webapp-demo/ecommerce/demo-01';

export default function AdminReviewsPage() {
  const { reviews, toggleReviewVisibility, deleteReview, addReview, products } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'p1');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Metrics
  const totalReviews = reviews.length;
  const visibleReviews = reviews.filter((r) => r.isVisible).length;
  const hiddenReviews = reviews.filter((r) => !r.isVisible).length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    const matchedProduct = products.find((p) => p.id === selectedProductId);

    addReview({
      productId: selectedProductId,
      productName: matchedProduct?.name || 'Organic Product',
      customerName,
      rating,
      comment,
      isVerified: true,
      isVisible: true,
    });

    setCustomerName('');
    setComment('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Customer Reviews & Social Proof
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Moderate verified customer testimonials, star ratings, and storefront visibility
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={baseHref}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#072D24] px-3.5 py-2 text-xs font-bold text-[#072D24] hover:bg-[#072D24] hover:text-white transition-all"
          >
            <span>Check Storefront</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#072D24] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0c4437]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Total Reviews</span>
          <p className="mt-2 text-2xl font-black text-[#1F2923]">{totalReviews}</p>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Visible on Storefront</span>
          <p className="mt-2 text-2xl font-black text-emerald-700">{visibleReviews}</p>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Hidden / Moderated</span>
          <p className="mt-2 text-2xl font-black text-zinc-400">{hiddenReviews}</p>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Average Rating</span>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-2xl font-black text-amber-500">{avgRating}</span>
            <Star className="h-5 w-5 fill-current text-amber-500" />
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-2xl border border-[#ECE6DC] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE6DC] text-zinc-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Review Text</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Storefront Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{rev.customerName}</span>
                      {rev.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-zinc-700">
                    {rev.productName}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-200'}`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="line-clamp-2 text-zinc-600 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </td>

                  <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">{rev.date}</td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleReviewVisibility(rev.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                        rev.isVisible
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                      }`}
                      title="Click to toggle visibility on homepage"
                    >
                      {rev.isVisible ? (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm('Delete this review?')) {
                          deleteReview(rev.id);
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#ECE6DC] space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#1F2923]">Add Customer Review</h3>

            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asaduzzaman Nur"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5 font-bold text-amber-600"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★</option>
                  <option value={3}>3 Stars ★★★</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Testimonial Comment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Customer feedback on organic aroma, taste and delivery..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0ECE4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#072D24] px-5 py-2 font-bold text-white hover:bg-[#0c4437]"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
