'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Quote,
  Search,
  Plus,
  Star,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  User,
} from 'lucide-react';

interface TestimonialItem {
  id: string;
  customerName: string;
  role: string;
  rating: number;
  quote: string;
  hardwarePurchased: string;
  status: 'Approved' | 'Hidden';
  date: string;
}

const initialTestimonials: TestimonialItem[] = [
  {
    id: 'TST-01',
    customerName: 'Marcus Vance',
    role: 'Lead Systems Architect @ TechLabs',
    rating: 5,
    quote: 'The liquid-metal thermals on the AeroBlade 16 sustained 4.8GHz rendering across 12-hour simulation runs without any thermal throttling. Best marketplace for lab-grade hardware.',
    hardwarePurchased: 'AeroBlade 16 Titanium Pro',
    status: 'Approved',
    date: '2026-09-24',
  },
  {
    id: 'TST-02',
    customerName: 'Elena Rostova',
    role: 'Acoustic Sound Designer',
    rating: 5,
    quote: 'Direct purchase from AudioCraft Acoustics delivered precision beryllium drivers. The multi-vendor escrow guarantee gives our studio total confidence.',
    hardwarePurchased: 'Aura Studio Wireless ANC',
    status: 'Approved',
    date: '2026-09-23',
  },
  {
    id: 'TST-03',
    customerName: 'David Kim',
    role: 'Competitive Apex Predator & Streamer',
    rating: 5,
    quote: 'Zero stick drift after 800 hours of scrims. The Hall-effect sensors on the Valkyrie controller are leagues ahead of standard potentiometer analog sticks.',
    hardwarePurchased: 'Valkyrie Hall-Effect Controller',
    status: 'Approved',
    date: '2026-09-21',
  },
  {
    id: 'TST-04',
    customerName: 'Liam O’Connor',
    role: 'Drone Cinematographer',
    rating: 4,
    quote: 'Phenomenal 4K gimbal stabilization, though shipping took 4 days instead of 2. Customer support was proactive and reimbursed the express fee immediately.',
    hardwarePurchased: 'Vortex Falcon 4K Drone',
    status: 'Approved',
    date: '2026-09-17',
  },
];

export default function TestimonialsAdminPage() {
  const { showToast } = useStore();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New testimonial form
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formProduct, setFormProduct] = useState('');

  const filtered = testimonials.filter((t) => {
    return (
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.hardwarePurchased.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleToggle = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newStatus = t.status === 'Approved' ? 'Hidden' : 'Approved';
        showToast('Testimonial Updated', `Quote by ${t.customerName} marked as ${newStatus}`, 'info');
        return { ...t, status: newStatus };
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formQuote) return;

    const newT: TestimonialItem = {
      id: `TST-${Math.floor(10 + Math.random() * 90)}`,
      customerName: formName,
      role: formRole || 'Verified Hardware Enthusiast',
      rating: 5,
      quote: formQuote,
      hardwarePurchased: formProduct || 'Flagship Hardware',
      status: 'Approved',
      date: new Date().toISOString().split('T')[0],
    };

    setTestimonials((prev) => [newT, ...prev]);
    showToast('Testimonial Added', `Added testimonial from ${formName}`, 'success');
    setIsModalOpen(false);
    setFormName('');
    setFormRole('');
    setFormQuote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Verified Buyer Testimonials
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {testimonials.filter((t) => t.status === 'Approved').length} Live Quotes
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Curate social proof quotes, buyer accolades, and customer endorsements showcased on landing sections.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
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
            placeholder="Search testimonials by customer name, hardware item, or quote text..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between gap-4 shadow-sm ${
              item.status === 'Approved' ? 'border-slate-200/80 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {item.customerName}
                </div>
                <div className="text-[10px] text-slate-400">{item.role}</div>
                <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  Verified Purchase: {item.hardwarePurchased}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold ${item.status === 'Approved' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.status}
                </span>
                <button
                  onClick={() => handleToggle(item.id)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {item.status === 'Approved' ? (
                    <ToggleRight className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-400" />
                  )}
                </button>
              </div>
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
                Add Buyer Testimonial
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
                  Customer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Jordan Scott"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="e.g. Creative Technologist @ Studio7"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Hardware Purchased
                </label>
                <input
                  type="text"
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  placeholder="e.g. Zenith Titanium X1"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Quote Text
                </label>
                <textarea
                  rows={3}
                  required
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  placeholder="Customer praise, hardware impressions, or benchmark feedback..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
