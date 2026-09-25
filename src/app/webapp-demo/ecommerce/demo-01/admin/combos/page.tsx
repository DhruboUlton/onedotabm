'use client';

import React, { useState } from 'react';
import { Gift, Plus, Trash2, Edit, Check, X, ExternalLink } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Combo } from '../../_types';

export default function AdminCombosPage() {
  const { combos, products, addCombo, updateCombo, deleteCombo } = useStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [discount, setDiscount] = useState(300);

  const calculatedOriginalPrice = selectedProductIds.reduce((sum, id) => {
    const p = products.find((prod) => prod.id === id);
    return sum + (p ? p.price : 0);
  }, 0);

  const finalComboPrice = Math.max(0, calculatedOriginalPrice - discount);

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleCreateCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedProductIds.length === 0) return;

    addCombo({
      name,
      description,
      productIds: selectedProductIds,
      originalPrice: calculatedOriginalPrice,
      discount: Number(discount),
      finalPrice: finalComboPrice,
      isActive: true,
      image: '/demo-assets/ecommerce/mid-banner.jpg',
    });

    setName('');
    setDescription('');
    setSelectedProductIds([]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Combo & Bundle Management
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Create high-converting product bundles and multi-buy promotional sets
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#072D24] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c4437] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Combo</span>
        </button>
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((combo) => {
          const comboProducts = products.filter((p) => combo.productIds.includes(p.id));

          return (
            <div
              key={combo.id}
              className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      combo.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {combo.isActive ? 'Active Bundle' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => updateCombo(combo.id, { isActive: !combo.isActive })}
                    className="text-xs font-bold text-[#072D24] hover:underline"
                  >
                    {combo.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>

                <h3 className="text-base font-bold text-[#1F2923]">{combo.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{combo.description}</p>

                {/* Included Products List */}
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Included Products ({comboProducts.length})
                  </span>
                  <div className="divide-y divide-[#F0ECE4] rounded-xl border border-[#ECE6DC] overflow-hidden">
                    {comboProducts.map((p) => (
                      <div key={p.id} className="p-2.5 flex items-center justify-between text-xs bg-[#FAF8F5]">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-8 w-8 rounded-lg object-cover bg-white"
                          />
                          <span className="font-medium text-zinc-800">{p.name}</span>
                        </div>
                        <span className="font-semibold text-zinc-600">৳{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="border-t border-[#F0ECE4] pt-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Bundle Price:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#E87121]">
                      ৳{combo.finalPrice.toLocaleString()}
                    </span>
                    <span className="text-zinc-400 line-through text-xs">
                      ৳{combo.originalPrice.toLocaleString()}
                    </span>
                    <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Save ৳{combo.discount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete combo "${combo.name}"?`)) {
                      deleteCombo(combo.id);
                    }
                  }}
                  className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#ECE6DC] space-y-4">
            <h3 className="text-base font-bold text-[#1F2923]">Create Product Bundle</h3>

            <form onSubmit={handleCreateCombo} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Combo Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramadan Super Saver Trio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Promotional copy explaining why to buy this bundle..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Select Products to Include ({selectedProductIds.length} selected)
                </label>
                <div className="max-h-40 overflow-y-auto divide-y divide-[#F0ECE4] rounded-xl border border-[#ECE6DC] p-2">
                  {products.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center justify-between p-2 hover:bg-zinc-50 cursor-pointer rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(p.id)}
                          onChange={() => handleToggleProduct(p.id)}
                          className="h-3.5 w-3.5 accent-[#072D24]"
                        />
                        <span className="font-medium text-zinc-800">{p.name}</span>
                      </div>
                      <span className="font-bold text-zinc-500">৳{p.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Discount Amount (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                  />
                </div>
                <div>
                  <span className="block font-semibold text-zinc-700 mb-1">Final Bundle Price</span>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-base font-bold text-emerald-800">
                    ৳{finalComboPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0ECE4]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedProductIds.length === 0}
                  className="rounded-xl bg-[#072D24] px-5 py-2 font-bold text-white hover:bg-[#0c4437] disabled:opacity-50"
                >
                  Save Combo Bundle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
