'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { Combo } from '../../_types';
import { Layers, Plus, Trash2, Edit2, X, Check, Tag } from 'lucide-react';

export default function AdminCombosPage() {
  const { combos, products, addCombo, updateCombo, deleteCombo } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [discount, setDiscount] = useState(400);

  const calculatedOriginalPrice = selectedProductIds.reduce((sum, pId) => {
    const prod = products.find((p) => p.id === pId);
    return sum + (prod ? prod.price : 0);
  }, 0);

  const finalComboPrice = Math.max(0, calculatedOriginalPrice - discount);

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreateCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedProductIds.length < 2) return;

    const firstProduct = products.find((p) => p.id === selectedProductIds[0]);

    addCombo({
      name: name.trim(),
      description: description.trim(),
      productIds: selectedProductIds,
      originalPrice: calculatedOriginalPrice,
      discount,
      finalPrice: finalComboPrice,
      isActive: true,
      image: firstProduct?.images[0] || '/demo-assets/ecommerce/demo-02/hero-banner.jpg',
    });

    setName('');
    setDescription('');
    setSelectedProductIds([]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Promotional Merchandising
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Combos & Wall Art Sets
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Bundle multiple glass posters with paired discounts for living rooms, gaming setups, and multi-wall gallery installations.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Poster Bundle</span>
        </button>
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                    <Tag className="w-3 h-3" />
                    Save ৳{combo.discount.toLocaleString()}
                  </span>
                  <h3 className="text-base font-extrabold text-zinc-900 mt-1.5">{combo.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{combo.description}</p>
                </div>

                <button
                  onClick={() => updateCombo(combo.id, { isActive: !combo.isActive })}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                    combo.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                  }`}
                >
                  {combo.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Included Posters */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">
                  Included Glass Posters ({combo.productIds.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {combo.productIds.map((pId) => {
                    const prod = products.find((p) => p.id === pId);
                    if (!prod) return null;
                    return (
                      <div
                        key={pId}
                        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-zinc-800 line-clamp-1 max-w-[140px] text-[11px]">
                          {prod.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pricing & Footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs">
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-base text-zinc-900">
                  ৳{combo.finalPrice.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-400 line-through">
                  ৳{combo.originalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => deleteCombo(combo.id)}
                className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Delete Combo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Combo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-extrabold text-base text-zinc-900">Create Poster Bundle Set</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCombo} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Bundle Set Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. F1 Championship Champions Duo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Red Bull Racing + Ferrari F1 matching pair"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1.5">
                  Select Included Glass Posters (Select at least 2)
                </label>
                <div className="max-h-48 overflow-y-auto border border-zinc-200 rounded-xl p-2 space-y-1.5 bg-zinc-50">
                  {products.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleProduct(p.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-black text-white' : 'bg-white text-zinc-800 hover:bg-zinc-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected ? 'border-white bg-white text-black' : 'border-zinc-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold truncate max-w-[240px]">{p.name}</span>
                        </div>
                        <span className={isSelected ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                          ৳{p.price.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Combined Value</label>
                  <div className="p-2.5 bg-zinc-100 rounded-xl font-bold text-sm text-zinc-900">
                    ৳{calculatedOriginalPrice.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Combo Discount (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-sm text-zinc-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-100 rounded-xl flex items-center justify-between">
                <span className="font-bold text-zinc-700">Final Combo Price:</span>
                <span className="font-black text-base text-zinc-900">৳{finalComboPrice.toLocaleString()}</span>
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
                  disabled={selectedProductIds.length < 2}
                  className="px-5 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 cursor-pointer shadow-xs disabled:opacity-50"
                >
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
