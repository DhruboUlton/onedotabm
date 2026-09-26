'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../_context/StoreContext';

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { products } = useStore();
  const [query, setQuery] = useState('');
  const base = '/webapp-demo/ecommerce/demo-04';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ageRange.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-[#FFEFE4]/40">
          <Search className="w-5 h-5 text-[#EB1551]" />
          <input
            type="text"
            autoFocus
            placeholder="Search Montessori abacus, busy boards, STEM robots..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base sm:text-lg font-nunito font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-[#EB1551] rounded-xl hover:bg-slate-100"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {query.trim() === '' ? (
            <div className="py-6 text-center space-y-3">
              <span className="text-xs font-bold text-[#F7941E] uppercase tracking-wider">
                Popular Searches:
              </span>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {['Abacus', 'Montessori', 'STEM Robot', 'Stacking Tower', 'Puzzles', 'Clay'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-full bg-[#FFEFE4] hover:bg-[#EB1551] hover:text-white text-xs font-bold text-[#0A6375] transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-[#6B6B84]">
              <p className="text-sm font-bold">No toys found matching &quot;{query}&quot;</p>
              <p className="text-xs mt-1">Try searching for &quot;wooden&quot;, &quot;puzzle&quot;, or &quot;robot&quot;</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#6B6B84] px-1">
                <span>Found {results.length} educational items</span>
                <Link
                  href={`${base}/collection?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-[#EB1551] hover:underline flex items-center gap-1"
                >
                  View full results <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`${base}/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 hover:border-[#1CBBB4] hover:bg-[#FFEFE4]/30 transition-all group"
                >
                  <div className="relative w-14 h-14 rounded-xl bg-[#FFEFE4] overflow-hidden shrink-0 border border-slate-100">
                    <Image
                      src={product.primaryImage}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#1CBBB4] uppercase">
                      {product.category} • {product.ageRange}
                    </span>
                    <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-[#EB1551] line-clamp-1 leading-snug">
                      {product.title}
                    </h4>
                    <span className="text-xs font-extrabold text-[#0F172A] mt-0.5 inline-block">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0A6375] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
