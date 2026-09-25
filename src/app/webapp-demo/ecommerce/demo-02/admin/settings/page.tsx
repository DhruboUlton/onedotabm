'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import {
  Settings,
  Save,
  RotateCcw,
  Store,
  Megaphone,
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetDemoData, showToast } = useStore();

  const [form, setForm] = useState({
    storeName: settings.storeName,
    storeTagline: settings.storeTagline,
    currency: settings.currency || '৳',
    announcementEnabled: settings.announcementEnabled,
    announcementText: settings.announcementText,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    freeShippingThreshold: settings.freeShippingThreshold,
    insideDhakaShippingFee: settings.insideDhakaShippingFee,
    outsideDhakaShippingFee: settings.outsideDhakaShippingFee,
    sessionTimeoutMinutes: settings.sessionTimeoutMinutes || 60,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    showToast('Store settings saved and updated across storefront and checkout.', 'success');
  };

  const handleResetData = () => {
    if (
      confirm(
        'Are you sure you want to reset all demo data? This will restore the catalog, orders, inventory, and reviews to their original initial demo seeds.'
      )
    ) {
      resetDemoData();
      showToast('All demo data has been reset to default state.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            System Configuration
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Store & Commerce Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage storefront branding, customer support channels, shipping tier thresholds, and demo reset.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Brand & Identity */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Store className="w-4 h-4 text-black" />
            <h2 className="text-sm font-bold text-zinc-900">Brand & Store Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={form.storeTagline}
                onChange={(e) => setForm({ ...form, storeTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Storefront Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-zinc-900">Storefront Top Announcement Bar</h2>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.announcementEnabled}
                onChange={(e) => setForm({ ...form, announcementEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-black focus:ring-black"
              />
              <span>Enable Bar on Storefront</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Announcement Message
            </label>
            <input
              type="text"
              value={form.announcementText}
              onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              Changes propagate immediately to the high-contrast ticker at the top of the storefront.
            </p>
          </div>
        </div>

        {/* Section 3: Contact & Support */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Phone className="w-4 h-4 text-black" />
            <h2 className="text-sm font-bold text-zinc-900">Customer Support & Showroom Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Support Phone / WhatsApp
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Gallery Showroom / Workshop Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Section 4: Shipping & Delivery Rates */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Truck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-zinc-900">Delivery Rates & Free Shipping Meter</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Free Shipping Threshold (৳)
              </label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-mono font-bold focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Inside Dhaka Delivery (৳)
              </label>
              <input
                type="number"
                value={form.insideDhakaShippingFee}
                onChange={(e) => setForm({ ...form, insideDhakaShippingFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-mono font-bold focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Outside Dhaka Delivery (৳)
              </label>
              <input
                type="number"
                value={form.outsideDhakaShippingFee}
                onChange={(e) => setForm({ ...form, outsideDhakaShippingFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-mono font-bold focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Demo Reset Danger Zone */}
        <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-extrabold text-rose-950">Reset All Demo State</h3>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed max-w-xl">
              Restore initial seed state for all products, categories, orders, coupons, inventory, and reviews. Clears browser local storage cache.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </form>
    </div>
  );
}
