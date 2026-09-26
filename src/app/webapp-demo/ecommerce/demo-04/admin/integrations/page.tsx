'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { IntegrationItem } from '../../_types';

export default function AdminIntegrationsPage() {
  const { integrations, updateIntegration, toggleIntegration, addToast } = useStore();

  const [editingItem, setEditingItem] = useState<IntegrationItem | null>(null);
  const [formTrackingId, setFormTrackingId] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const handleOpenEdit = (item: IntegrationItem) => {
    setEditingItem(item);
    setFormTrackingId(item.trackingId);
    setFormDescription(item.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateIntegration(editingItem.id, {
      trackingId: formTrackingId,
      description: formDescription,
      lastSync: 'Just now',
    });

    addToast('success', `${editingItem.name} configuration updated`);
    setEditingItem(null);
  };

  const handleTestPing = (item: IntegrationItem) => {
    addToast('info', `Simulating test event dispatch to ${item.name}...`);
    setTimeout(() => {
      updateIntegration(item.id, { lastSync: 'Just now' });
      addToast('success', `Test event received 200 OK from ${item.name} simulated endpoint!`);
    }, 600);
  };

  const getProviderIcon = (provider: IntegrationItem['provider']) => {
    switch (provider) {
      case 'GTM':
        return '🏷️';
      case 'Meta':
        return '🌐';
      case 'TikTok':
        return '🎵';
      case 'Webhook':
        return '⚡';
      default:
        return '🔌';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A6375] uppercase tracking-wider mb-1">
            <Link href="/webapp-demo/ecommerce/demo-04/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <span>Ecosystem</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-bubblegum">
            Marketing & Analytics Integrations 🔌
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure analytics pixels, tag managers, and e-commerce conversion event tracking for WonderSprout.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Simulation Ready</span>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm transition-all ${
              item.isEnabled ? 'border-gray-200 ring-1 ring-[#1CBBB4]/20' : 'border-gray-100 opacity-80'
            }`}
          >
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-inner">
                  {getProviderIcon(item.provider)}
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => {
                    toggleIntegration(item.id);
                    addToast('info', `${item.name} is now ${!item.isEnabled ? 'active' : 'disabled'}`);
                  }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    item.isEnabled ? 'bg-[#1CBBB4]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      item.isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bubblegum text-lg font-bold text-gray-900">{item.name}</h3>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      item.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {item.isEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Tracking ID display */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Identifier / Pixel Key
                </span>
                <span className="font-mono text-xs font-bold text-gray-800 break-all">
                  {item.trackingId || '— Not configured —'}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">Sync: {item.lastSync}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTestPing(item)}
                  disabled={!item.isEnabled}
                  className="px-2.5 py-1 text-gray-600 hover:text-gray-900 font-semibold disabled:opacity-30"
                  title="Simulate Event"
                >
                  Test Ping
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1 bg-[#0A6375] hover:bg-[#084f5e] text-white rounded-lg font-bold text-xs shadow-sm"
                >
                  Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getProviderIcon(editingItem.provider)}</span>
                <div>
                  <h3 className="font-bubblegum text-lg font-bold text-gray-900">
                    Configure {editingItem.name}
                  </h3>
                  <span className="text-xs text-gray-400">{editingItem.provider} Adapter</span>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tracking ID / Webhook URL
                </label>
                <input
                  type="text"
                  required
                  value={formTrackingId}
                  onChange={(e) => setFormTrackingId(e.target.value)}
                  placeholder="e.g. GTM-XXXXXX or numeric Pixel ID"
                  className="w-full px-3.5 py-2.5 font-mono text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#EB1551]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Purpose / Notes
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe where conversion tags fire..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#EB1551]"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                💡 In this demo environment, triggers execute locally without external network requests or third-party cookies.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#EB1551] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                >
                  Save Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
