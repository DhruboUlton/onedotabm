'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import {
  Layout,
  Search,
  Eye,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface HomepageSection {
  id: string;
  name: string;
  type: 'Hero Slider' | 'Circular Capsules' | 'Bento Showcase' | 'Trending Grid' | 'Brand Ribbon' | 'Editorial Journal';
  slot: string;
  visible: boolean;
  order: number;
  itemCount: number;
}

const initialSections: HomepageSection[] = [
  { id: 'sec-1', name: 'Flagship Hero Promotional Carousel', type: 'Hero Slider', slot: 'Header Top', visible: true, order: 1, itemCount: 3 },
  { id: 'sec-2', name: 'Partner OEM Hardware Ribbon', type: 'Brand Ribbon', slot: 'Below Hero', visible: true, order: 2, itemCount: 7 },
  { id: 'sec-3', name: 'Shop by Categories (Circular Hardware Capsules)', type: 'Circular Capsules', slot: 'Main Body 1', visible: true, order: 3, itemCount: 9 },
  { id: 'sec-4', name: 'Editorial Bento Showcase (5-Cell Asymmetric Grid)', type: 'Bento Showcase', slot: 'Main Body 2', visible: true, order: 4, itemCount: 5 },
  { id: 'sec-5', name: 'Trending Electronics & Verified Merchant Drops', type: 'Trending Grid', slot: 'Main Body 3', visible: true, order: 5, itemCount: 8 },
  { id: 'sec-6', name: 'Kinetic Tech Journal & Hardware Insights', type: 'Editorial Journal', slot: 'Footer Anchor', visible: true, order: 6, itemCount: 3 },
];

export default function HomepageContentPage() {
  const { showToast } = useStore();
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);

  const handleToggleVisible = (id: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newVis = !s.visible;
        showToast('Section Visibility Updated', `"${s.name}" is now ${newVis ? 'Visible' : 'Hidden'} on storefront`, 'info');
        return { ...s, visible: newVis };
      })
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSections((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    showToast('Layout Reordered', 'Section position moved up', 'info');
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    setSections((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    showToast('Layout Reordered', 'Section position moved down', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Homepage Layout & Sections
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              CMS Controls
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure visual hierarchy, enable/disable landing sections, and reorder flagship content modules.
          </p>
        </div>

        <Link
          href="/webapp-demo/ecommerce/demo-03"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Live Storefront</span>
        </Link>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
              section.visible ? 'border-slate-200/80 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                {idx + 1}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {section.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {section.type}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Slot: <span className="font-semibold text-slate-600 dark:text-slate-300">{section.slot}</span> • Displaying {section.itemCount} items
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {/* Up/Down buttons */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMoveUp(idx)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                  title="Move section up"
                >
                  <ArrowUp className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => handleMoveDown(idx)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                  title="Move section down"
                >
                  <ArrowDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
              </div>

              {/* Visibility Toggle */}
              <button
                onClick={() => handleToggleVisible(section.id)}
                className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                title={section.visible ? 'Hide section' : 'Show section'}
              >
                {section.visible ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
