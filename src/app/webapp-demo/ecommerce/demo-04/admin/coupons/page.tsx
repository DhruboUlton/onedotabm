'use client';

import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, Check, X, Percent, Sparkles } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Coupon } from '../../_types';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useStore();
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [minSpend, setMinSpend] = useState(40);
  const [maxUsage, setMaxUsage] = useState(500);
  const [description, setDescription] = useState('');

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + c.usageCount, 0);

  const openCreator = () => {
    setEditingCoupon(null);
    setIsCreating(true);
    setCode('');
    setDiscountPercent(15);
    setMinSpend(30);
    setMaxUsage(300);
    setDescription('Limited seasonal Montessori discount voucher.');
  };

  const openEditor = (c: Coupon) => {
    setEditingCoupon(c);
    setIsCreating(false);
    setCode(c.code);
    setDiscountPercent(c.discountPercent);
    setMinSpend(c.minSpend);
    setMaxUsage(c.maxUsage || 1000);
    setDescription(c.description);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    if (isCreating) {
      addCoupon({
        code,
        discountPercent,
        discountType: 'percentage',
        minSpend,
        maxUsage,
        isActive: true,
        description,
      });
    } else if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: code.toUpperCase().trim(),
        discountPercent,
        minSpend,
        maxUsage,
        description,
      });
    }

    setEditingCoupon(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">Coupon Management</h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            Create and track promotional discount vouchers for storefront checkout.
          </p>
        </div>

        <button
          onClick={openCreator}
          className="ws-btn-primary px-5 py-2.5 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Vouchers</span>
          <span className="text-3xl font-extrabold text-[#0A6375] block mt-1">{activeCount}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Redemptions</span>
          <span className="text-3xl font-extrabold text-[#1CBBB4] block mt-1">{totalUses}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Discount Rate</span>
          <span className="text-3xl font-extrabold text-[#EB1551] block mt-1">18.5%</span>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-nunito">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FFEFE4]/40 text-[#0A6375] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min Spend</th>
                <th className="py-3.5 px-4">Usage / Cap</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold font-mono text-sm text-[#0F172A] block">
                      {coupon.code}
                    </span>
                    <span className="text-[10px] text-slate-400">{coupon.description}</span>
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-sm text-[#EB1551]">
                    {coupon.discountPercent}% OFF
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    ${coupon.minSpend.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {coupon.usageCount} / {coupon.maxUsage || '∞'}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleCoupon(coupon.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                        coupon.isActive
                          ? 'bg-[#008000]/10 text-[#008000]'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditor(coupon)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#0A6375] hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete coupon "${coupon.code}"?`)) {
                            deleteCoupon(coupon.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#EB1551] hover:bg-slate-100"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {(editingCoupon || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setEditingCoupon(null);
              setIsCreating(false);
            }}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bubblegum text-2xl text-[#0A6375]">
                {isCreating ? 'Create Coupon' : `Edit: ${editingCoupon?.code}`}
              </h3>
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setIsCreating(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 font-nunito text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SPROUT25"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Discount (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Min Spend ($) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Max Redemptions Cap</label>
                <input
                  type="number"
                  value={maxUsage}
                  onChange={(e) => setMaxUsage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Description / Campaign</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCoupon(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="ws-btn-primary px-6 py-2 text-xs uppercase font-bold">
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
