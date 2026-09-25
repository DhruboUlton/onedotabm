'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  HelpCircle,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  X,
  Layers,
} from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders & Shipping' | 'Hardware Warranty' | 'Multi-Vendor Payments' | 'Returns & RMA';
  active: boolean;
}

const initialFaqs: FaqItem[] = [
  {
    id: 'FAQ-01',
    question: 'How does multi-vendor shipping work when I order from multiple hardware labs?',
    answer: 'When you purchase items from distinct verified vendors in a single checkout, each lab dispatches directly from their respective ISO-certified fulfillment hub. You receive consolidated billing with individual courier tracking codes for each parcel.',
    category: 'Orders & Shipping',
    active: true,
  },
  {
    id: 'FAQ-02',
    question: 'What is the Kinetic Gear official 2-year hardware warranty standard?',
    answer: 'Every device sold on Kinetic Gear includes a comprehensive 24-month manufacturer and platform-backed warranty covering motherboard defects, thermal anomalies, display sub-pixels, and battery degradation below 80% capacity.',
    category: 'Hardware Warranty',
    active: true,
  },
  {
    id: 'FAQ-03',
    question: 'What is the return window for high-performance laptops and open-box gear?',
    answer: 'We provide a 30-day no-questions-asked RMA return window. Products must include original packaging and serialized accessories. Return shipping is prepaid for VIP Platinum accounts.',
    category: 'Returns & RMA',
    active: true,
  },
  {
    id: 'FAQ-04',
    question: 'Are escrow balances protected during international courier transit?',
    answer: 'Yes. Platform escrow holds buyer funds until the carrier reports verified physical delivery scan and a 72-hour customer inspection period elapses without dispute filing.',
    category: 'Multi-Vendor Payments',
    active: true,
  },
];

export default function FaqsAdminPage() {
  const { showToast } = useStore();
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New FAQ form
  const [formQ, setFormQ] = useState('');
  const [formA, setFormA] = useState('');
  const [formCat, setFormCat] = useState<FaqItem['category']>('Orders & Shipping');

  const filtered = faqs.filter((f) => {
    return (
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleToggle = (id: string) => {
    setFaqs((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const nextActive = !f.active;
        showToast('FAQ Status Updated', `FAQ item is now ${nextActive ? 'Active' : 'Inactive'}`, 'info');
        return { ...f, active: nextActive };
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQ || !formA) return;

    const newFaq: FaqItem = {
      id: `FAQ-${Math.floor(10 + Math.random() * 90)}`,
      question: formQ,
      answer: formA,
      category: formCat,
      active: true,
    };

    setFaqs((prev) => [...prev, newFaq]);
    showToast('FAQ Added', 'New knowledgebase question added successfully', 'success');
    setIsModalOpen(false);
    setFormQ('');
    setFormA('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Customer Knowledgebase & FAQs
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {faqs.filter((f) => f.active).length} Active FAQs
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage buyer self-service questions, warranty disclosures, and multi-vendor checkout clarifications.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ Entry</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs by question keywords or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filtered.map((faq) => (
          <div
            key={faq.id}
            className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-sm ${
              faq.active ? 'border-slate-200/80 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  {faq.category}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{faq.id}</span>
              </div>

              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                {faq.question}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className={`text-[11px] font-semibold ${faq.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                {faq.active ? 'Visible' : 'Hidden'}
              </span>

              <button
                onClick={() => handleToggle(faq.id)}
                className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {faq.active ? (
                  <ToggleRight className="w-7 h-7 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Add Knowledgebase FAQ
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={formCat}
                  onChange={(e) => setFormCat(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Orders & Shipping">Orders & Shipping</option>
                  <option value="Hardware Warranty">Hardware Warranty</option>
                  <option value="Multi-Vendor Payments">Multi-Vendor Payments</option>
                  <option value="Returns & RMA">Returns & RMA</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Customer Question
                </label>
                <input
                  type="text"
                  required
                  value={formQ}
                  onChange={(e) => setFormQ(e.target.value)}
                  placeholder="e.g. Can I upgrade laptop RAM without voiding warranty?"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Detailed Answer
                </label>
                <textarea
                  rows={4}
                  required
                  value={formA}
                  onChange={(e) => setFormA(e.target.value)}
                  placeholder="Enter clear official policy response..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Publish FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
