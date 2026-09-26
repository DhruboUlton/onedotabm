'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Boxes, Plus, Edit2, Trash2, Check, X, Sparkles } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { ComboBundle } from '../../_types';

export default function AdminCombosPage() {
  const { combos, products, addCombo, updateCombo, deleteCombo, toggleCombo } = useStore();
  const [editingCombo, setEditingCombo] = useState<ComboBundle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bundlePrice, setBundlePrice] = useState(85.0);
  const [originalPrice, setOriginalPrice] = useState(110.0);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(['prod-01', 'prod-02']);
  const [badge, setBadge] = useState('Save 25%');

  const openCreator = () => {
    setEditingCombo(null);
    setIsCreating(true);
    setName('');
    setDescription('Curated Montessori learning bundle for early childhood development.');
    setBundlePrice(79.0);
    setOriginalPrice(105.0);
    setDiscountPercent(25);
    setSelectedProductIds(['prod-01', 'prod-02']);
    setBadge('Curated Pack');
  };

  const openEditor = (c: ComboBundle) => {
    setEditingCombo(c);
    setIsCreating(false);
    setName(c.name);
    setDescription(c.description);
    setBundlePrice(c.bundlePrice);
    setOriginalPrice(c.originalPrice);
    setDiscountPercent(c.discountPercent);
    setSelectedProductIds(c.includedProductIds);
    setBadge(c.badge || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (isCreating) {
      addCombo({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        includedProductIds: selectedProductIds,
        originalPrice,
        discountPercent,
        bundlePrice,
        image: '/demo-assets/ecommerce/demo-04/abacus-board.jpg',
        isActive: true,
        badge,
      });
    } else if (editingCombo) {
      updateCombo(editingCombo.id, {
        name,
        description,
        includedProductIds: selectedProductIds,
        originalPrice,
        discountPercent,
        bundlePrice,
        badge,
      });
    }

    setEditingCombo(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">
            Combo & Bundle Management
          </h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            Create packaged starter sets and multi-toy kits with bundle discount incentives.
          </p>
        </div>

        <button
          onClick={openCreator}
          className="ws-btn-primary px-5 py-2.5 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Combo Bundle</span>
        </button>
      </div>

      {/* Combos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFEFE4] text-xl flex items-center justify-center">
                    🎁
                  </div>
                  <div>
                    <h3 className="font-bubblegum text-2xl text-[#0F172A] leading-tight">
                      {combo.name}
                    </h3>
                    <span className="text-[11px] font-bold text-[#F7941E]">
                      {combo.includedProductIds.length} toys bundled
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleCombo(combo.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                      combo.isActive
                        ? 'bg-[#008000]/10 text-[#008000]'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {combo.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#6B6B84] font-nunito leading-relaxed">
                {combo.description}
              </p>

              {/* Pricing comparison */}
              <div className="p-3.5 rounded-2xl bg-[#FFEFE4]/60 border border-[#F7941E]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Combined Retail
                  </span>
                  <span className="line-through text-slate-400 font-bold text-xs">
                    ${combo.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-[#EB1551] uppercase font-black block">
                    Discount
                  </span>
                  <span className="font-extrabold text-xs text-[#EB1551]">
                    {combo.discountPercent}% OFF
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#0A6375] uppercase font-bold block">
                    Bundle Price
                  </span>
                  <span className="font-extrabold text-base text-[#0A6375]">
                    ${combo.bundlePrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Included products */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#0F172A] block">
                  Included Products:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {combo.includedProductIds.map((pid) => {
                    const p = products.find((prod) => prod.id === pid);
                    return (
                      <span
                        key={pid}
                        className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold text-[#0F172A]"
                      >
                        {p?.title || pid}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => openEditor(combo)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete combo "${combo.name}"?`)) {
                    deleteCombo(combo.id);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#EB1551] hover:bg-[#EB1551]/10 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {(editingCombo || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setEditingCombo(null);
              setIsCreating(false);
            }}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bubblegum text-2xl text-[#0A6375]">
                {isCreating ? 'Create Combo Bundle' : `Edit: ${editingCombo?.name}`}
              </h3>
              <button
                onClick={() => {
                  setEditingCombo(null);
                  setIsCreating(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-nunito text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Bundle Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. Save 25% or Best Value"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Original ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Final Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={bundlePrice}
                    onChange={(e) => setBundlePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCombo(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="ws-btn-primary px-6 py-2 text-xs uppercase font-bold">
                  Save Bundle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
