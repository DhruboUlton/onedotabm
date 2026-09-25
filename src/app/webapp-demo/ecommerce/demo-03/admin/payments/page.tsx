'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  CreditCard,
  Search,
  CheckCircle2,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Settings,
  Lock,
  Layers,
} from 'lucide-react';

interface PaymentGatewayConfig {
  id: string;
  name: string;
  provider: string;
  supportedCurrencies: string[];
  processingFee: string;
  settlementPeriod: string;
  enabled: boolean;
  testMode: boolean;
}

const initialGateways: PaymentGatewayConfig[] = [
  {
    id: 'gw-stripe',
    name: 'Credit & Debit Cards (Stripe)',
    provider: 'Stripe Global Elements',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
    processingFee: '2.9% + $0.30',
    settlementPeriod: 'T+2 Rolling',
    enabled: true,
    testMode: false,
  },
  {
    id: 'gw-applepay',
    name: 'Apple Pay & Touch ID',
    provider: 'Apple Developer Web Merchant',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'JPY'],
    processingFee: '2.9% + $0.30',
    settlementPeriod: 'T+2 Rolling',
    enabled: true,
    testMode: false,
  },
  {
    id: 'gw-paypal',
    name: 'PayPal Commerce Platform',
    provider: 'PayPal Express',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
    processingFee: '3.49% + $0.49',
    settlementPeriod: 'Immediate to PayPal Balance',
    enabled: true,
    testMode: false,
  },
  {
    id: 'gw-cod',
    name: 'Cash on Delivery (COD)',
    provider: 'Local Courier Hand-off',
    supportedCurrencies: ['USD'],
    processingFee: '0% + $5.00 Handling Surcharge',
    settlementPeriod: 'Weekly Reconciliation',
    enabled: true,
    testMode: false,
  },
  {
    id: 'gw-wire',
    name: 'Direct ACH / B2B Bank Wire',
    provider: 'Plaid / Modern Treasury',
    supportedCurrencies: ['USD'],
    processingFee: '0.8% (Capped at $5.00)',
    settlementPeriod: 'T+1 Business Day',
    enabled: false,
    testMode: true,
  },
];

export default function PaymentManagementPage() {
  const { showToast } = useStore();
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(initialGateways);

  const handleToggle = (id: string, name: string) => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newEnabled = !g.enabled;
        showToast('Gateway Status Changed', `${name} is now ${newEnabled ? 'Enabled' : 'Disabled'}`, 'info');
        return { ...g, enabled: newEnabled };
      })
    );
  };

  const handleToggleTestMode = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, testMode: !g.testMode } : g))
    );
    showToast('Sandbox Toggled', 'Test mode configuration updated', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Payment Rails & Gateway Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
              Checkout Methods
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure consumer payment gateways, test sandbox keys, currency rails, and handling fee surcharges.
          </p>
        </div>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gateways.map((gw) => (
          <div
            key={gw.id}
            className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between gap-4 shadow-sm ${
              gw.enabled ? 'border-slate-200/80 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                      {gw.name}
                    </h3>
                    <span className="text-[11px] text-slate-400">{gw.provider}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(gw.id, gw.name)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {gw.enabled ? (
                    <ToggleRight className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Fee Structure</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{gw.processingFee}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Settlement Speed</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{gw.settlementPeriod}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Supported: {gw.supportedCurrencies.join(', ')}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleTestMode(gw.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    gw.testMode
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                  }`}
                >
                  {gw.testMode ? 'Sandbox / Test Mode' : 'Live Production'}
                </button>
              </div>

              <button
                onClick={() => showToast('Gateway Config', 'API secret credentials verified with gateway server', 'info')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Test Ping
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
