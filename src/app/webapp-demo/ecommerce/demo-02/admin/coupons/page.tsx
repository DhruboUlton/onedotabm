'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { Coupon } from '../../_types';
import { TicketPercent, Plus, Trash2, Tag, X, Check, Copy } from 'lucide-react';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, showToast } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrder, setMinOrder] = useState(1500);
  const [usageLimit, setUsageLimit] = useState(500);

  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      minOrder,
      usageLimit,
      isActive: true,
      expiresAt: '2026-12-31',
    });

    setCode('');
    setIsAddModalOpen(false);
  };

  const handleCopyCode = (c: string) => {
    navigator.clipboard.writeText(c);
    showToast(`Coupon "${c}" copied to clipboard.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Promotions & Discounts
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Coupons & Promo Vouchers
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Create percentage and flat taka discounts for checkout cart campaigns.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Coupons</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{coupons.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Campaigns</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeCoupons}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Redemptions</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{totalUses}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Conversion Rate</p>
          <p className="text-2xl font-black text-amber-500 mt-1">14.2%</p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Redeemed / Limit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                    <div className="flex items-center gap-2">
                      <span className="bg-zinc-100 px-2 py-1 rounded-md border border-zinc-200 text-black">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-zinc-400 hover:text-black p-1"
                        title="Copy Code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-zinc-900">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `৳${coupon.discountValue} OFF`}
                  </td>

                  <td className="py-3.5 px-4 text-zinc-600">
                    ৳{coupon.minOrder.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-zinc-600">
                    <span className="font-bold text-zinc-900">{coupon.usedCount}</span> / {coupon.usageLimit}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                        coupon.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-extrabold text-base text-zinc-900">Create New Coupon</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono uppercase font-bold text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Taka (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Min Order (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-xl font-bold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
