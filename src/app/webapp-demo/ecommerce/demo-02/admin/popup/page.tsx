'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';
import {
  Sparkles,
  Save,
  Check,
  Eye,
  Copy,
  Tag,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function AdminPopupPage() {
  const { popup, updatePopup, showToast } = useStore();

  const [form, setForm] = useState({
    isEnabled: popup.isEnabled,
    badge: popup.badge,
    headline: popup.headline,
    description: popup.description,
    couponCode: popup.couponCode,
    ctaText: popup.ctaText,
    ctaUrl: popup.ctaUrl,
    dismissText: popup.dismissText,
    disclaimer: popup.disclaimer,
    image: popup.image,
  });

  const availableImages = [
    { label: 'Red Bull Racing F1 Glass Wall', url: '/demo-assets/ecommerce/demo-02/poster-f1-redbull.jpg' },
    { label: 'Porsche 911 GT3 RS Gloss Obsidian', url: '/demo-assets/ecommerce/demo-02/poster-porsche-gt3.jpg' },
    { label: 'Cyberpunk Neo Tokyo Neon Art', url: '/demo-assets/ecommerce/demo-02/poster-anime-cyberpunk.jpg' },
    { label: 'Ayatul Kursi Gold Islamic Art', url: '/demo-assets/ecommerce/demo-02/poster-islamic-calligraphy.jpg' },
    { label: 'Hero 4-Piece Living Room Showcase', url: '/demo-assets/ecommerce/demo-02/hero-banner.jpg' },
    { label: 'Glass Craftsmanship & Reflection Feature', url: '/demo-assets/ecommerce/demo-02/spec-glass-feature.jpg' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePopup(form);
    showToast('Promo popup settings saved and synchronized with storefront.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Conversion Rate Optimization
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Storefront Promo Pop-up Modal
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure the first-visitor voucher popup modal with live interactive preview.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-5">
          {/* Active status banner */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-zinc-50">
            <div>
              <p className="text-xs font-extrabold text-zinc-900">Pop-up Modal Status</p>
              <p className="text-[11px] text-zinc-500">
                {form.isEnabled
                  ? 'Active — will display to new visitors after 2.5 seconds on storefront'
                  : 'Disabled — popup is hidden from storefront'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, isEnabled: !form.isEnabled })}
              className={`p-1 rounded-full transition-colors cursor-pointer ${
                form.isEnabled ? 'text-black' : 'text-zinc-400'
              }`}
            >
              {form.isEnabled ? (
                <ToggleRight className="w-8 h-8 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Pill Badge Tag
                </label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g. NEW COLLECTOR SPECIAL"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Coupon Voucher Code
                </label>
                <input
                  type="text"
                  value={form.couponCode}
                  onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. GLASS300"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-bold text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Headline Offer
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Get ৳300 OFF Your First Glass Art Piece"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Description / Pitch
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Button CTA Text
                </label>
                <input
                  type="text"
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                  placeholder="e.g. Claim ৳300 Voucher"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Button CTA URL
                </label>
                <input
                  type="text"
                  value={form.ctaUrl}
                  onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Featured Artwork Image
              </label>
              <select
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 bg-white font-medium"
              >
                {availableImages.map((img) => (
                  <option key={img.url} value={img.url}>
                    {img.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Dismiss Button Copy
              </label>
              <input
                type="text"
                value={form.dismissText}
                onChange={(e) => setForm({ ...form, dismissText: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Fine Print Disclaimer
              </label>
              <input
                type="text"
                value={form.disclaimer}
                onChange={(e) => setForm({ ...form, disclaimer: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:border-black font-medium text-zinc-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save and Publish Modal</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Interactive Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-zinc-900">Live Customer Modal Preview</h3>
              </div>
              <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                1:1 Scale
              </span>
            </div>

            {/* Rendered Modal Container with backdrop */}
            <div className="bg-zinc-900/60 p-3 sm:p-4 rounded-2xl flex items-center justify-center border border-zinc-200">
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 w-full max-w-sm flex flex-col text-left">
                {/* Top / Left Graphic */}
                <div className="relative h-32 w-full bg-zinc-950 overflow-hidden">
                  <Image
                    src={form.image || '/demo-assets/ecommerce/demo-02/poster-f1-redbull.jpg'}
                    alt="Promo preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">
                      AuraGlass Limited Offer
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[9px] font-bold tracking-wide uppercase">
                    <Sparkles className="w-2.5 h-2.5 text-rose-500" />
                    {form.badge || 'PROMO'}
                  </div>

                  <h4 className="font-extrabold text-sm text-zinc-900 leading-snug">
                    {form.headline || 'Unlock Special Discount'}
                  </h4>

                  <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3">
                    {form.description}
                  </p>

                  {/* Coupon Box */}
                  <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-zinc-400 block uppercase font-mono">Use Promo Code</span>
                      <strong className="text-xs font-mono font-bold text-zinc-900 tracking-wider">
                        {form.couponCode || 'VOUCHER'}
                      </strong>
                    </div>
                    <span className="px-2.5 py-1 bg-black text-white rounded-lg text-[10px] font-semibold flex items-center gap-1">
                      <Copy className="w-3 h-3" />
                      Copy
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 bg-black text-white rounded-xl text-xs font-bold text-center block shadow-sm mt-2"
                  >
                    {form.ctaText || 'Claim Voucher'}
                  </button>

                  <p className="text-[10px] text-center text-zinc-400 hover:text-zinc-600 cursor-pointer pt-1">
                    {form.dismissText || 'No thanks'}
                  </p>

                  {form.disclaimer && (
                    <p className="text-[9px] text-zinc-400 text-center border-t border-zinc-100 pt-2">
                      {form.disclaimer}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 text-center mt-3">
              Editing any input above will immediately update this preview and the live storefront modal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
