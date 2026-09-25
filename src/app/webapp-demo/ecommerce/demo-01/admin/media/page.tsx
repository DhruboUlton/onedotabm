'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../_context/StoreContext';
import { MediaAsset } from '../../_types';

export default function AdminMediaPage() {
  const { mediaAssets, addMediaAsset, deleteMediaAsset } = useStore();

  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filteredAssets = mediaAssets.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const mockName = 'fresh-organic-upload-' + Math.floor(100 + Math.random() * 900) + '.jpg';
      addMediaAsset({
        name: mockName,
        url: '/demo-assets/ecommerce/hero-banner.jpg',
        dimensions: '1200 x 1200',
        fileSize: '540 KB',
        fileType: 'image/jpeg',
        altText: 'Newly uploaded organic farm photography',
      });
      setIsUploading(false);
    }, 800);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2923] tracking-tight">
            Media Asset Library
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Store and manage high-resolution product photography and marketing banners ({mediaAssets.length} assets)
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#072D24] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c4437] transition-all disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload Media Asset'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search media files by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#DCD6CA] bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121]"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="group relative aspect-square rounded-2xl border border-[#ECE6DC] bg-white p-2 shadow-xs cursor-pointer hover:border-[#E87121] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative flex-1 rounded-xl overflow-hidden bg-[#FAF8F5]">
              <img
                src={asset.url}
                alt={asset.altText}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-2 text-left">
              <p className="text-[11px] font-bold text-zinc-800 truncate">{asset.name}</p>
              <p className="text-[10px] text-zinc-400">{asset.fileSize} • {asset.dimensions}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedAsset(null)}
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#ECE6DC] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
              <h3 className="font-bold text-[#1F2923] truncate">{selectedAsset.name}</h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#ECE6DC]">
              <img
                src={selectedAsset.url}
                alt={selectedAsset.altText}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1.5 text-zinc-600 rounded-xl bg-[#FAF8F5] p-3 border border-[#ECE6DC]">
              <div className="flex justify-between">
                <span>Dimensions:</span>
                <span className="font-semibold text-zinc-800">{selectedAsset.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="font-semibold text-zinc-800">{selectedAsset.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span>File Type:</span>
                <span className="font-semibold text-zinc-800">{selectedAsset.fileType}</span>
              </div>
              <div className="flex justify-between">
                <span>Uploaded:</span>
                <span className="font-semibold text-zinc-800">{selectedAsset.uploadedAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleCopyUrl(selectedAsset.url)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#072D24] py-2.5 font-bold text-white hover:bg-[#0c4437]"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied URL!' : 'Copy Asset URL'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete "${selectedAsset.name}"?`)) {
                    deleteMediaAsset(selectedAsset.id);
                    setSelectedAsset(null);
                  }
                }}
                className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
