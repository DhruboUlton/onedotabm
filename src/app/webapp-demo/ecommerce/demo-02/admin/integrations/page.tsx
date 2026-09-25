'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { Integration } from '../../_types';
import {
  Webhook,
  Plus,
  Trash2,
  Edit2,
  Check,
  Code2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Info,
  ExternalLink,
} from 'lucide-react';

export default function AdminIntegrationsPage() {
  const { integrations, updateIntegration, addIntegration, deleteIntegration, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Integration | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<Integration['type']>('meta_pixel');
  const [placement, setPlacement] = useState<Integration['placement']>('head');
  const [code, setCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setType('meta_pixel');
    setPlacement('head');
    setCode("// Enter snippet or pixel tracking tag\nfbq('track', 'PageView');");
    setIsEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Integration) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setPlacement(item.placement);
    setCode(item.code);
    setIsEnabled(item.isEnabled);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateIntegration(editingItem.id, {
        name: name.trim(),
        type,
        placement,
        code,
        isEnabled,
      });
      showToast(`Integration "${name}" updated.`, 'success');
    } else {
      addIntegration({
        name: name.trim(),
        type,
        placement,
        code,
        isEnabled,
      });
      showToast(`Integration "${name}" added.`, 'success');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Ad Tracking & Analytics
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Integrations & Tracking Pixels
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure Meta Pixel, Google Tag Manager, TikTok Pixel, and marketing event containers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* Security Note */}
      <div className="p-4 bg-zinc-900 text-white rounded-2xl flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-white">Sandboxed Demo Environment</p>
          <p className="text-zinc-300 leading-relaxed">
            Pixels and scripts configured here are simulated and stored locally. No actual third-party tracking cookies or network requests are dispatched to external advertising platforms.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 flex flex-col justify-between hover:border-zinc-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase bg-zinc-100 px-2 py-0.5 rounded text-zinc-600 font-semibold">
                  {item.placement} tag
                </span>

                <button
                  type="button"
                  onClick={() => updateIntegration(item.id, { isEnabled: !item.isEnabled })}
                  className="cursor-pointer"
                  title={item.isEnabled ? 'Active' : 'Disabled'}
                >
                  {item.isEnabled ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                      Disabled
                    </span>
                  )}
                </button>
              </div>

              <h3 className="font-bold text-sm text-zinc-900">{item.name}</h3>
              <p className="text-[11px] text-zinc-400 capitalize mt-0.5">
                Type: {item.type.replace('_', ' ')}
              </p>

              {/* Code Snippet Box */}
              <div className="mt-4 p-3 bg-zinc-950 text-emerald-400 rounded-xl font-mono text-[10px] overflow-x-auto max-h-24 border border-zinc-800">
                <code>{item.code}</code>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-4 text-xs font-semibold">
              <button
                onClick={() => handleOpenEdit(item)}
                className="text-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Configure</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Remove integration "${item.name}"?`)) {
                    deleteIntegration(item.id);
                  }
                }}
                className="text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200">
            <h2 className="text-lg font-extrabold text-zinc-900 mb-1">
              {editingItem ? 'Edit Integration' : 'Add New Tracking Integration'}
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              Enter container tag snippets or advertising pixels to simulate tracking.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Integration Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meta Pixel - Purchase Conversion"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-300 font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Platform Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white font-medium"
                  >
                    <option value="meta_pixel">Meta Pixel</option>
                    <option value="gtm">Google Tag Manager</option>
                    <option value="tiktok_pixel">TikTok Pixel</option>
                    <option value="ga4">Google Analytics 4</option>
                    <option value="custom">Custom Javascript</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Placement
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white font-medium"
                  >
                    <option value="head">&lt;head&gt; section</option>
                    <option value="body_start">&lt;body&gt; start</option>
                    <option value="body_end">&lt;body&gt; footer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Tracking Code Script Snippet
                </label>
                <textarea
                  rows={4}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-300 bg-zinc-950 text-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="intActive"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <label htmlFor="intActive" className="text-xs font-bold text-zinc-800 cursor-pointer">
                  Enable integration
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {editingItem ? 'Save Updates' : 'Add Integration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
