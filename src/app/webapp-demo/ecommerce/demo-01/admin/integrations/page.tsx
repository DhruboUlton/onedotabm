'use client';

import React, { useState } from 'react';
import { Plug2, Plus, Trash2, Check, X, Shield, Code2 } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { Integration } from '../../_types';

export default function AdminIntegrationsPage() {
  const { integrations, updateIntegration, addIntegration, deleteIntegration } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<Integration['type']>('meta_pixel');
  const [placement, setPlacement] = useState<Integration['placement']>('head');
  const [code, setCode] = useState('');

  const handleAddIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addIntegration({
      name,
      type,
      placement,
      code,
      isEnabled: true,
    });

    setName('');
    setCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Marketing & Analytics Integrations
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage conversion tracking pixels, Meta Ads CAPI scripts, Google Analytics and custom tracking tags
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#072D24] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c4437] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Pixel / Tag</span>
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((int) => (
          <div
            key={int.id}
            className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    int.isEnabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {int.isEnabled ? 'Active Tracking' : 'Disabled'}
                </span>

                <button
                  onClick={() => updateIntegration(int.id, { isEnabled: !int.isEnabled })}
                  className="text-xs font-bold text-[#072D24] hover:underline"
                >
                  {int.isEnabled ? 'Turn Off' : 'Enable'}
                </button>
              </div>

              <h3 className="text-base font-bold text-[#1F2923]">{int.name}</h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5 uppercase">
                Placement: &lt;{int.placement}&gt;
              </p>

              {/* Code Snippet Box */}
              <div className="mt-3 rounded-xl bg-zinc-900 p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-24">
                <code>{int.code}</code>
              </div>
            </div>

            <div className="border-t border-[#F0ECE4] pt-3 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Client-side simulated tag</span>
              <button
                onClick={() => {
                  if (confirm(`Remove integration "${int.name}"?`)) {
                    deleteIntegration(int.id);
                  }
                }}
                className="text-zinc-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#ECE6DC] space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#1F2923]">Add Tracking Pixel / Tag</h3>

            <form onSubmit={handleAddIntegration} className="space-y-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Integration Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Snap Pixel / Hotjar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5"
                  >
                    <option value="meta_pixel">Meta Pixel</option>
                    <option value="gtm">Google Tag Manager</option>
                    <option value="tiktok_pixel">TikTok Pixel</option>
                    <option value="custom">Custom HTML/JS Tag</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Placement</label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as any)}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-white p-2.5"
                  >
                    <option value="head">&lt;head&gt; section</option>
                    <option value="body_start">&lt;body&gt; opening</option>
                    <option value="body_end">&lt;body&gt; closing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Code / Script Body</label>
                <textarea
                  rows={3}
                  required
                  placeholder="paste snippet or tracking ID here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl border border-[#DCD6CA] bg-zinc-900 p-2.5 font-mono text-emerald-400 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0ECE4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#072D24] px-5 py-2 font-bold text-white hover:bg-[#0c4437]"
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
