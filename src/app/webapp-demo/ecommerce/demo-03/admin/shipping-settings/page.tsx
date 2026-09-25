'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Truck,
  Globe,
  DollarSign,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
} from 'lucide-react';

export default function ShippingSettingsPage() {
  const { settings, updateSettings, showToast } = useStore();

  const [freeThreshold, setFreeThreshold] = useState(settings.freeShippingThreshold || 50);
  const [standardFee, setStandardFee] = useState(settings.standardShippingFee || 4.99);
  const [expressFee, setExpressFee] = useState(14.99);
  const [intlFee, setIntlFee] = useState(29.99);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      freeShippingThreshold: Number(freeThreshold),
      standardShippingFee: Number(standardFee),
    });
    showToast('Shipping Settings Saved', 'Free shipping threshold and courier rates updated across checkout', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Shipping & Delivery Tiers
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Fulfillment Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure free shipping spend thresholds, zone rate tiers, and courier handling fees. Syncs live with cart drawer.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  Free Shipping Incentive
                </h3>
                <span className="text-xs text-slate-400">Cart value threshold for zero shipping charge</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Minimum Cart Total for Free Delivery ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="1"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Currently configured at ${freeThreshold}. The cart drawer shows a live countdown bar toward this goal.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  Standard Flat-Rate Courier
                </h3>
                <span className="text-xs text-slate-400">Default rate applied when below threshold</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Standard Shipping Charge ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={standardFee}
                  onChange={(e) => setStandardFee(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Applied to standard domestic 2-3 business day courier dispatches.
              </p>
            </div>
          </div>
        </div>

        {/* Zones Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Active Regional Zones & Expedited Services
            </h3>
            <span className="text-xs text-slate-400">Multi-vendor courier tiers configured per delivery geography</span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Zone Name</th>
                <th className="py-3 px-4">Coverage</th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4 text-right">Base Surcharge</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">Domestic Standard 48-States</td>
                <td className="py-3 px-4 text-slate-500">United States Continental</td>
                <td className="py-3 px-4">2-3 Business Days</td>
                <td className="py-3 px-4 text-right font-black">${standardFee.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-emerald-600 font-bold">Active</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">Overnight Express Air</td>
                <td className="py-3 px-4 text-slate-500">All Major US Metros</td>
                <td className="py-3 px-4">Next Business Day 10:30 AM</td>
                <td className="py-3 px-4 text-right font-black">$14.99</td>
                <td className="py-3 px-4 text-right text-emerald-600 font-bold">Active</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">Transatlantic Global Air</td>
                <td className="py-3 px-4 text-slate-500">EU, UK, Canada, Australia</td>
                <td className="py-3 px-4">4-6 Business Days</td>
                <td className="py-3 px-4 text-right font-black">$29.99</td>
                <td className="py-3 px-4 text-right text-emerald-600 font-bold">Active</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Shipping Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
