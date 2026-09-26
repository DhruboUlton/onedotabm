'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { Review } from '../../_types';

export default function AdminReviewsPage() {
  const { reviews, addReview, updateReview, deleteReview, toggleReviewVisibility, products, addToast } = useStore();

  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [productFilter, setProductFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    productId: products[0]?.id || '',
    productTitle: products[0]?.title || '',
    author: '',
    rating: 5,
    title: '',
    content: '',
    city: 'San Francisco, CA',
    isVerified: true,
    isVisible: true,
  });

  // Calculate Metrics
  const totalReviews = reviews.length;
  const visibleReviews = reviews.filter((r) => r.isVisible).length;
  const hiddenReviews = reviews.filter((r) => !r.isVisible).length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const fiveStarsCount = reviews.filter((r) => r.rating === 5).length;

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter !== 'all' && r.rating !== parseInt(ratingFilter, 10)) return false;
    if (visibilityFilter === 'visible' && !r.isVisible) return false;
    if (visibilityFilter === 'hidden' && r.isVisible) return false;
    if (productFilter !== 'all' && r.productId !== productFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchAuthor = r.author.toLowerCase().includes(q);
      const matchContent = r.content.toLowerCase().includes(q);
      const matchProduct = r.productTitle.toLowerCase().includes(q);
      if (!matchAuthor && !matchContent && !matchProduct) return false;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingReview(null);
    setForm({
      productId: products[0]?.id || '',
      productTitle: products[0]?.title || '',
      author: '',
      rating: 5,
      title: '',
      content: '',
      city: 'Portland, OR',
      isVerified: true,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: Review) => {
    setEditingReview(review);
    setForm({
      productId: review.productId,
      productTitle: review.productTitle,
      author: review.author,
      rating: review.rating,
      title: review.title,
      content: review.content,
      city: review.city || '',
      isVerified: review.isVerified,
      isVisible: review.isVisible,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.content.trim()) {
      addToast('error', 'Please fill in author and review content');
      return;
    }

    const selectedProd = products.find((p) => p.id === form.productId);
    const prodTitle = selectedProd ? selectedProd.title : form.productTitle;

    if (editingReview) {
      updateReview(editingReview.id, {
        ...form,
        productTitle: prodTitle,
      });
      addToast('success', 'Review updated successfully');
    } else {
      addReview({
        ...form,
        productTitle: prodTitle,
      });
      addToast('success', 'New review published to store');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    setDeleteConfirmId(null);
    addToast('info', 'Review removed');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6375] uppercase tracking-wider mb-1">
            <Link href="/webapp-demo/ecommerce/demo-04/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <span>Customer Feedback</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-bubblegum">
            Product Reviews & Testimonials ⭐
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer star ratings, verify parents&apos; feedback, and curate which reviews display on the storefront.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#EB1551] hover:bg-[#d01044] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Custom Review</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Rating</span>
            <span className="text-lg">⭐</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{avgRating}</span>
            <span className="text-xs text-gray-500">/ 5.0 Stars</span>
          </div>
          <div className="mt-1 text-xs text-[#1CBBB4] font-medium">
            {fiveStarsCount} five-star parent reviews
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Reviews</span>
            <span className="text-lg">💬</span>
          </div>
          <div className="mt-2 text-3xl font-black text-gray-900">{totalReviews}</div>
          <div className="mt-1 text-xs text-gray-400">Across catalog items</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active / Visible</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600">{visibleReviews}</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">Live on storefront</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hidden / Moderated</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-amber-600">{hiddenReviews}</div>
          <div className="mt-1 text-xs text-amber-600 font-medium">Hidden from visitors</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <svg
              className="absolute left-3.5 top-3 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by parent, content, or toy title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#EB1551]"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value as 'all' | '5' | '4' | '3' | '2' | '1')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#EB1551]"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>
          </div>

          {/* Visibility Filter */}
          <div>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as 'all' | 'visible' | 'hidden')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#EB1551]"
            >
              <option value="all">All Visibilities</option>
              <option value="visible">Visible Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
          </div>
        </div>

        {/* Product Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-bold whitespace-nowrap">Toy Filter:</span>
          <button
            onClick={() => setProductFilter('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              productFilter === 'all'
                ? 'bg-[#0A6375] text-white font-bold'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Products ({reviews.length})
          </button>
          {products.slice(0, 6).map((p) => {
            const count = reviews.filter((r) => r.productId === p.id).length;
            if (count === 0) return null;
            return (
              <button
                key={p.id}
                onClick={() => setProductFilter(p.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  productFilter === p.id
                    ? 'bg-[#0A6375] text-white font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.title.split(' ').slice(0, 3).join(' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Toy Product</th>
                <th className="py-3.5 px-4">Review Content</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No reviews found matching the current search or filters.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Author */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FFEFE4] text-[#EB1551] font-black flex items-center justify-center text-xs">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{rev.author}</span>
                            {rev.isVerified && (
                              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded font-semibold" title="Verified Buyer">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          {rev.city && <span className="text-[10px] text-gray-400">{rev.city}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < rev.rating ? 'text-amber-400' : 'text-gray-200'}>
                            ★
                          </span>
                        ))}
                        <span className="ml-1 text-gray-600 font-bold text-[11px]">{rev.rating}.0</span>
                      </div>
                    </td>

                    {/* Toy Product */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/webapp-demo/ecommerce/demo-04/products/${products.find((p) => p.id === rev.productId)?.slug || ''}`}
                        target="_blank"
                        className="font-medium text-[#0A6375] hover:text-[#EB1551] transition-colors line-clamp-1 max-w-[180px]"
                      >
                        {rev.productTitle}
                      </Link>
                    </td>

                    {/* Content */}
                    <td className="py-3 px-4 max-w-xs">
                      {rev.title && <div className="font-bold text-gray-900 mb-0.5 line-clamp-1">{rev.title}</div>}
                      <p className="text-gray-500 line-clamp-2 leading-relaxed">{rev.content}</p>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-gray-400 text-[11px]">
                      {rev.date}
                    </td>

                    {/* Visibility status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          toggleReviewVisibility(rev.id);
                          addToast('info', `Review is now ${!rev.isVisible ? 'visible' : 'hidden'}`);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          rev.isVisible
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${rev.isVisible ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <span>{rev.isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(rev)}
                        className="text-gray-400 hover:text-gray-700 font-semibold p-1"
                        title="Edit Review"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(rev.id)}
                        className="text-red-400 hover:text-red-600 font-semibold p-1"
                        title="Delete Review"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bubblegum text-xl font-bold text-gray-900">
                {editingReview ? 'Edit Customer Review' : 'Add New Customer Review'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Product
                </label>
                <select
                  value={form.productId}
                  onChange={(e) => {
                    const sel = products.find((p) => p.id === e.target.value);
                    setForm({
                      ...form,
                      productId: e.target.value,
                      productTitle: sel ? sel.title : '',
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (${p.basePrice.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Customer / Parent Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Seattle, WA"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Rating ({form.rating} Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className={`text-2xl transition-transform ${
                        star <= form.rating ? 'text-amber-400 scale-110' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Keeps my 3-year-old engaged for hours!"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Review Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write the parent's detailed feedback..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVerified}
                    onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
                    className="rounded text-[#0A6375] focus:ring-0"
                  />
                  <span>Verified Buyer Badge</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVisible}
                    onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                    className="rounded text-[#0A6375] focus:ring-0"
                  />
                  <span>Publish to Storefront</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#EB1551] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                >
                  {editingReview ? 'Save Changes' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 mx-auto flex items-center justify-center text-xl">
              🗑️
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Delete Review?</h4>
              <p className="text-xs text-gray-500 mt-1">
                This review will be permanently deleted and removed from the product page.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
