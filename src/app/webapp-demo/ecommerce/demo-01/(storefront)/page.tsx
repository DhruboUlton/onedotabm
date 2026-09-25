'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  Droplet,
  Flame,
  Sun,
  Leaf,
  Coffee,
  Wheat,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';
import { ProductCard } from '../_components/ProductCard';

const baseHref = '/webapp-demo/ecommerce/demo-01';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplet,
  Flame,
  Sun,
  Sparkles,
  Leaf,
  Coffee,
  Wheat,
};

export default function StorefrontHomePage() {
  const { products, categories, banners, reviews } = useStore();

  // Active products only
  const activeProducts = products.filter((p) => p.status === 'active');

  // Top selling products (first 4)
  const topSelling = activeProducts.filter((p) => p.isTopSelling).slice(0, 4);
  const topSellingFallback = topSelling.length >= 4 ? topSelling : activeProducts.slice(0, 4);

  // Category specific slices
  const gheeAndOil = activeProducts.filter((p) => p.category === 'oil-and-ghee');
  const dates = activeProducts.filter((p) => p.category === 'dates');
  const spices = activeProducts.filter((p) => p.category === 'spices');
  const nutsAndSeeds = activeProducts.filter((p) => p.category === 'nuts-and-seeds');

  // Visible reviews
  const visibleReviews = reviews.filter((r) => r.isVisible);

  // Main hero banners
  const heroMain = banners.find((b) => b.type === 'hero_main' && b.isActive) || banners[0];
  const heroSecondary = banners.find((b) => b.type === 'hero_secondary' && b.isActive) || banners[1];
  const midBanner = banners.find((b) => b.type === 'mid_promo' && b.isActive) || banners[2];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. HERO BANNERS (Matching Screenshot 1 Split Banners) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main Hero Banner (Span 2) */}
          <div className="relative overflow-hidden rounded-3xl bg-[#072D24] text-white shadow-xl lg:col-span-2 group min-h-[340px] sm:min-h-[420px] flex items-end">
            <img
              src={heroMain?.image || '/demo-assets/ecommerce/hero-banner.jpg'}
              alt={heroMain?.title || 'Shuddha Harvest Hero'}
              className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E87121] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>প্রাকৃতিক ও অর্গানিক</span>
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {heroMain?.bengaliTitle || '১০০% খাঁটি ও অর্গানিক খাদ্যপণ্য সরাসরি খামার থেকে'}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-zinc-200 line-clamp-2">
                {heroMain?.description ||
                  'খাঁটি গাওয়া ঘি, সুন্দরবনের প্রাকৃতিক মধু ও ঘানিভাঙ্গা সরিষার তেলে সমৃদ্ধ ঐতিহ্যবাহী সুস্থ জীবনের নিশ্চয়তা।'}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`${baseHref}/products`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E87121] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#D46013] transition-all active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{heroMain?.ctaText || 'অর্ডার করুন এখনই'}</span>
                </Link>

                <Link
                  href={`${baseHref}/products/gawa-ghee-1kg`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-md px-4 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/30 transition-all"
                >
                  <span>গাওয়া ঘি দেখুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Hero Banner (Span 1) */}
          <div className="relative overflow-hidden rounded-3xl bg-[#072D24] text-white shadow-xl group min-h-[300px] sm:min-h-[420px] flex items-end">
            <img
              src={heroSecondary?.image || '/demo-assets/ecommerce/mid-banner.jpg'}
              alt={heroSecondary?.title || 'Special Combo Offer'}
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8">
              <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm mb-2">
                Special Offer
              </span>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {heroSecondary?.bengaliTitle || 'ঘি ও মধুর বিশেষ অফার প্যাক'}
              </h2>

              <p className="mt-1.5 text-xs text-zinc-300 line-clamp-2">
                {heroSecondary?.description ||
                  'ঐতিহ্যবাহী বিলোনা পদ্ধতিতে প্রস্তুত সুগন্ধি গাওয়া ঘি এবং প্রাকৃতিক মধু।'}
              </p>

              <div className="mt-4">
                <Link
                  href={`${baseHref}/products/gawa-ghee-1kg`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#072D24] shadow-md hover:bg-zinc-100 transition-all active:scale-95"
                >
                  <span>{heroSecondary?.ctaText || 'কম্বো দেখুন'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES (Matching Screenshot 1 icon cards) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2923] tracking-tight">
            Featured Categories
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Browse our carefully sourced pure food categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories
            .filter((c) => c.isActive)
            .map((cat) => {
              const IconComp = categoryIcons[cat.iconName] || Sparkles;

              return (
                <Link
                  key={cat.id}
                  href={`${baseHref}/categories/${cat.slug}`}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-[#ECE6DC] bg-white p-4 text-center shadow-xs transition-all duration-300 hover:border-[#E87121] hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#072D24] group-hover:bg-[#E87121]/10 group-hover:text-[#E87121] transition-colors mb-2.5">
                    <IconComp className="h-7 w-7 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-xs font-bold text-[#1F2923] group-hover:text-[#E87121] transition-colors">
                    {cat.name}
                  </span>
                  {cat.bengaliName && (
                    <span className="text-[11px] text-zinc-400 font-normal mt-0.5">
                      {cat.bengaliName}
                    </span>
                  )}
                </Link>
              );
            })}
        </div>
      </section>

      {/* 3. TOP SELLING PRODUCTS (Matching Screenshot 1: 4 large featured cards) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E87121]">
              CUSTOMER FAVORITES
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2923] tracking-tight">
              Top Selling Products
            </h2>
          </div>
          <Link
            href={`${baseHref}/products`}
            className="flex items-center gap-1 text-xs font-bold text-[#072D24] hover:text-[#E87121] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topSellingFallback.map((product) => (
            <ProductCard key={product.id} product={product} baseHref={baseHref} />
          ))}
        </div>
      </section>

      {/* 4. OUR BRANDS STRIP (Matching Screenshot 1) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#ECE6DC] bg-white p-6 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-widest text-center text-zinc-400 mb-4">
            Our Certified Heritage Brands & Farming Cooperatives
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center opacity-85">
            <div className="font-serif text-lg font-black tracking-wider text-[#072D24] border-b-2 border-[#E87121] pb-1">
              SHUDDHA
            </div>
            <div className="font-sans text-base font-extrabold tracking-widest text-[#78716C] uppercase">
              Shosti Pure
            </div>
            <div className="font-serif text-lg font-bold tracking-tight text-[#072D24] italic">
              Gramin Farm
            </div>
            <div className="font-mono text-sm font-bold tracking-wider text-[#E87121]">
              BORNO ORGANIC
            </div>
          </div>
        </div>
      </section>

      {/* 5. CATEGORY SECTION 1: MUSTARD OIL & GHEE */}
      {gheeAndOil.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E87121]/10 text-[#E87121]">
                <Flame className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2923]">
                Mustard Oil & Ghee (তেল ও ঘি)
              </h2>
            </div>
            <Link
              href={`${baseHref}/categories/oil-and-ghee`}
              className="text-xs font-bold text-[#072D24] hover:text-[#E87121] transition-colors flex items-center gap-1"
            >
              <span>View Category</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {gheeAndOil.map((product) => (
              <ProductCard key={product.id} product={product} baseHref={baseHref} />
            ))}
          </div>
        </section>
      )}

      {/* 6. CATEGORY SECTION 2: PREMIUM DATES */}
      {dates.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <Sun className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2923]">
                Premium Dates (আমদানিকৃত খেজুর)
              </h2>
            </div>
            <Link
              href={`${baseHref}/categories/dates`}
              className="text-xs font-bold text-[#072D24] hover:text-[#E87121] transition-colors flex items-center gap-1"
            >
              <span>View Category</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dates.map((product) => (
              <ProductCard key={product.id} product={product} baseHref={baseHref} />
            ))}
          </div>
        </section>
      )}

      {/* 7. LARGE MID-PAGE MERCHANDISING BANNER (Matching Screenshot 1) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#072D24] text-white shadow-xl min-h-[300px] sm:min-h-[380px] flex items-center">
          <img
            src={midBanner?.image || '/demo-assets/ecommerce/mid-banner.jpg'}
            alt="Pantry Collection"
            className="absolute inset-0 h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E87121] px-3 py-1 text-xs font-bold text-white shadow-sm mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ল্যাব টেস্টে শতভাগ খাঁটি</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {midBanner?.bengaliTitle || '১০০% খাঁটি ও প্রাকৃতিক উপাদানে তৈরি খাদ্যপণ্য'}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-zinc-200">
              {midBanner?.description ||
                'প্রাকৃতিক ও ভেজালমুক্ত রসুইঘরের বিশ্বস্ত সঙ্গী। স্বাস্থ্যকর জীবনের সেরা উপহার।'}
            </p>

            <div className="mt-6">
              <Link
                href={`${baseHref}/products`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-[#072D24] shadow-md hover:bg-zinc-100 transition-all active:scale-95"
              >
                <span>{midBanner?.ctaText || 'কালেকশন এক্সপ্লোর করুন'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CATEGORY SECTION 3: COOKING ESSENTIALS & SPICES */}
      {spices.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2923]">
                Cooking Essentials & Spices (খাঁটি মশলা)
              </h2>
            </div>
            <Link
              href={`${baseHref}/categories/spices`}
              className="text-xs font-bold text-[#072D24] hover:text-[#E87121] transition-colors flex items-center gap-1"
            >
              <span>View Category</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {spices.map((product) => (
              <ProductCard key={product.id} product={product} baseHref={baseHref} />
            ))}
          </div>
        </section>
      )}

      {/* 9. CATEGORY SECTION 4: NUTS & SEEDS */}
      {nutsAndSeeds.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                <Leaf className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2923]">
                Organic Nutrition & Seeds (বাদাম ও বীজ)
              </h2>
            </div>
            <Link
              href={`${baseHref}/categories/nuts-and-seeds`}
              className="text-xs font-bold text-[#072D24] hover:text-[#E87121] transition-colors flex items-center gap-1"
            >
              <span>View Category</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {nutsAndSeeds.map((product) => (
              <ProductCard key={product.id} product={product} baseHref={baseHref} />
            ))}
          </div>
        </section>
      )}

      {/* 10. CUSTOMER TESTIMONIALS / REVIEWS (Matching Screenshot 1) */}
      {visibleReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E87121]">
              VERIFIED REVIEWS
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2923] tracking-tight">
              গ্রাহকদের সন্তুষ্টি ও মতামত
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              আমাদের খাঁটি পণ্যের নিয়মিত গ্রাহকদের বাস্তব অনুভূতি
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleReviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="flex flex-col justify-between rounded-2xl border border-[#ECE6DC] bg-white p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'fill-current' : 'text-zinc-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-[#F0ECE4] pt-4">
                  <img
                    src={
                      review.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
                    }
                    alt={review.customerName}
                    className="h-10 w-10 rounded-full object-cover border border-[#ECE6DC]"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-[#1F2923] flex items-center gap-1">
                      <span>{review.customerName}</span>
                      {review.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </h3>
                    <p className="text-[10px] text-zinc-400">
                      Verified Buyer • {review.productName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
