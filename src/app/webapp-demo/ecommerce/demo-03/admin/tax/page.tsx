'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Scale,
  Percent,
  Save,
  CheckCircle2,
  Globe,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function TaxSettingsPage() {
  const { settings, updateSettings, showToast } = useStore();

  const [taxRate, setTaxRate] = useState(settings.taxRatePercent || 8.5);
  const [taxInclusive, setTaxInclusive] = useState(false);
  const [digitalGoodsTax, setDigitalGoodsTax] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      taxRatePercent: Number(taxRate),
    });
    showToast('Tax Settings Updated', `Standard rate adjusted to ${taxRate}% across checkout calculations`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Tax, VAT & Customs Rules
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Compliance Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure jurisdiction sales tax percentages, VAT-inclusive pricing display, and cross-border nexus rules.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tax Config Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  Default Platform Sales Tax Rate
                </h3>
                <span className="text-xs text-slate-400">Baseline percentage calculated at checkout</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tax Rate Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full pl-4 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Applied to taxable hardware items in the cart and checkout summary.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  Tax Presentation Mode
                </h3>
                <span className="text-xs text-slate-400">Tax-exclusive vs VAT-inclusive display</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Prices Entered With Tax (VAT-Inclusive)
                </span>
                <span className="text-[11px] text-slate-400">
                  Common for European and UK consumer hardware stores
                </span>
              </div>

              <button
                type="button"
                onClick={() => setTaxInclusive(!taxInclusive)}
                className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {taxInclusive ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* State Nexus Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Jurisdiction Tax Rates & Nexus Registrations
            </h3>
            <span className="text-xs text-slate-400">Automated geolocation tax calculation rules</span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Tax Type</th>
                <th className="py-3 px-4 text-right">Standard Rate</th>
                <th className="py-3 px-4">Nexus Status</th>
                <th className="py-3 px-4 text-right">Filing Cycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">California (CA), US</td>
                <td className="py-3 px-4 text-slate-500">State + District Sales Tax</td>
                <td className="py-3 px-4 text-right font-black">8.625%</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Physical Nexus (HQ)</td>
                <td className="py-3 px-4 text-right text-slate-400">Monthly</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">Texas (TX), US</td>
                <td className="py-3 px-4 text-slate-500">Economic Nexus Sales Tax</td>
                <td className="py-3 px-4 text-right font-black">8.250%</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">Economic (&gt; $500k)</td>
                <td className="py-3 px-4 text-right text-slate-400">Quarterly</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">European Union (One-Stop-Shop)</td>
                <td className="py-3 px-4 text-slate-500">Cross-Border VAT</td>
                <td className="py-3 px-4 text-right font-black">19.000% - 21.000%</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">OSS Registered</td>
                <td className="py-3 px-4 text-right text-slate-400">Quarterly</td>
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
            <span>Update Tax Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
