'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';

interface CheckResult {
  phone: string;
  customerName: string;
  city: string;
  totalOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  successRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number; // 0-100 (lower is safer)
  reasons: string[];
}

export default function AdminFraudCheckPage() {
  const { orders, addToast } = useStore();

  const [inputQuery, setInputQuery] = useState('+1 (555) 392-1084');
  const [selectedProvider, setSelectedProvider] = useState('WonderGuard AI');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>({
    phone: '+1 (555) 392-1084',
    customerName: 'Eleanor Vance',
    city: 'San Francisco, CA',
    totalOrders: 14,
    deliveredOrders: 13,
    returnedOrders: 1,
    successRate: 92.8,
    riskLevel: 'Low',
    riskScore: 8,
    reasons: [
      'Verified delivery address matched with residential postal database',
      'Consistent buyer phone history across 4 major couriers',
      'Zero dispute or chargeback flags reported in the last 180 days',
    ],
  });

  const handleRunCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) {
      addToast('error', 'Please enter a phone number or customer name');
      return;
    }

    setIsChecking(true);

    setTimeout(() => {
      // Check if matches an existing order customer
      const matchedOrder = orders.find(
        (o) =>
          o.phone.includes(inputQuery) ||
          o.customerName.toLowerCase().includes(inputQuery.toLowerCase()) ||
          o.orderNumber.toLowerCase().includes(inputQuery.toLowerCase())
      );

      if (matchedOrder) {
        setResult({
          phone: matchedOrder.phone,
          customerName: matchedOrder.customerName,
          city: matchedOrder.city,
          totalOrders: 5,
          deliveredOrders: 4,
          returnedOrders: 1,
          successRate: 80.0,
          riskLevel: matchedOrder.fraudRisk,
          riskScore: matchedOrder.fraudScore,
          reasons: [
            `Active order in queue: ${matchedOrder.orderNumber}`,
            `Payment method: ${matchedOrder.paymentMethod}`,
            matchedOrder.fraudRisk === 'Low'
              ? 'Standard shipping address with low chargeback index'
              : 'Repeated order attempts or multiple addresses flagged',
          ],
        });
      } else {
        // Generate simulated profile based on query
        const isSuspicious = inputQuery.includes('999') || inputQuery.toLowerCase().includes('bot');
        setResult({
          phone: inputQuery,
          customerName: 'Simulated Parent Profile',
          city: 'Austin, TX',
          totalOrders: isSuspicious ? 3 : 8,
          deliveredOrders: isSuspicious ? 1 : 7,
          returnedOrders: isSuspicious ? 2 : 1,
          successRate: isSuspicious ? 33.3 : 87.5,
          riskLevel: isSuspicious ? 'High' : 'Low',
          riskScore: isSuspicious ? 82 : 14,
          reasons: isSuspicious
            ? [
                'High return/refusal rate on Cash on Delivery orders',
                'Multiple failed payment attempts detected in last 24 hours',
                'IP geolocation does not match billing zip code',
              ]
            : [
                'Clean courier delivery history with valid phone number',
                'No red flags in national merchant cross-check database',
              ],
        });
      }

      setIsChecking(false);
      addToast('success', 'Verification complete');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6375] uppercase tracking-wider mb-1">
            <Link href="/webapp-demo/ecommerce/demo-04/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <span>Security & Fraud Prevention</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-bubblegum">
            Customer Courier & Fraud Verification 🛡️
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Inspect customer delivery reliability, chargeback risks, and courier return histories before dispatching orders.
          </p>
        </div>

        {/* Demo badge */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>Simulated Telemetry Provider (Demo Mode)</span>
        </div>
      </div>

      {/* Query Search Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleRunCheck} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Provider Selector */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Verification Engine
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:outline-none focus:border-[#0A6375]"
              >
                <option value="WonderGuard AI">WonderGuard AI Risk Scoring (Built-in)</option>
                <option value="Steadfast API">Steadfast Courier Delivery DB (Simulated)</option>
                <option value="RedX TrustEngine">RedX Merchant Trust Engine (Simulated)</option>
                <option value="Pathao Courier API">Pathao Courier History (Simulated)</option>
              </select>
            </div>

            {/* Input Query */}
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Customer Phone Number, Order #, or Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="e.g. +1 (555) 392-1084 or WS-2026-4821"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#EB1551]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isChecking}
                className="w-full py-2.5 bg-[#0A6375] hover:bg-[#084f5e] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2"
              >
                {isChecking ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Risk</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick preset tests */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-gray-400 font-bold">Quick Test Presets:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setInputQuery(o.phone);
                }}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-mono text-[11px]"
              >
                {o.customerName} ({o.phone})
              </button>
            ))}
            <button
              type="button"
              onClick={() => setInputQuery('+1 (999) 000-BOT')}
              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-mono text-[11px] font-bold"
            >
              Test High Risk Case 🚨
            </button>
          </div>
        </form>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Result Banner */}
          <div
            className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              result.riskLevel === 'Low'
                ? 'bg-emerald-50/50 border-emerald-100'
                : result.riskLevel === 'Medium'
                ? 'bg-amber-50/50 border-amber-100'
                : 'bg-red-50/50 border-red-100'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    result.riskLevel === 'Low'
                      ? 'bg-emerald-100 text-emerald-800'
                      : result.riskLevel === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      result.riskLevel === 'Low'
                        ? 'bg-emerald-600'
                        : result.riskLevel === 'Medium'
                        ? 'bg-amber-600'
                        : 'bg-red-600'
                    }`}
                  />
                  <span>{result.riskLevel} Fraud Risk ({result.riskScore}/100)</span>
                </span>
                <span className="text-xs text-gray-500 font-medium">via {selectedProvider}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-2 font-bubblegum">
                Verification Report: {result.customerName}
              </h2>
              <p className="text-xs text-gray-600">
                Contact: <span className="font-mono font-bold">{result.phone}</span> • Location: {result.city}
              </p>
            </div>

            {/* Quick action decision */}
            <div className="flex items-center gap-2">
              {result.riskLevel === 'Low' ? (
                <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2">
                  <span>✓ Approved for Immediate Packing</span>
                </div>
              ) : (
                <div className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2">
                  <span>⚠️ Manual Phone Call Recommended</span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-center p-6 bg-gray-50/50">
            <div className="p-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                Total Orders Found
              </span>
              <span className="text-2xl font-black text-gray-900 mt-1 block">
                {result.totalOrders}
              </span>
            </div>
            <div className="p-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                Successfully Delivered
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {result.deliveredOrders}
              </span>
            </div>
            <div className="p-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                Returned / Rejected
              </span>
              <span className="text-2xl font-black text-red-500 mt-1 block">
                {result.returnedOrders}
              </span>
            </div>
            <div className="p-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                Delivery Success Rate
              </span>
              <span className="text-2xl font-black text-[#0A6375] mt-1 block">
                {result.successRate}%
              </span>
            </div>
          </div>

          {/* Detailed Diagnostic Reasons */}
          <div className="p-6 space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Diagnostic Risk Signals & Telemetry Notes:
            </h3>
            <ul className="space-y-2">
              {result.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                  <span className="text-sm">{result.riskLevel === 'Low' ? '🟢' : '🔴'}</span>
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Orders Table with Fraud Scores */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bubblegum text-lg font-bold text-gray-900">
          Recent Store Orders & Real-time Risk Assessment
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">{o.orderNumber}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{o.customerName}</td>
                  <td className="py-3 px-4 font-mono text-gray-500">{o.phone}</td>
                  <td className="py-3 px-4 text-gray-600">{o.city}</td>
                  <td className="py-3 px-4 text-gray-600">{o.paymentMethod}</td>
                  <td className="py-3 px-4 font-bold text-[#0A6375]">${o.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        o.fraudRisk === 'Low'
                          ? 'bg-emerald-50 text-emerald-700'
                          : o.fraudRisk === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <span>{o.fraudRisk}</span>
                      <span>({o.fraudScore})</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setInputQuery(o.phone)}
                      className="text-[#0A6375] hover:text-[#EB1551] font-bold"
                    >
                      Deep Scan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
