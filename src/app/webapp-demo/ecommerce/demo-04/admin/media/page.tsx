'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Upload, Search, Trash2, Eye, X, Check } from 'lucide-react';
import { useStore } from '../../_context/StoreContext';

const defaultMedia = [
  {
    id: 'med-01',
    name: 'hero-banner.jpg',
    url: '/demo-assets/ecommerce/demo-04/hero-banner.jpg',
    category: 'Banners',
    size: '812 KB',
    dimensions: '2133 x 1010',
    alt: 'Happy children in superhero capes with wooden toys',
  },
  {
    id: 'med-02',
    name: 'abacus-board.jpg',
    url: '/demo-assets/ecommerce/demo-04/abacus-board.jpg',
    category: 'Products',
    size: '647 KB',
    dimensions: '1024 x 1024',
    alt: 'Montessori wooden motor skill abacus board',
  },
  {
    id: 'med-03',
    name: 'rainbow-tower.jpg',
    url: '/demo-assets/ecommerce/demo-04/rainbow-tower.jpg',
    category: 'Products',
    size: '287 KB',
    dimensions: '1024 x 1024',
    alt: 'Rainbow wooden geometry stacking pyramid',
  },
  {
    id: 'med-04',
    name: 'busy-board-house.jpg',
    url: '/demo-assets/ecommerce/demo-04/busy-board-house.jpg',
    category: 'Products',
    size: '598 KB',
    dimensions: '1024 x 1024',
    alt: 'Montessori wooden busy board cottage',
  },
  {
    id: 'med-05',
    name: 'stem-robot.jpg',
    url: '/demo-assets/ecommerce/demo-04/stem-robot.jpg',
    category: 'Products',
    size: '385 KB',
    dimensions: '1024 x 1024',
    alt: 'Sci-Fi robot and STEM mechanical builder',
  },
  {
    id: 'med-06',
    name: 'solar-orrery.jpg',
    url: '/demo-assets/ecommerce/demo-04/solar-orrery.jpg',
    category: 'Products',
    size: '590 KB',
    dimensions: '1024 x 1024',
    alt: 'Handcrafted solar system planetary orrery model',
  },
  {
    id: 'med-07',
    name: 'classroom.jpg',
    url: '/demo-assets/ecommerce/demo-04/classroom.jpg',
    category: 'Facilities',
    size: '870 KB',
    dimensions: '1440 x 1080',
    alt: 'Montessori classroom with natural low wooden shelves',
  },
  {
    id: 'med-08',
    name: 'about-kids.jpg',
    url: '/demo-assets/ecommerce/demo-04/about-kids.jpg',
    category: 'Lifestyle',
    size: '787 KB',
    dimensions: '1440 x 1080',
    alt: 'Two toddlers collaborating with wooden building blocks',
  },
];

export default function AdminMediaPage() {
  const { addToast } = useStore();
  const [mediaList, setMediaList] = useState(defaultMedia);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [previewItem, setPreviewItem] = useState<(typeof defaultMedia)[0] | null>(null);

  const filtered = mediaList.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSimulateUpload = () => {
    const newMedia = {
      id: 'med_' + Date.now(),
      name: `montessori-asset-${Math.floor(100 + Math.random() * 900)}.jpg`,
      url: '/demo-assets/ecommerce/demo-04/abacus-board.jpg',
      category: 'Products',
      size: '542 KB',
      dimensions: '1200 x 1200',
      alt: 'Newly uploaded educational wooden resource',
    };
    setMediaList((prev) => [newMedia, ...prev]);
    addToast('success', 'Media Uploaded', `Simulated upload of "${newMedia.name}".`);
  };

  const handleDelete = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    addToast('info', 'File Removed', 'Media file deleted from store library.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">Media Library</h1>
          <p className="text-xs text-[#6B6B84] font-nunito">
            {mediaList.length} high-resolution store photography assets & product diagrams.
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          className="ws-btn-primary px-5 py-2.5 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 self-start sm:self-auto shadow-md"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search image filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-nunito font-bold text-[#0F172A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold font-nunito">
          {['All', 'Products', 'Banners', 'Facilities', 'Lifestyle'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#0A6375] text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-[#FFEFE4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-[#FFEFE4]/40 overflow-hidden cursor-pointer"
              onClick={() => setPreviewItem(item)}
            >
              <Image src={item.url} alt={item.alt} fill className="object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewItem(item);
                  }}
                  className="w-8 h-8 rounded-full bg-white text-[#0A6375] flex items-center justify-center shadow-md hover:bg-[#1CBBB4] hover:text-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${item.name}"?`)) {
                      handleDelete(item.id);
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-white text-[#EB1551] flex items-center justify-center shadow-md hover:bg-[#EB1551] hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-1">
              <span className="font-bold text-xs text-[#0F172A] truncate block">{item.name}</span>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{item.dimensions}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewItem(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#0F172A]">{previewItem.name}</h4>
              <button onClick={() => setPreviewItem(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
              <Image src={previewItem.url} alt={previewItem.alt} fill className="object-contain" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-nunito">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase">Category</span>
                <strong className="text-[#0F172A]">{previewItem.category}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase">Resolution</span>
                <strong className="text-[#0F172A]">{previewItem.dimensions}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase">File Weight</span>
                <strong className="text-[#0F172A]">{previewItem.size}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase">MIME</span>
                <strong className="text-[#0F172A]">image/jpeg</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
