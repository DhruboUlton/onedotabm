'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../_context/StoreContext';
import { ProductCard } from '../../../_components/ProductCard';
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  Maximize2,
  X,
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, addToCart, showToast } = useStore();

  const product = products.find(
    (p) => p.slug === resolvedParams.slug || p.id === resolvedParams.slug
  );

  // Variant Selection State (Strict Rule: requires explicit selection or tracking)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Accordion open/collapse states
  const [openAccordion, setOpenAccordion] = useState<'overview' | 'specs' | 'faq' | null>('specs');

  if (!product) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Hardware Listing Not Found</h1>
        <p className="text-slate-500 text-sm">
          The requested hardware item could not be retrieved from the active catalog.
        </p>
        <Link
          href="/webapp-demo/ecommerce/demo-03/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || null;
  const isVariantSelected = Boolean(selectedVariantId);

  // Displayed image prioritizes selected variant, then active gallery index
  const activeImage = selectedVariant?.image || product.galleryImages[activeImageIndex] || product.primaryImage;
  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentCompareAt = selectedVariant?.compareAtPrice || product.compareAtPrice;

  // Add to Cart
  const handleAddToCart = () => {
    if (!isVariantSelected || !selectedVariant) {
      showToast('Selection Required', 'Please select a color finish before adding to cart.', 'warning');
      return;
    }
    addToCart(product, selectedVariant, qty);
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!isVariantSelected || !selectedVariant) {
      showToast('Selection Required', 'Please select a color finish before proceeding.', 'warning');
      return;
    }
    addToCart(product, selectedVariant, qty);
    router.push('/webapp-demo/ecommerce/demo-03/checkout');
  };

  // Share Link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Hardware link copied to your clipboard.', 'info');
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-10 space-y-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/webapp-demo/ecommerce/demo-03" className="hover:text-slate-600 dark:hover:text-slate-300">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/webapp-demo/ecommerce/demo-03/products" className="hover:text-slate-600 dark:hover:text-slate-300">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/webapp-demo/ecommerce/demo-03/products?category=${product.category}`}
          className="hover:text-slate-600 dark:hover:text-slate-300 capitalize"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* 2. Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Media Gallery (Col 1-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-slate-100 dark:bg-slate-900 overflow-hidden group shadow-md">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
              {product.badge && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Fullscreen / Lightbox Trigger */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md backdrop-blur-md hover:bg-blue-600 hover:text-white transition-colors"
              title="Expand View"
              aria-label="Expand View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setSelectedVariantId(null);
                  }}
                  className={`relative w-20 h-20 rounded-2xl bg-[#F4F6F8] dark:bg-slate-900 p-2 shrink-0 border-2 overflow-hidden transition-all ${
                    activeImageIndex === idx && !selectedVariant
                      ? 'border-blue-600 scale-105 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Preview ${idx + 1}`} fill sizes="80px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Technical Details & Purchase Form (Col 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {product.brand}
              </span>
              <span className="flex items-center gap-1 font-medium">
                Verified Vendor: <strong className="text-slate-700 dark:text-slate-300">{product.vendorName}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              {product.title}
            </h1>

            {/* Ratings & Social Share */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-50">
              ${currentPrice.toFixed(2)}
            </span>
            {currentCompareAt && (
              <span className="text-base text-slate-400 line-through">
                ${currentCompareAt.toFixed(2)}
              </span>
            )}
            <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              In Stock ({product.stock} units)
            </span>
          </div>

          {/* CRITICAL VARIANT GUARDRAIL SELECTOR */}
          <div className="space-y-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Select Finish / Configuration
              </label>
              {isVariantSelected ? (
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {selectedVariant?.name}
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Selection Required</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {product.variants.map((v) => {
                const isSelected = selectedVariantId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/50 ring-2 ring-blue-600/30 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span className="text-xs truncate">{v.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Validation Notice when Unselected */}
            {!isVariantSelected && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                * Please choose your preferred color option above to activate the cart controls.
              </p>
            )}
          </div>

          {/* Quantity & Purchase Buttons */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-800 dark:text-slate-200 min-w-10 text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((prev) => prev + 1)}
                  className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button (Disabled until variant selected!) */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isVariantSelected}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.98] ${
                  isVariantSelected
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isVariantSelected ? 'Add to Cart' : 'Select a Finish'}</span>
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!isVariantSelected}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                isVariantSelected
                  ? 'bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 cursor-pointer shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed'
              }`}
            >
              Instant Express Checkout
            </button>
          </div>

          {/* Trust Guarantees Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Standard delivery in 2-4 business days. Free over $50.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30-day money-back guarantee in original packaging.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Full 2-Year hardware warranty backed by verified vendor SLA.</span>
            </div>
          </div>

          {/* Technical Accordions */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            {/* 1. Overview */}
            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'overview' ? null : 'overview')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 dark:text-slate-200 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span>Engineering Highlights</span>
                <span>{openAccordion === 'overview' ? '−' : '+'}</span>
              </button>
              {openAccordion === 'overview' && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-4 space-y-1 pt-1 text-slate-700 dark:text-slate-300">
                    {product.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Specs Table */}
            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 dark:text-slate-200 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span>Full Technical Specifications</span>
                <span>{openAccordion === 'specs' ? '−' : '+'}</span>
              </button>
              {openAccordion === 'specs' && (
                <div className="p-4 pt-0">
                  <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="py-2 flex justify-between gap-4">
                        <dt className="text-slate-500 font-medium">{key}</dt>
                        <dd className="font-semibold text-slate-800 dark:text-slate-200 text-right">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* 3. FAQ */}
            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'faq' ? null : 'faq')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 dark:text-slate-200 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span>Shipping & Authenticity FAQ</span>
                <span>{openAccordion === 'faq' ? '−' : '+'}</span>
              </button>
              {openAccordion === 'faq' && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                  <p>
                    <strong>Q: Is this authentic hardware?</strong>
                    <br />
                    A: Every unit is shipped directly from verified vendor laboratories and undergoes serial inspection before dispatch.
                  </p>
                  <p>
                    <strong>Q: What happens if I require warranty service?</strong>
                    <br />
                    A: Kinetic Gear guarantees 48-hour RMA ticket resolution with prepaid return postage.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Related Hardware Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Related Hardware in <span className="text-blue-600 capitalize">{product.category}</span>
            </h2>
            <p className="text-xs text-slate-500">Complementary equipment tested for full compatibility</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl aspect-square max-h-[80vh]">
            <Image src={activeImage} alt={product.title} fill className="object-contain p-6" />
          </div>
        </div>
      )}
    </div>
  );
}
