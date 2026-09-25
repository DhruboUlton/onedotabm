'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Megaphone, Save, Eye, Sparkles, ExternalLink } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Banner } from '../../_types';

const baseHref = '/webapp-demo/ecommerce/demo-01';

export default function AdminBannerPage() {
  const { banners, updateBanner, mediaAssets } = useStore();

  const [selectedBannerId, setSelectedBannerId] = useState<string>(banners[0]?.id || 'b1');
  const activeBanner = banners.find((b) => b.id === selectedBannerId) || banners[0];

  const [title, setTitle] = useState(activeBanner?.title || '');
  const [bengaliTitle, setBengaliTitle] = useState(activeBanner?.bengaliTitle || '');
  const [description, setDescription] = useState(activeBanner?.description || '');
  const [ctaText, setCtaText] = useState(activeBanner?.ctaText || '');
  const [ctaUrl, setCtaUrl] = useState(activeBanner?.ctaUrl || '');
  const [image, setImage] = useState(activeBanner?.image || '');
  const [isActive, setIsActive] = useState(activeBanner?.isActive ?? true);

  // When banner selection changes
  const handleSelectBanner = (banner: Banner) => {
    setSelectedBannerId(banner.id);
    setTitle(banner.title);
    setBengaliTitle(banner.bengaliTitle || '');
    setDescription(banner.description);
    setCtaText(banner.ctaText);
    setCtaUrl(banner.ctaUrl);
    setImage(banner.image);
    setIsActive(banner.isActive);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBanner) return;

    updateBanner(activeBanner.id, {
      title,
      bengaliTitle,
      description,
      ctaText,
      ctaUrl,
      image,
      isActive,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Homepage Banner Merchandiser
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure promotional hero banners with live interactive storefront preview
          </p>
        </div>

        <Link
          href={baseHref}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#072D24] px-4 py-2 text-xs font-bold text-[#072D24] hover:bg-[#072D24] hover:text-white transition-all"
        >
          <span>View on Storefront</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Banner Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-3 text-xs">
        {banners.map((b, idx) => (
          <button
            key={b.id}
            onClick={() => handleSelectBanner(b)}
            className={`rounded-xl px-4 py-2 font-bold transition-all ${
              selectedBannerId === b.id
                ? 'bg-[#072D24] text-white shadow-xs'
                : 'bg-white border border-[#ECE6DC] text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            Banner #{idx + 1} ({b.type})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Editor Form (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSave} className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
              <h2 className="text-sm font-bold text-[#1F2923]">Banner Settings</h2>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#072D24]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#072D24]"
                />
                <span>Active on Storefront</span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">English Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Bengali Headline</label>
              <input
                type="text"
                value={bengaliTitle}
                onChange={(e) => setBengaliTitle(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Description / Subtitle</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">CTA Button Label</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">CTA Link URL</label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                />
              </div>
            </div>

            {/* Image selector */}
            <div>
              <label className="block font-semibold text-zinc-700 mb-2">Select Banner Image</label>
              <div className="grid grid-cols-3 gap-2">
                {mediaAssets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setImage(asset.url)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 p-0.5 transition-all ${
                      image === asset.url
                        ? 'border-[#E87121] ring-2 ring-orange-500/20'
                        : 'border-[#ECE6DC] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={asset.url} alt={asset.altText} className="h-full w-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#072D24] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c4437] transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save Banner to Storefront</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Interactive Storefront Preview (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#E87121]">
                <Eye className="h-4 w-4" />
                <span>Live Interactive Storefront Preview</span>
              </span>
              <span className="text-[10px] text-zinc-400">Updates as you edit</span>
            </div>

            {/* Preview Banner Container */}
            <div className="relative overflow-hidden rounded-2xl bg-[#072D24] text-white p-6 sm:p-8 min-h-[300px] flex items-end shadow-md">
              <img
                src={image || '/demo-assets/ecommerce/hero-banner.jpg'}
                alt="Banner preview"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="relative z-10 max-w-sm space-y-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E87121] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  <Sparkles className="h-3 w-3" />
                  <span>Preview</span>
                </span>

                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {bengaliTitle || title || 'Sample Headline'}
                </h3>

                <p className="text-xs text-zinc-200 line-clamp-2">
                  {description || 'Sample promotional description...'}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 rounded-xl bg-[#E87121] px-4 py-2 text-xs font-bold text-white shadow-sm">
                    {ctaText || 'Learn More'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
