'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../_context/StoreContext';
import {
  Image as ImageIcon,
  Search,
  Plus,
  Calendar,
  ExternalLink,
  Edit2,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  X,
  Sparkles,
} from 'lucide-react';

interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  ctaText: string;
  link: string;
  active: boolean;
  schedule: string;
}

const initialBanners: BannerSlide[] = [
  {
    id: 'BAN-01',
    badge: 'Flagship Launch 2026',
    title: 'AeroBlade 16 Titanium Pro',
    subtitle: 'Intel Core Ultra 9 285H + NVIDIA RTX 5080 Laptop GPU with liquid-metal thermal chamber.',
    price: '$2,499.00',
    image: '/demo-assets/ecommerce/demo-03/hero-banner.jpg',
    ctaText: 'Shop Now • $2,499.00',
    link: '/webapp-demo/ecommerce/demo-03/products/aeroblade-16-titanium-pro',
    active: true,
    schedule: 'Continuous Evergreen',
  },
  {
    id: 'BAN-02',
    badge: 'Next-Gen Mobile Hardware',
    title: 'Zenith Titanium X1 Pro Studio',
    subtitle: '200MP Sony LYT-900 Periscope Zoom inside aerospace Grade 5 titanium housing.',
    price: '$1,199.00',
    image: '/demo-assets/ecommerce/demo-03/deal-phone.jpg',
    ctaText: 'Discover Flagship',
    link: '/webapp-demo/ecommerce/demo-03/products/zenith-titanium-x1',
    active: true,
    schedule: 'Continuous Evergreen',
  },
  {
    id: 'BAN-03',
    badge: 'Pro Esports Hardware',
    title: 'Valkyrie Hall-Effect Wireless Controller',
    subtitle: 'Zero-drift electromagnetic Hall sensors with 1000Hz ultra-low latency response.',
    price: '$179.99',
    image: '/demo-assets/ecommerce/demo-03/prod-gaming.jpg',
    ctaText: 'Claim Drop',
    link: '/webapp-demo/ecommerce/demo-03/products/valkyrie-hall-effect-controller',
    active: true,
    schedule: 'Ends Oct 15, 2026',
  },
];

export default function BannersHeroPage() {
  const { showToast } = useStore();
  const [banners, setBanners] = useState<BannerSlide[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Banner Form
  const [formBadge, setFormBadge] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCta, setFormCta] = useState('');
  const [formLink, setFormLink] = useState('');

  const handleToggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const newActive = !b.active;
        showToast('Banner Toggled', `Banner "${b.title}" is now ${newActive ? 'Active' : 'Inactive'}`, 'info');
        return { ...b, active: newActive };
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const newBanner: BannerSlide = {
      id: `BAN-${Math.floor(10 + Math.random() * 90)}`,
      badge: formBadge || 'Seasonal Spotlight',
      title: formTitle,
      subtitle: formSubtitle || 'Next-generation engineering hardware direct from verified labs.',
      price: '$499.00',
      image: '/demo-assets/ecommerce/demo-03/bento-audio.jpg',
      ctaText: formCta || 'Explore Collection',
      link: formLink || '/webapp-demo/ecommerce/demo-03/products',
      active: true,
      schedule: 'Scheduled Run',
    };

    setBanners((prev) => [...prev, newBanner]);
    showToast('Banner Added', `New promotional hero slide added to carousel`, 'success');
    setIsModalOpen(false);
    setFormTitle('');
    setFormBadge('');
    setFormSubtitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Hero Carousel & Banners
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              {banners.filter((b) => b.active).length} Active Slides
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage full-bleed promotional slides, call-to-action buttons, headline copy, and destination routing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner Slide</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`rounded-3xl bg-white dark:bg-slate-900 border overflow-hidden flex flex-col justify-between shadow-sm transition-all ${
              banner.active ? 'border-slate-200/80 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-800 opacity-60'
            }`}
          >
            {/* Image Preview Container */}
            <div className="relative h-44 w-full bg-slate-900">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                  {banner.badge}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-black text-sm line-clamp-1">{banner.title}</h3>
                <span className="text-[11px] text-slate-300">{banner.ctaText}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {banner.subtitle}
              </p>

              <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>Route: <span className="font-mono text-slate-700 dark:text-slate-300 truncate">{banner.link}</span></div>
                <div>Schedule: <span className="font-semibold text-slate-700 dark:text-slate-300">{banner.schedule}</span></div>
              </div>

              {/* Bottom Toggle Bar */}
              <div className="pt-2 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${banner.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {banner.active ? '● Live in Carousel' : 'Inactive'}
                </span>

                <button
                  onClick={() => handleToggleActive(banner.id)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Toggle Slide Visibility"
                >
                  {banner.active ? (
                    <ToggleRight className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Add Hero Carousel Slide
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Headline Tag / Badge
                </label>
                <input
                  type="text"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="e.g. Flagship Launch 2026"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. AeroBlade 16 Titanium Pro"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Subheading Description
                </label>
                <textarea
                  rows={2}
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Short engaging hardware highlight copy..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  CTA Button Text & Target Link
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formCta}
                    onChange={(e) => setFormCta(e.target.value)}
                    placeholder="e.g. Shop Now • $2,499"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="/products/aeroblade"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
