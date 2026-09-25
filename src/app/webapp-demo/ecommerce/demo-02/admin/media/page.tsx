'use client';

import React, { useState } from 'react';
import { useStore } from '../../_context/StoreContext';
import { MediaAsset } from '../../_types';
import { Image as ImageIcon, Upload, Search, Copy, Check, Trash2, X, ExternalLink } from 'lucide-react';

export default function AdminMediaPage() {
  const { mediaAssets, addMediaAsset, deleteMediaAsset, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Upload simulation modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadAlt, setUploadAlt] = useState('');

  const filteredAssets = mediaAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    showToast('Asset URL copied to clipboard.', 'success');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim() || !uploadUrl.trim()) return;

    addMediaAsset({
      name: uploadName.trim(),
      url: uploadUrl.trim(),
      dimensions: '1920 x 1080',
      fileSize: '340 KB',
      fileType: 'image/jpeg',
      altText: uploadAlt.trim() || uploadName.trim(),
    });

    setUploadName('');
    setUploadUrl('');
    setUploadAlt('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Digital Asset Management
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
            Media Library & Posters
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Central repository of high-resolution glass poster studio shots, room mockups, and banner visuals.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image Asset</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
          />
        </div>
        <span className="text-xs font-medium text-zinc-400">
          {filteredAssets.length} Assets
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-black hover:shadow-lg transition-all overflow-hidden cursor-pointer flex flex-col"
          >
            <div className="aspect-[4/3] bg-zinc-100 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={asset.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/70 text-white">
                {asset.fileSize}
              </span>
            </div>

            <div className="p-3">
              <p className="font-bold text-xs text-zinc-900 truncate">{asset.name}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">{asset.dimensions}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Inspection Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-extrabold text-sm text-zinc-900 truncate max-w-xs">
                {selectedAsset.name}
              </h3>
              <button onClick={() => setSelectedAsset(null)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedAsset.url} alt={selectedAsset.altText} className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="font-bold text-zinc-700">File URL:</span>
                <span className="font-mono text-[11px] truncate max-w-[260px] text-zinc-500">{selectedAsset.url}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="font-bold text-zinc-700">Dimensions:</span>
                <span>{selectedAsset.dimensions}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="font-bold text-zinc-700">File Size:</span>
                <span>{selectedAsset.fileSize} ({selectedAsset.fileType})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="font-bold text-zinc-700">Alt Text:</span>
                <span className="text-right max-w-[240px] truncate">{selectedAsset.altText}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => {
                  deleteMediaAsset(selectedAsset.id);
                  setSelectedAsset(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Delete Asset
              </button>

              <button
                onClick={() => handleCopyUrl(selectedAsset.url)}
                className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied' : 'Copy Asset URL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Simulation Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-extrabold text-base text-zinc-900">Upload Media Asset</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Asset File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. poster-ferrari-monza.jpg"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  required
                  placeholder="/demo-assets/ecommerce/demo-02/poster-porsche-gt3.jpg"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Descriptive Alt Text</label>
                <input
                  type="text"
                  placeholder="e.g. High-gloss tempered glass poster mounted in modern bedroom"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-xl font-bold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
