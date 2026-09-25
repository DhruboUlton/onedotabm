'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Phone,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Info,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface SimulatedResult {
  phone: string;
  totalParcels: number;
  delivered: number;
  cancelled: number;
  deliveryRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendation: string;
  courierData: {
    courier: string;
    parcels: number;
    successRate: number;
  }[];
}

export default function AdminFraudCheckPage() {
  const { orders, showToast } = useStore();

  const [inputPhone, setInputPhone] = useState('01712-345678');
  const [provider, setProvider] = useState<'pathao' | 'steadfast' | 'paperfly'>('pathao');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SimulatedResult | null>({
    phone: '01712-345678',
    totalParcels: 38,
    delivered: 36,
    cancelled: 2,
    deliveryRate: 94.7,
    riskLevel: 'Low',
    recommendation: 'Safe for Cash on Delivery (COD). Very high delivery completion record.',
    courierData: [
      { courier: 'Pathao Courier', parcels: 22, successRate: 95 },
      { courier: 'Steadfast Courier', parcels: 12, successRate: 92 },
      { courier: 'Paperfly', parcels: 4, successRate: 100 },
    ],
  });

  const handleRunCheck = (targetPhone?: string) => {
    const phoneToTest = targetPhone || inputPhone;
    if (!phoneToTest.trim()) return;

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);

      // Generate deterministic or realistic result based on phone digits
      const digits = phoneToTest.replace(/\D/g, '');
      const lastDigit = parseInt(digits.slice(-1) || '5', 10);

      let totalParcels = 15 + (lastDigit * 4);
      let cancelled = lastDigit > 7 ? 6 : lastDigit > 4 ? 2 : 1;
      let delivered = totalParcels - cancelled;
      let deliveryRate = Number(((delivered / totalParcels) * 100).toFixed(1));

      let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
      let recommendation = 'Safe for standard Cash on Delivery with bubble-wrap packaging.';

      if (deliveryRate < 75) {
        riskLevel = 'High';
        recommendation = 'HIGH RETURN RISK. Request ৳300 advance delivery payment before packing tempered glass.';
      } else if (deliveryRate < 88) {
        riskLevel = 'Medium';
        recommendation = 'Moderate cancellation history. Call customer to re-confirm address before dispatch.';
      }

      setResult({
        phone: phoneToTest,
        totalParcels,
        delivered,
        cancelled,
        deliveryRate,
        riskLevel,
        recommendation,
        courierData: [
          { courier: 'Pathao Courier API', parcels: Math.round(totalParcels * 0.6), successRate: Math.min(100, Math.round(deliveryRate + 2)) },
          { courier: 'Steadfast Courier', parcels: Math.round(totalParcels * 0.3), successRate: Math.max(50, Math.round(deliveryRate - 3)) },
          { courier: 'Paperfly Network', parcels: Math.max(1, Math.round(totalParcels * 0.1)), successRate: Math.round(deliveryRate) },
        ],
      });

      showToast(`Verification completed for ${phoneToTest}`, 'info');
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Risk & Courier Trust Intelligence
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Courier Fraud Check & Return Rate Intelligence
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Simulate nationwide courier delivery completion history to protect against high-return COD glass orders.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-amber-800 text-xs font-semibold">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo Simulation Mode</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Engine Box */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-black" />
            <span>Verify Customer Phone Number</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Select Courier Database
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pathao', label: 'Pathao API' },
                  { id: 'steadfast', label: 'Steadfast' },
                  { id: 'paperfly', label: 'Paperfly' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProvider(p.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      provider === p.id
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Recipient Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  placeholder="017XX-XXXXXX"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-mono font-bold rounded-xl border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              onClick={() => handleRunCheck()}
              disabled={isChecking}
              className="w-full py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <span>Querying Courier Network...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Run Fraud & Delivery Check</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Check from Current Orders */}
          <div className="border-t border-zinc-100 pt-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Verify Live Storefront Orders ({orders.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {o.customerName} ({o.id})
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500">{o.phone}</p>
                  </div>
                  <button
                    onClick={() => {
                      setInputPhone(o.phone);
                      handleRunCheck(o.phone);
                    }}
                    className="px-2.5 py-1 bg-white border border-zinc-200 hover:border-black text-[10px] font-bold text-zinc-800 rounded-lg shrink-0 cursor-pointer shadow-2xs"
                  >
                    Analyze
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Result Card */}
        <div className="lg:col-span-6 space-y-4">
          {result && (
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Analysis for</span>
                  <h3 className="text-base font-black text-zinc-900 font-mono">{result.phone}</h3>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                    result.riskLevel === 'Low'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : result.riskLevel === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {result.riskLevel === 'Low' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>{result.riskLevel} Risk Profile</span>
                </div>
              </div>

              {/* Delivery Completion Stat Box */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Total Parcels</p>
                  <p className="text-xl font-black text-zinc-900 mt-0.5">{result.totalParcels}</p>
                </div>
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-700">Delivered</p>
                  <p className="text-xl font-black text-emerald-700 mt-0.5">{result.delivered}</p>
                </div>
                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 text-center">
                  <p className="text-[10px] uppercase font-bold text-rose-700">Returned/Cancel</p>
                  <p className="text-xl font-black text-rose-700 mt-0.5">{result.cancelled}</p>
                </div>
              </div>

              {/* Delivery Rate Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-600">Nationwide Delivery Completion Rate</span>
                  <span className="text-zinc-900 font-mono">{result.deliveryRate}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.deliveryRate > 85 ? 'bg-emerald-500' : result.deliveryRate > 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${result.deliveryRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="p-4 rounded-xl bg-zinc-900 text-white space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Recommended Fulfillment Action
                </p>
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                  {result.recommendation}
                </p>
              </div>

              {/* Courier Network Breakdown */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-zinc-800">Historical Delivery Breakdown by Courier</p>
                <div className="space-y-2">
                  {result.courierData.map((c) => (
                    <div
                      key={c.courier}
                      className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-zinc-100 bg-zinc-50"
                    >
                      <span className="font-semibold text-zinc-700">{c.courier}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 text-[11px]">{c.parcels} orders</span>
                        <span className="font-mono font-bold text-emerald-600">{c.successRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
