'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit, Check, X, Sparkles, Percent } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Coupon } from '../../_types';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrder, setMinOrder] = useState(1500);
  const [usageLimit, setUsageLimit] = useState(500);

  // Metrics
  const totalUses = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const activeCoupons = coupons.filter((c) => c.isActive).length;

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrder: Number(minOrder),
      usageLimit: Number(usageLimit),
      isActive: true,
      expiresAt: '2026-12-31',
    });

    setCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage promotional campaigns and seasonal checkout promo codes
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#072D24] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c4437] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Total Coupons</span>
          <p className="mt-1 text-2xl font-black text-[#1F2923]">{coupons.length}</p>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Active Codes</span>
          <p className="mt-1 text-2xl font-black text-emerald-700">{activeCoupons}</p>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Total Redemptions</span>
          <p className="mt-1 text-2xl font-black text-[#E87121]">{totalUses}</p>
        </div>

        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">Primary Code</span>
          <p className="mt-1 text-lg font-mono font-black text-[#072D24]">SHUDDHA10</p>
        </div>
      </div>

      {/* Coupon Table */}
      <div className="rounded-2xl border border-[#ECE6DC] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE6DC] text-zinc-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min. Order</th>
                <th className="py-3.5 px-4">Usage / Limit</th>
                <th className="py-3.5 px-4">Expires</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-base text-[#072D24] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      {coupon.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#E87121]">
                    {coupon.discountValue}
                    {coupon.discountType === 'percentage' ? '% OFF' : '৳ OFF'}
                  </td>

                  <td className="py-3.5 px-4 text-zinc-700 font-medium">
                    ৳{coupon.minOrder.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-zinc-600">
                    <span className="font-bold text-zinc-900">{coupon.usedCount}</span> /{' '}
                    <span>{coupon.usageLimit} uses</span>
                  </td>

                  <td className="py-3.5 px-4 text-zinc-500">{coupon.expiresAt}</td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                        coupon.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Delete coupon "${coupon.code}"?`)) {
                          deleteCoupon(coupon.id);
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

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#ECE6DC] space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#1F2923]">Create Promo Code</h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER15"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 font-mono font-bold text-zinc-900 uppercase focus:outline-none focus:border-[#E87121]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Taka (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Min. Order (৳)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5"
                  />
                </div>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
