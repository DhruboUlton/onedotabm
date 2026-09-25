'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  CreditCard,
  DollarSign,
  Save,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Lock,
} from 'lucide-react';

export default function PaymentSettingsConfigPage() {
  const { showToast } = useStore();

  const [minPayout, setMinPayout] = useState(100);
  const [holdingDays, setHoldingDays] = useState(3);
  const [payoutSchedule, setPayoutSchedule] = useState('Friday');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [require2FA, setRequire2FA] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Payment Parameters Saved', 'Disbursal schedule, holding windows, and minimum thresholds updated', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Payment & Settlement Configuration
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              Treasury Parameters
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure merchant escrow hold durations, minimum balance payout thresholds, and automated disbursal cadence.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  Minimum Payout Threshold ($)
                </h3>
                <span className="text-xs text-slate-400">Minimum vendor wallet balance to trigger automated ACH</span>
              </div>
            </div>

            <div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={minPayout}
                  onChange={(e) => setMinPayout(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Vendor balances below ${minPayout} roll over to the subsequent billing cycle.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  Escrow Transit Hold Window (Days)
                </h3>
                <span className="text-xs text-slate-400">Inspection buffer following courier delivery scan</span>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="number"
                  value={holdingDays}
                  onChange={(e) => setHoldingDays(Number(e.target.value))}
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">Days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Funds remain in escrow for {holdingDays} days to absorb customer returns before transferring to merchant available balance.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                Automated Batch Payout Schedule
              </h3>
              <span className="text-xs text-slate-400">Recurring day for automated NACHA/ACH dispatch transmission</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Disbursal Day of Week
              </label>
              <select
                value={payoutSchedule}
                onChange={(e) => setPayoutSchedule(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none"
              >
                <option value="Monday">Every Monday (09:00 UTC)</option>
                <option value="Wednesday">Every Wednesday (09:00 UTC)</option>
                <option value="Friday">Every Friday (09:00 UTC)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Settlement Base Currency
              </label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none"
              >
                <option value="USD">USD - United States Dollar ($)</option>
                <option value="EUR">EUR - European Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={require2FA}
                  onChange={(e) => setRequire2FA(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Require 2FA for Wire Approval
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Payment Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
