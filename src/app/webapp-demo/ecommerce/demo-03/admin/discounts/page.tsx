'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { Coupon } from '../../_types';
import {
  Tag,
  Plus,
  Percent,
  DollarSign,
  Truck,
  Copy,
  CheckCircle,
  Calendar,
  Check,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';

export default function AdminDiscountsPage() {
  const { coupons, toggleCouponActive, showToast } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Code Copied', `"${code}" copied to clipboard`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = (c: Coupon) => {
    toggleCouponActive(c.id);
    showToast(
      'Coupon Updated',
      `Coupon ${c.code} is now ${!c.isActive ? 'Active' : 'Inactive'}`,
      'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Discounts & Coupons
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {coupons.length} Campaign Codes
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure promotional marketing promo codes, minimum spend thresholds, and checkout discounts.
          </p>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-100">
              Test Coupons on Storefront Checkout
            </h4>
            <p className="text-[11px] text-blue-700 dark:text-blue-300">
              Customers can apply these active codes during cart checkout to trigger instant reductions on subtotal or shipping.
            </p>
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => {
          const isCopied = copiedCode === c.code;

          return (
            <div
              key={c.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all shadow-sm flex flex-col justify-between ${
                c.isActive
                  ? 'border-slate-200/80 dark:border-slate-800'
                  : 'border-slate-200/50 dark:border-slate-800/50 opacity-60'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Code & Toggle */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-lg tracking-wider text-slate-900 dark:text-slate-100">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Copy coupon code"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <span className="inline-block text-[11px] text-slate-400 font-medium">
                      Expires {c.expiryDate}
                    </span>
                  </div>

                  {/* Active Toggle Switch */}
                  <button
                    onClick={() => handleToggle(c)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title={c.isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                  >
                    {c.isActive ? (
                      <ToggleRight className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-300 dark:text-slate-700" />
                    )}
                  </button>
                </div>

                {/* Value Banner */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Discount Value</span>
                  <span className="font-black text-sm text-blue-600 dark:text-blue-400">
                    {c.discountPercent
                      ? `${c.discountPercent}% Off Subtotal`
                      : c.discountAmount
                      ? `$${c.discountAmount} Instant Rebate`
                      : 'Free Standard Shipping'}
                  </span>
                </div>

                {/* Criteria */}
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Minimum Cart Spend:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {c.minSpend && c.minSpend > 0 ? `$${c.minSpend}` : 'None'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Times Redeemed:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {c.usageCount} checkouts
                    </strong>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      c.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  <span>{c.isActive ? 'Live on Store' : 'Inactive'}</span>
                </span>

                <span className="text-[10px] font-mono text-slate-400">ID: {c.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
