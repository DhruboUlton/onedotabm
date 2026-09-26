'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sliders, Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, X, Check } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { BannerSlide } from '../../_types';

export default function AdminBannerPage() {
  const { banners, updateBanner, addBanner, deleteBanner, toggleBanner } = useStore();
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [ctaText, setCtaText] = useState('Explore Kits');
  const [ctaLink, setCtaLink] = useState('/webapp-demo/ecommerce/demo-04/collection');
  const [imageDesktop, setImageDesktop] = useState('/demo-assets/ecommerce/demo-04/hero-banner.jpg');
  const [accentBadge, setAccentBadge] = useState('Featured');

  const openCreator = () => {
    setEditingBanner(null);
    setIsCreating(true);
    setTitle('New Playful Season');
    setSubtitle('Handcrafted Wooden Montessori Materials');
    setTagline('Cultivating joy, focus, and early motor coordination.');
    setCtaText('Shop Collection');
    setCtaLink('/webapp-demo/ecommerce/demo-04/collection');
    setImageDesktop('/demo-assets/ecommerce/demo-04/hero-banner.jpg');
    setAccentBadge('Special Release');
  };

  const openEditor = (b: BannerSlide) => {
    setEditingBanner(b);
    setIsCreating(false);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setTagline(b.tagline);
    setCtaText(b.ctaText);
    setCtaLink(b.ctaLink);
    setImageDesktop(b.imageDesktop);
    setAccentBadge(b.accentBadge || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (isCreating) {
      addBanner({
        title,
        subtitle,
        tagline,
        ctaText,
        ctaLink,
        imageDesktop,
        imageMobile: imageDesktop,
        isActive: true,
        displayOrder: banners.length + 1,
        accentBadge,
      });
    } else if (editingBanner) {
      updateBanner(editingBanner.id, {
        title,
        subtitle,
        tagline,
        ctaText,
        ctaLink,
        imageDesktop,
        accentBadge,
      });
    }

    setEditingBanner(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">Hero Slideshow Manager</h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            Configure homepage hero carousel slides. Edits immediately reflect on the live storefront.
          </p>
        </div>

        <button
          onClick={openCreator}
          className="ws-btn-primary px-5 py-2.5 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Slide</span>
        </button>
      </div>

      {/* Banner Cards List */}
      <div className="space-y-4">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between group"
          >
            {/* Thumbnail Preview */}
            <div className="relative w-full md:w-56 aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              <Image src={b.imageDesktop} alt={b.title} fill className="object-cover" />
              {b.accentBadge && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#EB1551] text-white text-[9px] font-black uppercase">
                  {b.accentBadge}
                </span>
              )}
            </div>

            {/* Slide Information */}
            <div className="flex-1 min-w-0 space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-bold text-slate-400">Slide #{idx + 1}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    b.isActive ? 'bg-[#008000]/10 text-[#008000]' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {b.isActive ? 'Active on Storefront' : 'Hidden'}
                </span>
              </div>
              <h3 className="font-bubblegum text-2xl text-[#0F172A] leading-snug">{b.title}</h3>
              <p className="text-xs font-bold text-[#0A6375]">{b.subtitle}</p>
              <p className="text-xs text-slate-500 line-clamp-1 font-nunito">{b.tagline}</p>
              <div className="text-[11px] text-[#EB1551] font-bold pt-1">
                CTA: &quot;{b.ctaText}&quot; &rarr; {b.ctaLink}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleBanner(b.id)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                {b.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{b.isActive ? 'Hide' : 'Show'}</span>
              </button>
              <button
                onClick={() => openEditor(b)}
                className="px-3.5 py-2 rounded-xl bg-[#0A6375] hover:bg-[#1CBBB4] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              {banners.length > 1 && (
                <button
                  onClick={() => {
                    if (confirm(`Delete slide "${b.title}"?`)) {
                      deleteBanner(b.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-[#EB1551] rounded-xl hover:bg-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {(editingBanner || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setEditingBanner(null);
              setIsCreating(false);
            }}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bubblegum text-2xl text-[#0A6375]">
                {isCreating ? 'Create Hero Slide' : `Edit Slide: ${editingBanner?.title}`}
              </h3>
              <button
                onClick={() => {
                  setEditingBanner(null);
                  setIsCreating(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 font-nunito text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Main Heading *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Supporting Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Accent Badge</label>
                  <input
                    type="text"
                    value={accentBadge}
                    onChange={(e) => setAccentBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBanner(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="ws-btn-primary px-6 py-2 text-xs uppercase font-bold">
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
