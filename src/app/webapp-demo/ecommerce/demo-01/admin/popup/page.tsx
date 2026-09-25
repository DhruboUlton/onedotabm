'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Save, Eye, Check, ExternalLink, X, Copy } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';

const baseHref = '/webapp-demo/ecommerce/demo-01';

export default function AdminPopupPage() {
  const { popup, updatePopup, mediaAssets } = useStore();

  const [isEnabled, setIsEnabled] = useState(popup.isEnabled);
  const [badge, setBadge] = useState(popup.badge);
  const [headline, setHeadline] = useState(popup.headline);
  const [description, setDescription] = useState(popup.description);
  const [couponCode, setCouponCode] = useState(popup.couponCode);
  const [ctaText, setCtaText] = useState(popup.ctaText);
  const [ctaUrl, setCtaUrl] = useState(popup.ctaUrl);
  const [dismissText, setDismissText] = useState(popup.dismissText);
  const [disclaimer, setDisclaimer] = useState(popup.disclaimer);
  const [image, setImage] = useState(popup.image);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePopup({
      isEnabled,
      badge,
      headline,
      description,
      couponCode,
      ctaText,
      ctaUrl,
      dismissText,
      disclaimer,
      image,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Storefront Promotional Pop-up
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure welcome discount modal with real-time interactive preview
          </p>
        </div>

        <Link
          href={baseHref}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#072D24] px-4 py-2 text-xs font-bold text-[#072D24] hover:bg-[#072D24] hover:text-white transition-all"
        >
          <span>Verify on Storefront</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSave} className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
              <h2 className="text-sm font-bold text-[#1F2923]">Pop-up Configuration</h2>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#072D24]">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#072D24]"
                />
                <span>Enable Modal on Storefront</span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Badge Text</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Headline</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs font-mono font-bold text-zinc-900 uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Dismiss Text</label>
              <input
                type="text"
                value={dismissText}
                onChange={(e) => setDismissText(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Disclaimer / Terms</label>
              <input
                type="text"
                value={disclaimer}
                onChange={(e) => setDisclaimer(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900"
              />
            </div>

            {/* Image selector */}
            <div>
              <label className="block font-semibold text-zinc-700 mb-2">Featured Image</label>
              <div className="grid grid-cols-3 gap-2">
                {mediaAssets.slice(0, 6).map((asset) => (
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

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#072D24] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c4437] transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save Pop-up Settings</span>
            </button>
          </form>
        </div>

        {/* Live Interactive Preview (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#E87121]">
                <Eye className="h-4 w-4" />
                <span>Live Interactive Storefront Preview</span>
              </span>
              <span className="text-[10px] text-zinc-400">Exact visitor presentation</span>
            </div>

            {/* The Modal Mockup */}
            <div className="relative mx-auto max-w-sm rounded-3xl bg-white shadow-xl border border-[#ECE6DC] overflow-hidden">
              <div className="relative h-36 w-full bg-[#072D24] overflow-hidden">
                <img
                  src={image || '/demo-assets/ecommerce/gawa-ghee.jpg'}
                  alt="Preview"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E87121] px-2 py-0.5 text-[9px] font-bold text-white">
                    <Sparkles className="h-3 w-3" />
                    <span>{badge || 'Promo'}</span>
                  </span>
                  <h4 className="mt-1 text-base font-bold text-white leading-tight">
                    {headline || 'Headline Here'}
                  </h4>
                </div>
              </div>

              <div className="p-4 text-center text-xs space-y-3">
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  {description || 'Description text appears here...'}
                </p>

                {couponCode && (
                  <div className="flex items-center justify-between rounded-xl border border-dashed border-[#E87121] bg-orange-50/60 p-2.5">
                    <div className="text-left">
                      <span className="block text-[9px] font-bold text-[#E87121] uppercase">Coupon Code</span>
                      <span className="block font-mono text-sm font-black text-[#072D24]">{couponCode}</span>
                    </div>
                    <span className="rounded-lg bg-[#E87121] px-2.5 py-1 text-[10px] font-bold text-white">
                      Copy
                    </span>
                  </div>
                )}

                <div className="rounded-xl bg-[#072D24] py-2.5 text-xs font-bold text-white text-center">
                  {ctaText || 'Claim Offer'}
                </div>

                <span className="block text-[11px] text-zinc-400 underline">
                  {dismissText || 'No thanks'}
                </span>

                {disclaimer && (
                  <p className="text-[9px] text-zinc-400 border-t border-[#F0ECE4] pt-2">
                    {disclaimer}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
