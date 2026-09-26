'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Scale,
  Share2,
  HelpCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Send,
} from 'lucide-react';
import { useStore } from '../../../_context/StoreContext';
import { StoreHeader } from '../../../_components/StoreHeader';
import { StoreFooter } from '../../../_components/StoreFooter';
import { ProductCard } from '../../../_components/ProductCard';
import { CartDrawer } from '../../../_components/CartDrawer';
import { QuickAddModal } from '../../../_components/QuickAddModal';
import { EnquiryModal } from '../../../_components/EnquiryModal';
import { SearchModal } from '../../../_components/SearchModal';
import { PromoPopup } from '../../../_components/PromoPopup';
import { BreadcrumbBanner } from '../../../_components/BreadcrumbBanner';
import { ProductVariant } from '../../../_types';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {
    products,
    reviews,
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    openEnquiry,
    openCart,
    addReview,
    addToast,
  } = useStore();

  const product = products.find((p) => p.slug === slug);
  const base = '/webapp-demo/ecommerce/demo-04';

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');
  const [searchOpen, setSearchOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Review Form State
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (product) {
      setActiveImage(product.primaryImage);
      setSelectedVariant(product.variants[0] || null);
    }
  }, [product]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Monitor scroll for Sticky Bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 480);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return notFound();
  }

  const currentVariant =
    selectedVariant ||
    product.variants[0] || {
      id: 'default',
      name: 'Standard',
      sku: 'DEF',
      price: product.basePrice,
      inventory: product.stock,
    };

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  const productReviews = reviews.filter((r) => r.productId === product.id && r.isVisible);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.status === 'Active')
    .slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewContent) return;
    addReview({
      productId: product.id,
      productTitle: product.title,
      author: newReviewAuthor,
      rating: newReviewRating,
      title: newReviewTitle || 'Wonderful Educational Toy',
      content: newReviewContent,
      isVerified: true,
      isVisible: true,
    });
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewContent('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      addToast('success', 'Link Copied', 'Product link copied to clipboard.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <StoreHeader onOpenSearch={() => setSearchOpen(true)} />

      {/* Breadcrumb Banner */}
      <BreadcrumbBanner
        title={product.title}
        breadcrumbs={[
          { label: 'Products', href: `${base}/collection` },
          { label: product.category, href: `${base}/collection?category=${encodeURIComponent(product.category)}` },
          { label: product.title },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 w-full">
        {/* ============================================================== */}
        {/* MAIN PRODUCT ROW                                               */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Gallery (6 Cols) */}
          <div className="lg:col-span-6 space-y-4 sticky top-24">
            {/* Primary Main Image */}
            <div className="relative aspect-square w-full rounded-3xl bg-[#FFEFE4]/50 overflow-hidden border-2 border-slate-100 shadow-sm group">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-white bg-[#EB1551] shadow-md">
                    {product.badge}
                  </span>
                </div>
              )}
              <Image
                src={activeImage || product.primaryImage}
                alt={product.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === img
                      ? 'border-[#0A6375] shadow-md scale-105'
                      : 'border-slate-200 hover:border-[#1CBBB4]'
                  }`}
                >
                  <Image src={img} alt={`${product.title} thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Buy Box & Options (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Title & Category */}
            <div>
              <span className="text-xs font-extrabold text-[#1CBBB4] uppercase tracking-wider block mb-1">
                {product.category} • {product.ageRange}
              </span>
              <h1 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A] leading-tight">
                {product.title}
              </h1>

              {/* Rating stars */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex text-[#EB1551]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#6B6B84]">
                  {product.rating.toFixed(1)} ({productReviews.length} customer reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-[#008000] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Tested Non-Toxic
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-[#FFEFE4]/60 border border-[#F7941E]/20 flex items-baseline gap-3">
              <span className="font-extrabold text-3xl text-[#0F172A]">
                ${currentVariant.price.toFixed(2)}
              </span>
              {currentVariant.compareAtPrice && (
                <span className="text-base text-[#F7941E] line-through font-bold">
                  ${currentVariant.compareAtPrice.toFixed(2)}
                </span>
              )}
              {currentVariant.compareAtPrice && (
                <span className="ml-auto text-xs font-black uppercase text-[#EB1551] bg-white px-2.5 py-1 rounded-md shadow-sm">
                  Save ${(currentVariant.compareAtPrice - currentVariant.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-[#6B6B84] leading-relaxed font-nunito">
              {product.shortDescription}
            </p>

            {/* Selectable Product Options */}
            {product.variants.length > 1 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                  <span>Select Edition / Age Group:</span>
                  <span className="text-[#1CBBB4]">{currentVariant.name}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-xs font-bold rounded-2xl border-2 transition-all ${
                        currentVariant.id === v.id
                          ? 'border-[#0A6375] bg-[#0A6375] text-white shadow-md'
                          : 'border-slate-200 text-[#0F172A] hover:border-[#1CBBB4] bg-white'
                      }`}
                    >
                      {v.name} • ${v.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-[#6B6B84]">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-[#008000] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#008000] inline-block animate-pulse" />
                  In Stock ({product.stock} units available)
                </span>
              ) : (
                <span className="text-[#EB1551] font-bold">Out of Stock</span>
              )}
            </div>

            {/* Quantity Stepper & Buy Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center justify-between border-2 border-slate-200 rounded-full overflow-hidden bg-slate-50 w-full sm:w-36 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-slate-600 hover:bg-[#EB1551] hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-extrabold text-[#0F172A]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-slate-600 hover:bg-[#1CBBB4] hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product, currentVariant, quantity)}
                  className="flex-1 ws-btn-primary py-3.5 text-xs sm:text-sm uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Buy It Now */}
                <button
                  onClick={() => {
                    addToCart(product, currentVariant, quantity);
                    openCart();
                  }}
                  className="flex-1 bg-[#0A6375] hover:bg-[#064e5b] text-white py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <span>Buy It Now</span>
                </button>
              </div>
            </div>

            {/* Social & Enquire Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-bold border-y border-slate-100 py-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isWishlisted ? 'text-[#EB1551]' : 'text-[#6B6B84] hover:text-[#EB1551]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isCompared ? 'text-[#0A6375]' : 'text-[#6B6B84] hover:text-[#0A6375]'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{isCompared ? 'Compared' : 'Compare'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-[#6B6B84] hover:text-[#0F172A] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              <button
                onClick={() => openEnquiry(product.title)}
                className="text-[#EB1551] hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Enquire For Schools</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2.5 pt-2 text-xs text-[#6B6B84]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#1CBBB4] shrink-0" />
                <span>
                  <strong>Free Fast Delivery:</strong> Estimated arrival in 2–4 business days.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#F7941E] shrink-0" />
                <span>
                  <strong>Hassle-Free Returns:</strong> 30-day money back happiness guarantee.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#EB1551] shrink-0" />
                <span>
                  <strong>Certified Safety:</strong> ASTM F963 & EN71 compliant, BPA and lead free.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INFORMATION TABS                                               */}
        {/* ============================================================== */}
        <section className="mt-16 sm:mt-24 pt-10 border-t border-slate-100">
          <div className="flex items-center justify-center gap-3 sm:gap-6 border-b border-slate-200 pb-4">
            {(['description', 'shipping', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-bubblegum text-xl sm:text-2xl transition-all pb-2 relative capitalize ${
                  activeTab === tab
                    ? 'text-[#EB1551] font-bold'
                    : 'text-[#6B6B84] hover:text-[#0F172A]'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${productReviews.length})` : tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#EB1551] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-4xl mx-auto">
            {activeTab === 'description' && (
              <div className="space-y-6 font-nunito text-sm sm:text-base text-[#6B6B84] leading-relaxed">
                <p>{product.description}</p>
                <div className="bg-[#FFEFE4] p-6 rounded-3xl border border-[#F7941E]/20 space-y-3">
                  <h4 className="font-bubblegum text-2xl text-[#0A6375]">
                    Key Pedagogic Benefits
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#0F172A] font-bold">
                    {product.educationalBenefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#1CBBB4]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider mb-2">
                    Product Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-[#6B6B84] block">{key}</span>
                        <strong className="text-[#0F172A]">{val}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 font-nunito text-sm text-[#6B6B84] leading-relaxed">
                <h4 className="font-bubblegum text-2xl text-[#0A6375]">
                  Shipping Policies & Classroom Deliveries
                </h4>
                <p>
                  All WonderSprout learning materials ship from our Austin, Texas distribution atelier. Orders placed before 1:00 PM CST ship same-day via carbon-neutral postal partners.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Standard Ground Delivery (3–5 business days): FREE for orders over $50.</li>
                  <li>Express Expedited (1–2 business days): $9.99 flat rate.</li>
                  <li>School and Daycare Pallet Freight: Handled with dedicated white-glove liftgate service.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Customer Reviews List */}
                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <p className="text-center text-sm text-[#6B6B84] py-8">
                      No reviews yet. Be the first parent or educator to review!
                    </p>
                  ) : (
                    productReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0F172A]">{rev.author}</span>
                            {rev.isVerified && (
                              <span className="text-[10px] bg-[#008000]/10 text-[#008000] font-bold px-2 py-0.5 rounded-full">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#6B6B84]">{rev.date}</span>
                        </div>
                        <div className="flex text-[#EB1551]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <h5 className="font-bold text-sm text-[#0F172A]">{rev.title}</h5>
                        <p className="text-xs text-[#6B6B84] leading-relaxed font-nunito">
                          {rev.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Write a Review Form */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-[#FFEFE4]/60 p-6 rounded-3xl border border-[#F7941E]/20 space-y-4"
                >
                  <h4 className="font-bubblegum text-2xl text-[#0A6375]">
                    Share Your Experience
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rachel Adams"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">Rating</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                      >
                        <option value={5}>5 Stars - Excellent</option>
                        <option value={4}>4 Stars - Great</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Below Expectations</option>
                        <option value={1}>1 Star - Poor</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Review Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Remarkable quality and durability"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Review Comments</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="How has your child engaged with this toy?"
                      value={newReviewContent}
                      onChange={(e) => setNewReviewContent(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="ws-btn-primary px-6 py-3 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* RELATED PRODUCTS                                               */}
        {/* ============================================================== */}
        <section className="mt-16 pt-10 border-t border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bubblegum text-3xl sm:text-4xl text-[#0F172A]">
              Recommended Learning Toys
            </h3>
            <Link
              href={`${base}/collection`}
              className="text-xs font-bold text-[#0A6375] hover:text-[#EB1551] flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Add-to-Cart Bar (Floats on scroll) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 shadow-2xl transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-[#FFEFE4] overflow-hidden shrink-0 border border-slate-200">
                <Image src={product.primaryImage} alt={product.title} fill className="object-cover" />
              </div>
              <div className="hidden sm:block">
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] line-clamp-1">
                  {product.title}
                </h4>
                <span className="font-extrabold text-sm text-[#EB1551]">
                  ${currentVariant.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-extrabold text-base text-[#EB1551] sm:hidden">
                ${currentVariant.price.toFixed(2)}
              </span>
              <button
                onClick={() => addToCart(product, currentVariant, quantity)}
                className="ws-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider font-extrabold shadow-md flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <CartDrawer />
      <QuickAddModal />
      <EnquiryModal />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <PromoPopup />

      <StoreFooter />
    </div>
  );
}
