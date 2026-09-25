'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ShieldCheck,
  User,
  History,
  Phone,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';

function FraudCheckContent() {
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get('phone') || '';

  const { orders } = useStore();
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '01819348210');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    phone: string;
    totalOrders: number;
    delivered: number;
    returned: number;
    successRate: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendation: string;
  } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsChecking(true);
    setTimeout(() => {
      // Simulate realistic courier delivery check based on phone digits
      const lastDigit = parseInt(phoneNumber.slice(-1) || '5', 10);
      const isHighRisk = lastDigit === 9;
      const isMediumRisk = lastDigit === 8 || lastDigit === 7;

      const total = 18 + lastDigit * 2;
      const returned = isHighRisk ? 9 : isMediumRisk ? 4 : 1;
      const delivered = total - returned;
      const successRate = Math.round((delivered / total) * 100);

      setResult({
        phone: phoneNumber,
        totalOrders: total,
        delivered,
        returned,
        successRate,
        riskLevel: isHighRisk ? 'High' : isMediumRisk ? 'Medium' : 'Low',
        recommendation: isHighRisk
          ? 'High return risk detected. Recommend advance delivery charge collection before dispatching.'
          : isMediumRisk
          ? 'Moderate return history. A phone confirmation call is recommended.'
          : 'Excellent delivery track record across Steadfast & Pathao. Safe for Cash on Delivery dispatch.',
      });

      setIsChecking(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 mb-2">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Simulated Courier Verification Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
          Courier Delivery Trust & Fraud Verification
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Verify customer historical parcel delivery success rates across national courier networks (Steadfast, Pathao, RedX)
        </p>
      </div>

      {/* Phone lookup form */}
      <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs max-w-xl">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Customer Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                required
                placeholder="e.g. 01711234567 or 01819348210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] py-2 pl-9 pr-4 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">
              * Simulated courier API response for demonstration purposes.
            </span>
            <button
              type="submit"
              disabled={isChecking}
              className="rounded-xl bg-[#072D24] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0c4437] transition-all disabled:opacity-50"
            >
              {isChecking ? 'Checking Courier Database...' : 'Run Fraud & Trust Check'}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div className="max-w-2xl rounded-3xl border border-[#ECE6DC] bg-white p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-4">
            <div>
              <span className="text-xs text-zinc-400">Customer Phone:</span>
              <p className="font-mono text-lg font-black text-[#1F2923]">{result.phone}</p>
            </div>

            <div
              className={`rounded-2xl px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider ${
                result.riskLevel === 'Low'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : result.riskLevel === 'Medium'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {result.riskLevel} Risk Parcel Profile
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-2xl bg-[#FAF8F5] p-3 border border-[#ECE6DC]">
              <span className="text-[11px] text-zinc-400">Total Parcels</span>
              <p className="text-xl font-black text-zinc-800">{result.totalOrders}</p>
            </div>

            <div className="rounded-2xl bg-emerald-50/70 p-3 border border-emerald-200">
              <span className="text-[11px] text-emerald-700">Delivered</span>
              <p className="text-xl font-black text-emerald-800">{result.delivered}</p>
            </div>

            <div className="rounded-2xl bg-rose-50/70 p-3 border border-rose-200">
              <span className="text-[11px] text-rose-700">Returned/Cancelled</span>
              <p className="text-xl font-black text-rose-800">{result.returned}</p>
            </div>

            <div className="rounded-2xl bg-[#FAF8F5] p-3 border border-[#ECE6DC]">
              <span className="text-[11px] text-zinc-400">Success Rate</span>
              <p className="text-xl font-black text-[#E87121]">{result.successRate}%</p>
            </div>
          </div>

          {/* Recommendation */}
          <div
            className={`rounded-2xl p-4 text-xs font-medium ${
              result.riskLevel === 'Low'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : result.riskLevel === 'Medium'
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {result.riskLevel === 'Low' ? (
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              )}
              <div>
                <strong className="block font-bold mb-0.5">Merchant Recommendation:</strong>
                <span>{result.recommendation}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminFraudCheckPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-zinc-400">Loading fraud check...</div>}>
      <FraudCheckContent />
    </Suspense>
  );
}
