'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../_context/StoreContext';
import { ProductCard } from '../_components/ProductCard';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  Sparkles,
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  Watch,
  Camera,
  Home,
  Cpu,
  Layers,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  laptop: Laptop,
  smartphone: Smartphone,
  headphones: Headphones,
  'gamepad-2': Gamepad2,
  watch: Watch,
  zap: Zap,
  camera: Camera,
  home: Home,
  cpu: Cpu,
};

export default function StorefrontHomePage() {
  const { products, categories, vendors, articles } = useStore();

  // Hero carousel state
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroSlides = [
    {
      title: 'ApexBook Ultra 16',
      subtitle: 'Engineered for Extreme Creative Velocity',
      badge: 'Next-Gen M5 Pro Architecture',
      price: '$2,899.00',
      image: '/demo-assets/ecommerce/demo-03/hero-banner.jpg',
      link: '/webapp-demo/ecommerce/demo-03/products/apexbook-ultra-16',
    },
    {
      title: 'HyperVolt 240W GaN Station',
      subtitle: 'Four Devices. High-Speed Power. Zero Clutter.',
      badge: 'Transparent Cyber Edition',
      price: '$129.00',
      image: '/demo-assets/ecommerce/demo-03/bento-power.jpg',
      link: '/webapp-demo/ecommerce/demo-03/products/hypervolt-gan-station',
    },
    {
      title: 'OmniGimbal 4K Creator Drone',
      subtitle: 'Cinematic 4K/60fps HDR in an Ultralight 249g Carbon Frame',
      badge: 'Omnidirectional Obstacle Sensing',
      price: '$849.00',
      image: '/demo-assets/ecommerce/demo-03/bento-drone.jpg',
      link: '/webapp-demo/ecommerce/demo-03/products/omnigimbal-4k-drone',
    },
  ];

  // Top Selling Tab state
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'sale'>('featured');

  const filteredTopSelling = products.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured;
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'sale') return p.isOnSale;
    return true;
  });

  const sponsoredProducts = products.filter((p) => p.isSponsored);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. HERO STAGE (3-Column Layout on Desktop) */}
      <section className="pt-4 sm:pt-6">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Left: Category Sidebar (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="h-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3 flex flex-col justify-between shadow-sm">
                <div className="space-y-0.5">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Departments
                  </div>
                  {categories.map((cat) => {
                    const Icon = iconMap[cat.iconName] || Layers;
                    return (
                      <Link
                        key={cat.id}
                        href={`/webapp-demo/ecommerce/demo-03/products?category=${cat.slug}`}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    );
                  })}
                </div>

                <div className="p-3 mt-2 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Multi-Vendor Direct</span>
                  </div>
                  <p className="text-[11px] text-blue-100 mt-1 leading-snug">
                    Over 50+ verified hardware labs selling directly without markups.
                  </p>
                </div>
              </div>
            </div>

            {/* Center: Main Promotional Carousel (Desktop 6 cols, Mobile 12 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[360px] sm:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 group bg-slate-900">
                <Image
                  src={heroSlides[currentHeroSlide].image}
                  alt={heroSlides[currentHeroSlide].title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                {/* Slide Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                  <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-md mb-2 shadow-sm">
                    {heroSlides[currentHeroSlide].badge}
                  </span>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                    {heroSlides[currentHeroSlide].title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-md line-clamp-2">
                    {heroSlides[currentHeroSlide].subtitle}
                  </p>

                  <div className="flex items-center gap-4 mt-5">
                    <Link
                      href={heroSlides[currentHeroSlide].link}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-slate-900 font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-[0.98]"
                    >
                      <span>Shop Now • {heroSlides[currentHeroSlide].price}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                  <button
                    onClick={() =>
                      setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))
                    }
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentHeroSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
                    }
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentHeroSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentHeroSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Stacked Deal Cards (Desktop 3 cols) */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
              {/* Card 1: Smartphone Deal */}
              <div className="relative h-[230px] sm:h-auto lg:h-[232px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm group bg-slate-900">
                <Image
                  src="/demo-assets/ecommerce/demo-03/deal-phone.jpg"
                  alt="Zenith Titanium X1"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Flagship 5G Camera
                  </span>
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                    Zenith Titanium X1
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <span className="text-sm font-black">$1,199.00</span>
                    <Link
                      href="/webapp-demo/ecommerce/demo-03/products/zenith-titanium-x1"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2: Smartwatch Deal */}
              <div className="relative h-[230px] sm:h-auto lg:h-[232px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm group bg-slate-900">
                <Image
                  src="/demo-assets/ecommerce/demo-03/deal-watch.jpg"
                  alt="Chrono Ultra Titanium"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    Multisport Endurance
                  </span>
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                    Chrono Ultra Titanium
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <span className="text-sm font-black">$799.00</span>
                    <Link
                      href="/webapp-demo/ecommerce/demo-03/products/chrono-ultra-titanium"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNER BRAND RIBBON */}
      <section className="border-y border-slate-100 dark:border-slate-800/80 py-5 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between flex-wrap gap-6 text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-black tracking-widest uppercase">
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">AEROTECH</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">CYBERFORGE</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">VOLTSTREAM</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">AUDIOCRAFT</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">QUANTUM</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">SYNAPSE</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">NOVA LABS</span>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORIES (CIRCULAR HARDWARE CAPSULES) */}
      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                Shop by <span className="text-blue-600 dark:text-blue-400">Categories</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore engineering excellence across all hardware sectors
              </p>
            </div>
            <Link
              href="/webapp-demo/ecommerce/demo-03/products"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/webapp-demo/ecommerce/demo-03/products?category=${cat.slug}`}
                className="group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2.5 bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:scale-105 transition-all">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat.itemCount} items
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EDITORIAL BENTO SHOWCASE (5-CELL ASYMMETRIC GRID) */}
      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            {/* Bento 1: Tall Vertical Spotlight (Col 1-4) */}
            <div className="md:col-span-4 relative h-[360px] md:h-[460px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm group bg-slate-900">
              <Image
                src="/demo-assets/ecommerce/demo-03/deal-phone.jpg"
                alt="Zenith Titanium X1"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white self-start mb-2">
                  Titanium Innovation
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  Zenith X1 Pro Studio
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  200MP Sony LYT-900 periscope zoom system inside an aerospace titanium housing.
                </p>
                <div className="mt-4">
                  <Link
                    href="/webapp-demo/ecommerce/demo-03/products/zenith-titanium-x1"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-blue-50 transition-colors"
                  >
                    <span>View Flagship</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento Center Stack (Col 5-8) */}
            <div className="md:col-span-4 flex flex-col gap-4 sm:gap-5">
              {/* Bento 2: Valkyrie Gamepad */}
              <div className="relative h-[218px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm group bg-slate-900">
                <Image
                  src="/demo-assets/ecommerce/demo-03/bento-gaming.jpg"
                  alt="Valkyrie Pro Controller"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Esports Series
                  </span>
                  <h4 className="text-base font-bold">Valkyrie Hall-Effect</h4>
                  <Link
                    href="/webapp-demo/ecommerce/demo-03/products/valkyrie-pro-controller"
                    className="text-xs text-blue-400 font-semibold hover:underline mt-1 flex items-center gap-1"
                  >
                    <span>Explore Controller</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Bento 3: Soniq Headphones */}
              <div className="relative h-[218px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm group bg-slate-900">
                <Image
                  src="/demo-assets/ecommerce/demo-03/bento-audio.jpg"
                  alt="Soniq Studio ANC"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Spatial Fidelity
                  </span>
                  <h4 className="text-base font-bold">Soniq Studio Pro ANC</h4>
                  <Link
                    href="/webapp-demo/ecommerce/demo-03/products/soniq-studio-anc"
                    className="text-xs text-blue-400 font-semibold hover:underline mt-1 flex items-center gap-1"
                  >
                    <span>Explore Acoustics</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento 4: Tall Vertical Right (Col 9-12) */}
            <div className="md:col-span-4 relative h-[360px] md:h-[460px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm group bg-slate-900">
              <Image
                src="/demo-assets/ecommerce/demo-03/bento-power.jpg"
                alt="HyperVolt GaN"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white self-start mb-2">
                  GaN III Power Architecture
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  HyperVolt 240W Station
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  Real-time live OLED wattage monitoring and dual 140W PD 3.1 ultra-fast laptop charging.
                </p>
                <div className="mt-4">
                  <Link
                    href="/webapp-demo/ecommerce/demo-03/products/hypervolt-gan-station"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-blue-50 transition-colors"
                  >
                    <span>Shop GaN Power</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP SELLING PRODUCTS (WITH TABBED FILTERING) */}
      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                Top <span className="text-blue-600 dark:text-blue-400">Selling</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Most popular hardware verified by engineering benchmark ratings
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'featured'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'new'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('sale')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'sale'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                On Sale
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredTopSelling.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. SPONSORED HARDWARE CAROUSEL */}
      {sponsoredProducts.length > 0 && (
        <section className="bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800 py-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                  Sponsored <span className="text-blue-600 dark:text-blue-400">Showcase</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Featured lab prototypes and verified merchant launches
                </p>
              </div>
              <Link
                href="/webapp-demo/ecommerce/demo-03/products"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {sponsoredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. TOP VENDORS SHOWCASE */}
      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                Top <span className="text-blue-600 dark:text-blue-400">Vendors</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified hardware studios meeting our rigorous 99.5% fulfillment SLA
              </p>
            </div>
            <Link
              href="/webapp-demo/ecommerce/demo-03/vendors"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              All Vendors ({vendors.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner & Avatar */}
                <div className="relative h-28 w-full bg-slate-800">
                  <Image
                    src={vendor.banner}
                    alt={vendor.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute -bottom-5 left-5 w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-900 overflow-hidden shadow-md bg-white">
                    <Image
                      src={vendor.logo}
                      alt={vendor.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 pt-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {vendor.name}
                      </h3>
                      {vendor.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {vendor.bio}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-100 dark:border-slate-800 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{vendor.rating}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">Rating</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {vendor.salesCount}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">Orders</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {vendor.priceCategory}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">Tier</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/webapp-demo/ecommerce/demo-03/products?vendor=${vendor.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                  >
                    <span>Visit Lab Store</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VENDOR RECRUITMENT BANNER */}
      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md text-cyan-300">
                Marketplace Supply Network
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Launch Your Hardware Brand on Kinetic Gear
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Connect with passionate tech creators and verified enterprise buyers. Access automated multi-currency checkout, fraud prevention, and regional fulfillment hubs.
              </p>
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/webapp-demo/ecommerce/demo-03/vendors#sell"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-slate-900 font-extrabold text-xs sm:text-sm shadow-lg transition-all active:scale-[0.98]"
                >
                  Apply as a Verified Vendor
                </Link>
                <Link
                  href="/webapp-demo/ecommerce/demo-03/contact"
                  className="px-5 py-3 rounded-xl border border-white/20 hover:border-white text-white font-semibold text-xs sm:text-sm transition-colors"
                >
                  Merchant Guidelines
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TECH JOURNAL & BUYING GUIDES ("TOP ARTICLES") */}
      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                Tech <span className="text-blue-600 dark:text-blue-400">Journal</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deep-dive teardowns, ergonomics research, and hardware buying advice
              </p>
            </div>
            <Link
              href="/webapp-demo/ecommerce/demo-03/blog"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              All Articles ({articles.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {articles.map((art) => (
              <article
                key={art.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                    <Image
                      src={art.coverImage}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 text-white backdrop-blur-md">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-2 text-xs">
                  <span className="text-[11px] text-slate-400">{art.date}</span>
                  <Link
                    href="/webapp-demo/ecommerce/demo-03/blog"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
