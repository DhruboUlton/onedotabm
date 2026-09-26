'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetDemoData, addToast } = useStore();

  const [formData, setFormData] = useState({
    brandName: settings.brandName,
    tagline: settings.tagline,
    supportPhone: settings.supportPhone,
    supportEmail: settings.supportEmail,
    address: settings.address,
    currency: settings.currency,
    currencySymbol: settings.currencySymbol,
    freeShippingThreshold: settings.freeShippingThreshold,
    announcementEnabled: settings.announcementEnabled,
    announcementText: settings.announcementText,
    browserTabTitle: settings.browserTabTitle,
    faviconText: settings.faviconText,
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    addToast('success', 'Store settings updated successfully');
  };

  const handleReset = () => {
    resetDemoData();
    setIsResetConfirmOpen(false);
    addToast('info', 'Demo state reset to initial factory seed');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6375] uppercase tracking-wider mb-1">
            <Link href="/webapp-demo/ecommerce/demo-04/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <span>Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-bubblegum">
            Store & Brand Settings ⚙️
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage global store metadata, top announcement bars, support telephone/email, and reset demo data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5"
        >
          <span>🔄</span>
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span>🏷️</span> Brand Identity & Browser Metadata
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Storefront Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Browser Tab Title Prefix
              </label>
              <input
                type="text"
                value={formData.browserTabTitle}
                onChange={(e) => setFormData({ ...formData, browserTabTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Favicon Emoji / Text Indicator
              </label>
              <input
                type="text"
                value={formData.faviconText}
                onChange={(e) => setFormData({ ...formData, faviconText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
              />
            </div>
          </div>
        </div>

        {/* Storefront Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>📢</span> Top Announcement Marquee
            </h2>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementEnabled}
                onChange={(e) => setFormData({ ...formData, announcementEnabled: e.target.checked })}
                className="rounded text-[#0A6375] focus:ring-0"
              />
              <span>Display on Storefront</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Marquee Banner Content
            </label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              placeholder="e.g. Free Worldwide Express Shipping on all Learning Boxes over $75! ✨ Use Code: FREESHIP"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              Displayed in the scrolling announcement bar above the top contact row.
            </span>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span>📞</span> Contact, Support & Shipping Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Support Phone Number
              </label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Physical Warehouse / School Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
            />
          </div>
        </div>

        {/* Currency & Localization */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span>💵</span> Currency & Pricing Display
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Primary Currency
              </label>
              <input
                type="text"
                disabled
                value={`${formData.currency} (United States Dollar)`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                disabled
                value={formData.currencySymbol}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Settings persist locally in your browser and automatically update headers & footers.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#EB1551] hover:bg-[#d01044] text-white font-bold rounded-xl shadow transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
          >
            <span>Save Settings</span>
            {isSaved && <span className="text-[10px] bg-white text-[#EB1551] px-1.5 py-0.5 rounded font-black">✓ Updated</span>}
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-500 mx-auto flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div>
              <h3 className="font-bubblegum text-xl font-bold text-gray-900">
                Reset All Demo Data?
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                This will restore the original 12 educational toys, default orders, categories, reviews, banners, and activity logs. Your custom changes will be cleared.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-3">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow uppercase tracking-wider"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
