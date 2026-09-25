'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Bell,
  Phone,
  Shield,
  Truck,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';

const baseHref = '/webapp-demo/ecommerce/demo-01';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetToDefaults } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeTagline, setStoreTagline] = useState(settings.storeTagline);
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcementEnabled);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [insideDhakaShippingFee, setInsideDhakaShippingFee] = useState(settings.insideDhakaShippingFee);
  const [outsideDhakaShippingFee, setOutsideDhakaShippingFee] = useState(settings.outsideDhakaShippingFee);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      storeTagline,
      announcementEnabled,
      announcementText,
      phone,
      email,
      address,
      freeShippingThreshold: Number(freeShippingThreshold),
      insideDhakaShippingFee: Number(insideDhakaShippingFee),
      outsideDhakaShippingFee: Number(outsideDhakaShippingFee),
    });
  };

  const handleExecuteReset = () => {
    resetToDefaults();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Store Settings & Operations
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure global business identity, announcements, delivery fees, and demo management
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all shadow-xs"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Brand Identity */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0ECE4] pb-3">
            <Globe className="h-4 w-4 text-[#072D24]" />
            <h2 className="text-sm font-bold text-[#1F2923]">Storefront Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Business Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-zinc-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Store Slogan / Tagline</label>
              <input
                type="text"
                value={storeTagline}
                onChange={(e) => setStoreTagline(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* 2. Top Announcement Bar */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#E87121]" />
              <h2 className="text-sm font-bold text-[#1F2923]">Top Notification / Announcement Bar</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#072D24]">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-[#072D24]"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">Announcement Copy</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-zinc-900"
            />
          </div>
        </div>

        {/* 3. Delivery Fees & Free Shipping */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0ECE4] pb-3">
            <Truck className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-[#1F2923]">Delivery Rates & Free Shipping Meter</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Free Delivery Min. Order (৳)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Inside Dhaka Fee (৳)</label>
              <input
                type="number"
                value={insideDhakaShippingFee}
                onChange={(e) => setInsideDhakaShippingFee(Number(e.target.value))}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 font-bold text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Outside Dhaka Fee (৳)</label>
              <input
                type="number"
                value={outsideDhakaShippingFee}
                onChange={(e) => setOutsideDhakaShippingFee(Number(e.target.value))}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 font-bold text-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* 4. Support Contacts */}
        <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0ECE4] pb-3">
            <Phone className="h-4 w-4 text-[#072D24]" />
            <h2 className="text-sm font-bold text-[#1F2923]">Customer Support & Contact Info</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Customer Helpline / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Official Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-zinc-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-zinc-700 mb-1">Physical Office Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-zinc-900"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#072D24] px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c4437] transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsResetConfirmOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-rose-200 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold text-[#1F2923]">Reset Demo Data?</h3>
            </div>
            <p className="text-zinc-600 leading-relaxed">
              This will purge any added orders, modified product prices, and custom coupons, restoring the initial high-fidelity seed dataset.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#F0ECE4]">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="rounded-xl px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="rounded-xl bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
