'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '../_context/StoreContext';
import { ProductCard } from '../_components/ProductCard';
import {
  Flame,
  Star,
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';

const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function StorefrontHomePage() {
  const { products, categories, reviews, banners } = useStore();

  const activeBanners = banners.filter((b) => b.isActive);
  const heroBanner = activeBanners[0];

  const bestSellers = products
    .filter((p) => p.status === 'active' && (p.badge === 'Best Seller' || p.isFeatured))
    .slice(0, 8);

  const carProducts = products
    .filter((p) => p.status === 'active' && p.category === 'car-glass-poster')
    .slice(0, 4);

  const animeProducts = products
    .filter((p) => p.status === 'active' && p.category === 'anime-glass-poster')
    .slice(0, 4);

  const visibleReviews = reviews.filter((r) => r.isVisible);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Banner Section */}
      <section className="relative bg-[#0A0B0E] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Ultra-Reflective Glass Wall Art</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Transform Your Walls With{' '}
                <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  Luminous Tempered Glass
                </span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {heroBanner?.description ||
                  'Museum-grade optical clarity, diamond-cut 4mm safety glass, and vibrant UV sublimation. Designed for architectural homes, luxury gaming rooms, and executive suites.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href={`${baseHref}/products`}
                  className="px-6 py-3.5 bg-white hover:bg-zinc-100 text-black text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-white/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore All Glass Posters</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`${baseHref}/products?badge=Best+Seller`}
                  className="px-6 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
                  <span>Best Sellers</span>
                </Link>
              </div>

              {/* Bullet Features */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  4mm Shatter-Proof Glass
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Free 3M Wall Mounts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Transit Replacement Guarantee
                </span>
              </div>
            </div>

            {/* Right Hero Visual Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-700/60 shadow-2xl shadow-rose-950/20 bg-zinc-900 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroBanner?.image || '/demo-assets/ecommerce/demo-02/hero-banner.jpg'}
                  alt="AuraGlass living room showcase"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="bg-black/80 px-3 py-1 rounded-full backdrop-blur-md font-mono text-[11px] border border-white/10">
                    AuraGlass Studio • Living Room Suite
                  </span>
                  <Link
                    href={`${baseHref}/products/red-bull-racing-glass-poster`}
                    className="bg-white text-black font-bold px-3 py-1 rounded-full text-[11px] hover:bg-zinc-200 transition-colors shadow-md"
                  >
                    View Featured Piece →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Category Icons / Quick Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900">Featured Categories</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Explore by genre, style and room aesthetic</p>
          </div>
          <Link
            href={`${baseHref}/products`}
            className="text-xs font-semibold text-zinc-700 hover:text-black flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${baseHref}/categories/${cat.slug}`}
              className="group flex flex-col items-center bg-white p-3 rounded-2xl border border-zinc-200/80 hover:border-zinc-400 hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-zinc-100 mb-2.5 border border-zinc-200 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="font-bold text-xs text-zinc-800 group-hover:text-black line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium mt-0.5">
                {cat.productCount} Designs
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Top Selling Products Grid (Matching Reference A 8-card grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-rose-200">
              <Flame className="w-3 h-3 fill-rose-500" />
              Most Popular
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              Best Selling Glass Art
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Reflective centerpiece statements rated 5.0 stars by collectors across Bangladesh.
            </p>
          </div>

          <Link
            href={`${baseHref}/products`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline shrink-0"
          >
            <span>Browse Full Catalogue ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} baseHref={baseHref} />
          ))}
        </div>

        {/* Centered View More Button matching Reference A */}
        <div className="mt-8 text-center">
          <Link
            href={`${baseHref}/products`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-full transition-all shadow-md cursor-pointer"
          >
            <span>View More Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Craftsmanship & Glass Specification Showcase (Matching Reference A middle block) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-zinc-50 rounded-3xl border border-zinc-200 p-6 sm:p-10 lg:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-zinc-300/80 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/demo-assets/ecommerce/demo-02/spec-glass-feature.jpg"
                  alt="4mm Tempered Glass Edge Detail"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-black text-white p-3 rounded-2xl shadow-xl text-center border border-zinc-700">
                <span className="block text-xl font-extrabold leading-none text-amber-400">4mm</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Diamond Cut</span>
              </div>
            </div>

            {/* Specifications list */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/80 text-zinc-800 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
                The AuraGlass Standard
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight">
                Not a Paper Poster. <br className="hidden sm:inline" />
                <span className="text-zinc-500 font-bold">A Gallery-Grade Glass Statement.</span>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Traditional paper and cardboard prints wrinkle, fade under sunlight, and demand expensive heavy frames. AuraGlass prints directly behind 4mm tempered safety glass for luminous optical depth that catches daylight and evening lighting effortlessly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                  <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Ultra HD UV Pigment
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1">Multi-layer ink cured at microscopic resolution for vibrant saturation.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                  <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    100% Water & Dust Proof
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1">Wipe clean with any glass cleaner or microfiber towel without color damage.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                  <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    No Drills Required
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1">Every poster includes 3M Command™ damage-free adhesive wall hanging strips.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                  <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Safe Crate Delivery
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1">Reinforced wooden-frame packaging across all 64 districts in Bangladesh.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dark Curated Highlights Strip (Matching Reference A dark strip) */}
      <section className="bg-[#0A0B0E] py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-400">
              Curated Collections
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Select Your Signature Aesthetic
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={`${baseHref}/categories/car-glass-poster`}
              className="group p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-850"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/demo-assets/ecommerce/demo-02/poster-porsche-gt3.jpg"
                  alt="Car Glass Poster"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                Car & Motorsport
              </h3>
              <p className="text-xs text-zinc-400 mt-1">F1, Porsche, JDM Godzilla & Supercars</p>
            </Link>

            <Link
              href={`${baseHref}/categories/anime-glass-poster`}
              className="group p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-850"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/demo-assets/ecommerce/demo-02/poster-anime-cyberpunk.jpg"
                  alt="Anime Glass Poster"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                Anime & Cyberpunk
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Neon hues, Gojo, Solo Leveling & Tokyo</p>
            </Link>

            <Link
              href={`${baseHref}/categories/motivational-glass-poster`}
              className="group p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-850"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/demo-assets/ecommerce/demo-02/poster-wallstreet-bull.jpg"
                  alt="Motivational Glass Poster"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                Motivational & Wall St
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Gold Geometric Bull, Ambition & Hustle</p>
            </Link>

            <Link
              href={`${baseHref}/categories/split-poster`}
              className="group p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-850"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/demo-assets/ecommerce/demo-02/poster-split-triptych.jpg"
                  alt="Split Poster Triptych"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                3-Piece Split Triptych
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Expansive panoramic continuous glass sets</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Car & Motorsport Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900">Car & Motorsport Glass Art</h2>
            <p className="text-xs text-zinc-500 mt-0.5">High-octane automotive legends on glass</p>
          </div>
          <Link
            href={`${baseHref}/categories/car-glass-poster`}
            className="text-xs font-bold text-black hover:underline flex items-center gap-1"
          >
            <span>View All Cars</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {carProducts.map((p) => (
            <ProductCard key={p.id} product={p} baseHref={baseHref} />
          ))}
        </div>
      </section>

      {/* 7. Anime & Cyberpunk Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900">Anime & Cyberpunk Glass Posters</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Vibrant ultraviolet optical depth for gaming setups</p>
          </div>
          <Link
            href={`${baseHref}/categories/anime-glass-poster`}
            className="text-xs font-bold text-black hover:underline flex items-center gap-1"
          >
            <span>View All Anime</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {animeProducts.map((p) => (
            <ProductCard key={p.id} product={p} baseHref={baseHref} />
          ))}
        </div>
      </section>

      {/* 8. Customer Testimonials Section */}
      <section id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-amber-200">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Verified Buyer Reviews
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
            Loved in 12,000+ Homes Across Bangladesh
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Real feedback from verified collectors who mounted AuraGlass in their living rooms, bedrooms, and creative studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed italic mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-zinc-900">{rev.customerName}</h5>
                  <p className="text-[10px] text-zinc-400">{rev.location || 'Dhaka'}</p>
                </div>
                {rev.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Custom Orders / WhatsApp Help Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-800">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
              Custom Glass Printing
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Want Your Own Photography or Artwork on Glass?
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              We produce custom high-definition glass posters for family portraits, bespoke digital art, corporate branding, and architectural installations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/8801792884422?text=Hi%20AuraGlass,%20I%20want%20to%20order%20a%20custom%20glass%20poster"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp</span>
            </a>
            <Link
              href={`${baseHref}/products`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-colors border border-zinc-700"
            >
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
