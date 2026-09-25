'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useStore } from '../../../_context/StoreContext';
import { ProductCard } from '../../../_components/ProductCard';
import { ProductSizeOption, ProductDesignOption } from '../../../_types';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  Star,
  Send,
  Sparkles,
} from 'lucide-react';

const baseHref = '/webapp-demo/ecommerce/demo-02';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { products, addToCart, wishlist, toggleWishlist, addReview, showToast } = useStore();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Selected configuration matching Reference B
  const sizeOptions = product.sizeOptions || [];
  const designOptions = product.designOptions || [];

  const [selectedSize, setSelectedSize] = useState<ProductSizeOption>(
    sizeOptions[sizeOptions.length - 1] || {
      id: 'default',
      label: 'Large (18" x 24")',
      dimensions: '18" x 24"',
      price: product.price,
      compareAtPrice: product.compareAtPrice,
    }
  );

  const [selectedDesign, setSelectedDesign] = useState<ProductDesignOption>(
    designOptions[0] || {
      id: 'd1',
      label: 'Design 1',
      image: product.images[0],
    }
  );

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Review form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const isWishlisted = wishlist.includes(product.id);

  // Dynamic pricing based on selected size
  const currentPrice = selectedSize ? selectedSize.price : product.price;
  const currentComparePrice = selectedSize ? selectedSize.compareAtPrice : product.compareAtPrice;
  const currentSavings = currentComparePrice - currentPrice;

  // Images list: combines product images + selected design image
  const galleryImages = [
    selectedDesign?.image || product.images[0],
    ...product.images.filter((img) => img !== (selectedDesign?.image || product.images[0])),
  ];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedDesign);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedDesign);
    window.location.href = `${baseHref}/checkout`;
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    addReview({
      productId: product.id,
      productName: product.name,
      customerName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      isVerified: true,
      isVisible: true,
      location: 'Dhaka',
    });

    setReviewName('');
    setReviewComment('');
    showToast('Thank you! Your verified review has been published.', 'success');
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href={baseHref} className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <Link href={`${baseHref}/categories/${product.category}`} className="hover:text-black">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-zinc-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* 2. Main Product Hero (Matching Reference B) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery & Living Room Mockup */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Frame with arrow navigation */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-lg group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryImages[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Left & Right navigation arrows matching Reference B */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dots indicator at bottom center */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImageIndex === idx ? 'w-5 bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails row matching Reference B */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-black ring-2 ring-black/10'
                    : 'border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Metadata, Size selector, Design selector, CTAs (Matching Reference B) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category Tag */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#E86F1E]">
              {product.categoryName}
            </span>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-full border transition-colors ${
                isWishlisted
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-zinc-200 text-zinc-400 hover:text-black'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Title & Stock Pill */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight">
              {product.name}
            </h1>

            <div className="mt-2.5 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                In Stock ({product.stock} available)
              </span>

              <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-zinc-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Pricing Block with Save Pill */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                ৳ {currentPrice.toLocaleString()}
              </span>
              {currentComparePrice > currentPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  ৳ {currentComparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {currentSavings > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 shadow-xs">
                Save ৳ {currentSavings.toLocaleString()}
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-xs text-zinc-600 leading-relaxed">
            {product.shortBlurb}
          </p>

          {/* 1. SELECT SIZE & BUNDLE OPTION matching Reference B */}
          {sizeOptions.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
                Select Size & Bundle Option:
              </label>

              <div className="space-y-2">
                {sizeOptions.map((opt) => {
                  const isSelected = selectedSize.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedSize(opt)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0A0B0E] text-white border-[#0A0B0E] shadow-md'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-white bg-white text-black' : 'border-zinc-400'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                        <span>{opt.label}</span>
                      </div>
                      <span className={isSelected ? 'text-amber-400 font-bold' : 'text-zinc-600'}>
                        ৳ {opt.price.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. SELECT YOUR PREFERRED DESIGN matching Reference B */}
          {designOptions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase tracking-wider text-zinc-800">
                  Select Your Preferred Design:
                </label>
                <span className="text-[11px] text-zinc-500">
                  {selectedDesign.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {designOptions.map((des) => {
                  const isSelected = selectedDesign.id === des.id;
                  return (
                    <button
                      key={des.id}
                      onClick={() => {
                        setSelectedDesign(des);
                        // Also show design image as first
                        const imgIdx = galleryImages.indexOf(des.image);
                        if (imgIdx > -1) setActiveImageIndex(imgIdx);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white shadow-md ring-2 ring-black'
                          : 'bg-white text-zinc-800 border border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {des.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Quantity & Add to Cart matching Reference B */}
          <div className="flex items-center gap-3 pt-2">
            {/* Stepper */}
            <div className="flex items-center border border-zinc-300 rounded-xl overflow-hidden bg-zinc-50 shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-11 flex items-center justify-center text-zinc-700 hover:bg-zinc-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-zinc-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-11 flex items-center justify-center text-zinc-700 hover:bg-zinc-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart button matching Reference B (deep black with bag icon) */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 py-3.5 px-6 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-black/15 cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Direct Order Buttons matching Reference B */}
          <div className="space-y-2 pt-1">
            <a
              href="https://m.me/auraglass.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#0084FF] hover:bg-[#0074e0] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order On Messenger</span>
            </a>

            <a
              href={`https://wa.me/8801792884422?text=${encodeURIComponent(
                `Hello AuraGlass, I want to order "${product.name}" (${selectedSize.label}, ${selectedDesign.label}) - Total ৳${currentPrice * quantity}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order On WhatsApp</span>
            </a>
          </div>

          {/* Assurance & Guarantees Card matching Reference B */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3 text-xs text-zinc-700">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 block font-semibold">Delivery:</strong>
                <span>All over Bangladesh | Safe home delivery available</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 block font-semibold">Color Guarantee:</strong>
                <span>Lifetime color vibrancy + water and dust proof float glass</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 block font-semibold">Damage Replacement:</strong>
                <span>Free instant replacement if damaged in transit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Tabs (Description, Specs, Reviews) */}
      <div className="border-t border-zinc-200 pt-10">
        <div className="flex items-center gap-6 border-b border-zinc-200 mb-6 text-sm">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 font-bold transition-all relative ${
              activeTab === 'desc'
                ? 'text-black border-b-2 border-black'
                : 'text-zinc-400 hover:text-zinc-800'
            }`}
          >
            Description & Materials
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-black border-b-2 border-black'
                : 'text-zinc-400 hover:text-zinc-800'
            }`}
          >
            Hanging & Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-black border-b-2 border-black'
                : 'text-zinc-400 hover:text-zinc-800'
            }`}
          >
            Collector Reviews ({product.reviewCount})
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-zinc-600 leading-relaxed">
            <p>{product.description}</p>
            <p>
              Each glass poster is manufactured using optical-grade 4mm float glass that undergoes precision thermal tempering. This ensures high structural strength and smooth, hand-polished beveled edges that are completely safe to handle.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="font-bold text-zinc-900 block text-xs">Finish</span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">{product.finish}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="font-bold text-zinc-900 block text-xs">Mounting</span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">{product.mounting}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="font-bold text-zinc-900 block text-xs">Durability</span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">Scratch & Moisture Proof</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specs & Hanging */}
        {activeTab === 'specs' && (
          <div className="max-w-2xl space-y-4">
            <table className="w-full text-xs text-left border-collapse border border-zinc-200 rounded-xl overflow-hidden">
              <tbody className="divide-y divide-zinc-200">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} className="hover:bg-zinc-50">
                      <td className="p-3 font-bold text-zinc-800 bg-zinc-50/50 w-1/3">{key}</td>
                      <td className="p-3 text-zinc-600">{val}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="p-3 font-bold text-zinc-800 bg-zinc-50/50">Glass Thickness</td>
                      <td className="p-3 text-zinc-600">4.0 mm Toughened Float Safety Glass</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-zinc-800 bg-zinc-50/50">Corner Finish</td>
                      <td className="p-3 text-zinc-600">Diamond Beveled & Smooth Polished</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-zinc-800 bg-zinc-50/50">Mounting Strips</td>
                      <td className="p-3 text-zinc-600">3M Command™ No-Damage Adhesive (Included)</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-3xl">
            {/* Write Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <h4 className="font-bold text-sm text-zinc-900">Write a Collector Review</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Mahmud"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                  >
                    <option value={5}>5 Stars - Outstanding Gloss & Clarity</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about the glass reflection, room appearance, and packaging quality..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Verified Review</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-200 pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">You May Also Like</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Matching glass wall decor from {product.categoryName}</p>
            </div>
            <Link
              href={`${baseHref}/categories/${product.category}`}
              className="text-xs font-bold text-black hover:underline"
            >
              View More in Category →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} baseHref={baseHref} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
