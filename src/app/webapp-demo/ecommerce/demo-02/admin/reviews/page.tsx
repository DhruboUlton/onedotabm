'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { Review } from '../../_types';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Star,
  CheckCircle2,
  Eye,
  EyeOff,
  Search,
  Filter,
  ShieldCheck,
  X,
  Check,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const { reviews, addReview, toggleReviewVisibility, deleteReview, products, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [productId, setProductId] = useState(products[0]?.id || 'ag-p1');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('Dhaka');
  const [isVerified, setIsVerified] = useState(true);

  // Metrics
  const totalReviews = reviews.length;
  const activeReviews = reviews.filter((r) => r.isVisible).length;
  const hiddenReviews = reviews.filter((r) => !r.isVisible).length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === 'all' || r.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    const prod = products.find((p) => p.id === productId);

    addReview({
      productId,
      productName: prod ? prod.name : 'AuraGlass Masterpiece',
      customerName: customerName.trim(),
      rating,
      comment: comment.trim(),
      isVerified,
      isVisible: true,
      location: location.trim(),
    });

    setCustomerName('');
    setComment('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Social Proof & Testimonials
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Customer Reviews & Ratings
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Moderate verified collector reviews, toggle storefront visibility, and audit satisfaction scores.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Manual Review</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Reviews</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{totalReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Storefront Visible</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Hidden / Draft</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{hiddenReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Average Rating</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl font-black text-zinc-900">{averageRating}</span>
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search collector or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-500 font-medium">Rating:</span>
          <select
            value={filterRating}
            onChange={(e) =>
              setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-1.5 text-xs rounded-xl border border-zinc-200 bg-white font-medium focus:outline-none"
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Collector & Location</th>
                <th className="py-3.5 px-4">Artwork Item</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Review Content</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Storefront</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 text-xs">
                    No reviews found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <strong className="font-bold text-zinc-900 block">{r.customerName}</strong>
                        {r.isVerified && (
                          <span title="Verified Buyer">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 block">{r.location || 'Bangladesh'}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-zinc-700 max-w-[180px] truncate">
                      {r.productName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-600 max-w-sm">
                      <p className="line-clamp-2 leading-relaxed text-[11px]">{r.comment}</p>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap text-[11px]">
                      {r.date}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleReviewVisibility(r.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          r.isVisible
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                        }`}
                      >
                        {r.isVisible ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-zinc-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete review from "${r.customerName}"?`)) {
                            deleteReview(r.id);
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <h2 className="text-lg font-extrabold text-zinc-900 mb-1">Add Manual Collector Review</h2>
            <p className="text-xs text-zinc-500 mb-4">
              Enter customer feedback to display on the storefront and product page.
            </p>

            <form onSubmit={handleCreateReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Shakib Al Hasan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Select Product *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white font-medium"
                  >
                    <option value="5">5 Stars (Masterpiece)</option>
                    <option value="4">4 Stars (Great)</option>
                    <option value="3">3 Stars (Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Gulshan, Dhaka"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Review Comment *
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="The glass reflection and clarity was beyond expectations..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verifiedCheck"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <label htmlFor="verifiedCheck" className="text-xs font-bold text-zinc-800 cursor-pointer">
                  Mark as Verified Collector Purchase
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
