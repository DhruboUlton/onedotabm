'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';

export default function AdminPopupPage() {
  const { popup, updatePopup, coupons, addToast } = useStore();

  const [formData, setFormData] = useState({
    isEnabled: popup.isEnabled,
    badge: popup.badge,
    title: popup.title,
    description: popup.description,
    couponCode: popup.couponCode,
    buttonText: popup.buttonText,
    buttonLink: popup.buttonLink,
    image: popup.image,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePopup(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleToggle = (enabled: boolean) => {
    setFormData((prev) => ({ ...prev, isEnabled: enabled }));
    updatePopup({ isEnabled: enabled });
    addToast('info', `Popup ${enabled ? 'enabled' : 'disabled'} on storefront`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6375] uppercase tracking-wider mb-1">
            <Link href="/webapp-demo/ecommerce/demo-04/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <span>Marketing</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-bubblegum">
            Storefront Promo Pop-up 🎈
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure the modal window shown to visiting parents when they land on WonderSprout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/webapp-demo/ecommerce/demo-04"
            target="_blank"
            className="px-4 py-2 text-xs font-bold text-[#0A6375] bg-[#FFEFE4] hover:bg-teal-100 rounded-full transition-colors flex items-center gap-1.5"
          >
            <span>Preview Storefront</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Status Switch */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 block text-sm">Pop-up Visibility</span>
                <span className="text-xs text-gray-500">
                  {formData.isEnabled
                    ? 'Active: Modal will appear on the storefront homepage after initial page load.'
                    : 'Disabled: Modal will not interrupt visitors.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(!formData.isEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.isEnabled ? 'bg-[#1CBBB4]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Header Badge Text
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#EB1551]"
                placeholder="e.g. SPECIAL MONTESSORI WELCOME OFFER"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#EB1551]"
                placeholder="e.g. Grow Young Minds With 20% Off Your First Order!"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Promotional Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#EB1551]"
                placeholder="Engaging copy explaining the promo benefits..."
              />
            </div>

            {/* Coupon Code Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-sm uppercase focus:outline-none focus:border-[#EB1551]"
                    placeholder="WELCOME20"
                  />
                  <select
                    className="px-2 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50 text-gray-600"
                    onChange={(e) => {
                      if (e.target.value) setFormData({ ...formData, couponCode: e.target.value });
                    }}
                    value=""
                  >
                    <option value="">Pick Coupon</option>
                    {coupons.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} ({c.discountPercent}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#EB1551]"
                  placeholder="e.g. Copy Code & Explore Toys"
                />
              </div>
            </div>

            {/* Button Link */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                CTA Destination URL
              </label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#EB1551]"
                placeholder="/webapp-demo/ecommerce/demo-04/collection"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Visual Illustration / Product Image Path
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#EB1551]"
                placeholder="/demo-assets/ecommerce/demo-04/about-kids.jpg"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-3 flex items-center justify-between border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Changes take effect instantly across active storefront browsers.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#EB1551] hover:bg-[#d01044] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
              >
                <span>Save Pop-up Configuration</span>
                {isSaved && <span className="text-xs bg-white text-[#EB1551] px-2 py-0.5 rounded font-black">✓ Saved!</span>}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1CBBB4] animate-pulse" />
              Live Storefront Preview
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Desktop View</span>
          </div>

          <div className="bg-[#FFEFE4]/60 p-6 rounded-3xl border-2 border-dashed border-[#1CBBB4]/40 relative flex items-center justify-center min-h-[480px]">
            {/* Modal Card Mockup */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 w-full max-w-sm relative">
              {/* Fake close button */}
              <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-600 text-xs">
                ✕
              </div>

              {/* Image banner */}
              <div className="relative h-44 w-full bg-gray-100">
                <Image
                  src={formData.image || '/demo-assets/ecommerce/demo-04/about-kids.jpg'}
                  alt="Popup preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block bg-[#F7941E] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {formData.badge}
                  </span>
                </div>
              </div>

              {/* Content body */}
              <div className="p-5 text-center space-y-3">
                <h3 className="font-bubblegum text-xl font-bold text-gray-900 leading-tight">
                  {formData.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {formData.description}
                </p>

                {/* Coupon Code badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFEFE4] border-2 border-dashed border-[#EB1551] rounded-xl">
                  <span className="text-xs text-gray-500 font-medium">CODE:</span>
                  <span className="font-mono font-bold text-sm text-[#EB1551]">
                    {formData.couponCode}
                  </span>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 bg-[#EB1551] text-white text-xs font-extrabold uppercase rounded-full tracking-wider shadow-md"
                  >
                    {formData.buttonText}
                  </button>
                  <p className="text-[10px] text-gray-400 mt-2">
                    No minimum purchase required for first-time families.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
