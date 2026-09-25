'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  Check,
  Video,
  FileText,
  Share2,
} from 'lucide-react';
import { useStore } from '../../../_context/StoreContext';
import { ProductCard } from '../../../_components/ProductCard';

const baseHref = '/webapp-demo/ecommerce/demo-01';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    settings,
  } = useStore();

  const product = products.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  // Active state
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'description' | 'video' | 'reviews'>('description');

  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Frequently bought together bundle state (Matches Screenshot 2!)
  const bundleCompanion =
    products.find((p) => p.id !== product.id && p.category === 'oil-and-ghee' && p.status === 'active') ||
    products.find((p) => p.id !== product.id && p.status === 'active');

  const [includeMain, setIncludeMain] = useState(true);
  const [includeCompanion, setIncludeCompanion] = useState(true);

  const bundleTotal =
    (includeMain ? product.price : 0) +
    (includeCompanion && bundleCompanion ? bundleCompanion.price : 0);
  const bundleCount = (includeMain ? 1 : 0) + (includeCompanion && bundleCompanion ? 1 : 0);

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id && r.isVisible);

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.status === 'active')
    .slice(0, 4);

  // Add bundle to cart
  const handleAddBundleToCart = () => {
    if (includeMain) addToCart(product, 1);
    if (includeCompanion && bundleCompanion) addToCart(bundleCompanion, 1);
  };

  // Buy Now handler
  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push(`${baseHref}/checkout`);
  };

  // Submit review handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    addReview({
      productId: product.id,
      productName: product.name,
      customerName: newReviewAuthor.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      isVerified: true,
      isVisible: true,
    });

    setNewReviewAuthor('');
    setNewReviewComment('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 pb-12 space-y-10">
      {/* 1. Breadcrumbs (Matching Screenshot 2: Home > Products > Gawa Ghee 1kg) */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href={baseHref} className="hover:text-[#072D24]">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link href={`${baseHref}/products`} className="hover:text-[#072D24]">
          Products
        </Link>
        <span>&rsaquo;</span>
        <span className="font-semibold text-zinc-900">{product.name}</span>
      </nav>

      {/* 2. Main Product Section (Matching Screenshot 2) */}
      <div className="rounded-3xl border border-[#ECE6DC] bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Image Gallery (4 Thumbnails on Left + Large View with Nav Arrows) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Vertical Thumbnail Column (4 items) */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-18 w-18 sm:h-20 sm:w-20 overflow-hidden rounded-xl border-2 transition-all shrink-0 bg-[#FAF8F5] ${
                    selectedImageIndex === idx
                      ? 'border-[#E87121] shadow-md ring-2 ring-orange-500/20'
                      : 'border-[#EAE5DC] opacity-75 hover:opacity-100 hover:border-zinc-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Large Main Image Container */}
            <div className="relative flex-1 aspect-square rounded-2xl border border-[#ECE6DC] bg-[#FAF8F5] overflow-hidden group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Prev / Next controls */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md backdrop-blur-xs hover:bg-white transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md backdrop-blur-xs hover:bg-white transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Discount / Offer Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 rounded-full bg-[#E87121] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Price, Stepper & Action Buttons */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2923] tracking-tight leading-tight">
                {product.name}
              </h1>

              {product.bengaliName && (
                <p className="text-sm font-medium text-zinc-500 mt-1">
                  {product.bengaliName}
                </p>
              )}

              {/* Price & Discount */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#E87121]">
                  ৳{product.price.toLocaleString()}.00
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-base text-zinc-400 line-through">
                      ৳{product.compareAtPrice.toLocaleString()}.00
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      Save ৳{(product.compareAtPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Rating & Stock */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-300'}`}
                    />
                  ))}
                  <span className="font-bold text-zinc-800 ml-1">{product.rating}</span>
                  <span className="text-zinc-400">({product.reviewCount} reviews)</span>
                </div>

                <span className="h-3 w-px bg-zinc-200" />

                <div>
                  {isOutOfStock ? (
                    <span className="font-bold text-rose-600">Out of Stock</span>
                  ) : (
                    <span className="font-semibold text-emerald-700">
                      In Stock ({product.stock} units available)
                    </span>
                  )}
                </div>
              </div>

              {/* Short blurb */}
              <p className="mt-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Quantity Stepper */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-semibold text-zinc-700">Quantity:</span>
                <div className="flex items-center rounded-xl border border-[#DCD6CA] bg-[#FAF8F5]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-zinc-600 hover:bg-zinc-200 transition-colors rounded-l-xl"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-zinc-600 hover:bg-zinc-200 transition-colors rounded-r-xl disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Action Buttons (Matching Screenshot 2!) */}
              <div className="mt-6 space-y-2.5">
                {/* 1. ADD TO CART (Orange) */}
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E87121] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#D46013] transition-all active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>ADD TO CART</span>
                </button>

                {/* 2. BUY NOW (Dark Green / Black) */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full rounded-xl bg-[#072D24] py-3.5 text-sm font-bold text-white hover:bg-[#0c4437] transition-all active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                  BUY NOW
                </button>

                {/* Secondary Contact Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* 3. Order On WhatsApp (Green) */}
                  <a
                    href={`https://wa.me/8801711234567?text=${encodeURIComponent(
                      `Hello, I would like to order "${product.name}" (Qty: ${quantity}, Price: ৳${product.price}) from Shuddha Harvest.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-xs font-bold text-white hover:bg-[#1ebe5d] transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Order On WhatsApp</span>
                  </a>

                  {/* 4. Call For Order (Navy Blue) */}
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] py-3 text-xs font-bold text-white hover:bg-[#172554] transition-all"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call For Order</span>
                  </a>
                </div>
              </div>

              {/* Brand Tag Box & Wishlist */}
              <div className="mt-6 flex items-center justify-between border-t border-[#F0ECE4] pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Brand:</span>
                  <span className="font-bold text-[#072D24] border border-[#072D24] px-2 py-0.5 rounded-md">
                    {product.brand}
                  </span>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    inWishlist ? 'text-rose-600' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* SKU and Guarantee strip */}
            <div className="border-t border-[#F0ECE4] pt-4 space-y-1 text-xs text-zinc-500">
              <div className="flex justify-between">
                <span>SKU:</span>
                <span className="font-mono text-zinc-800 font-semibold">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-zinc-800 font-medium">{product.categoryName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FREQUENTLY BOUGHT TOGETHER BUNDLE CARD (Matching Screenshot 2!) */}
      {bundleCompanion && (
        <section className="rounded-3xl border border-[#ECE6DC] bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#1F2923] mb-4">
            Frequently bought together
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Items display */}
            <div className="flex flex-1 flex-col sm:flex-row items-center gap-4 w-full">
              {/* Product 1 */}
              <div
                onClick={() => setIncludeMain((prev) => !prev)}
                className={`flex flex-1 items-center gap-3.5 rounded-2xl border p-3.5 cursor-pointer transition-all w-full ${
                  includeMain
                    ? 'border-[#E87121] bg-orange-50/20'
                    : 'border-[#ECE6DC] bg-[#FAF8F5] opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeMain}
                  onChange={(e) => setIncludeMain(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#E87121]"
                />
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-16 w-16 rounded-xl object-cover bg-white border border-[#ECE6DC]"
                />
                <div>
                  <h3 className="text-xs font-bold text-[#1F2923] line-clamp-1">{product.name}</h3>
                  <p className="text-xs font-bold text-[#E87121] mt-0.5">
                    ৳{product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <span className="text-lg font-bold text-zinc-400">+</span>

              {/* Product 2 */}
              <div
                onClick={() => setIncludeCompanion((prev) => !prev)}
                className={`flex flex-1 items-center gap-3.5 rounded-2xl border p-3.5 cursor-pointer transition-all w-full ${
                  includeCompanion
                    ? 'border-[#E87121] bg-orange-50/20'
                    : 'border-[#ECE6DC] bg-[#FAF8F5] opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={includeCompanion}
                  onChange={(e) => setIncludeCompanion(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#E87121]"
                />
                <img
                  src={bundleCompanion.images[0]}
                  alt={bundleCompanion.name}
                  className="h-16 w-16 rounded-xl object-cover bg-white border border-[#ECE6DC]"
                />
                <div>
                  <h3 className="text-xs font-bold text-[#1F2923] line-clamp-1">
                    {bundleCompanion.name}
                  </h3>
                  <p className="text-xs font-bold text-[#E87121] mt-0.5">
                    ৳{bundleCompanion.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <span className="text-lg font-bold text-zinc-400">=</span>
            </div>

            {/* Bundle Total & Add to Cart Action */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-3 rounded-2xl bg-[#FAF8F5] border border-[#ECE6DC] p-5 w-full lg:w-56 text-center">
              <div>
                <span className="block text-xl font-black text-[#E87121]">
                  ৳{bundleTotal.toLocaleString()}.00
                </span>
                <span className="block text-[11px] text-zinc-500 font-medium mt-0.5">
                  Save ৳0 (Combo Price)
                </span>
              </div>

              <button
                onClick={handleAddBundleToCart}
                disabled={bundleCount === 0}
                className="w-full rounded-xl bg-[#E87121] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#D46013] transition-all disabled:opacity-40"
              >
                Add {bundleCount} {bundleCount === 1 ? 'item' : 'items'} to cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. TABBED INFORMATION SECTION (Matching Screenshot 2: Description | Video | Reviews) */}
      <section className="rounded-3xl border border-[#ECE6DC] bg-white p-6 sm:p-8 shadow-xs">
        {/* Tab Headers */}
        <div className="flex flex-wrap gap-2 border-b border-[#ECE6DC] pb-4 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'description'
                ? 'bg-[#072D24] text-white shadow-sm'
                : 'bg-[#FAF8F5] text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-[#072D24] text-white shadow-sm'
                : 'bg-[#FAF8F5] text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Product Video
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-[#072D24] text-white shadow-sm'
                : 'bg-[#FAF8F5] text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Customer Reviews ({productReviews.length})
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'description' && (
          <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
            <div>
              <h3 className="text-base font-bold text-[#1F2923] mb-2">
                পণ্য পরিচিতি ও বৈশিষ্ট্য
              </h3>
              <p>{product.description}</p>
            </div>

            {/* Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-6 border-t border-[#F0ECE4] pt-6">
                <h3 className="text-sm font-bold text-[#1F2923] mb-3">
                  Specification Details
                </h3>
                <div className="divide-y divide-[#F0ECE4] rounded-xl border border-[#ECE6DC] overflow-hidden">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="grid grid-cols-3 p-3 text-xs">
                      <span className="font-semibold text-zinc-500">{spec.label}</span>
                      <span className="col-span-2 text-zinc-800 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Product Video */}
        {activeTab === 'video' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1F2923]">
              খামার ও প্রস্তুত প্রণালী ভিডিও (Farm Churning Demo)
            </h3>
            <div className="relative aspect-video max-w-3xl rounded-2xl overflow-hidden bg-black shadow-lg flex items-center justify-center group">
              <img
                src={product.images[1] || product.images[0]}
                alt="Video thumbnail"
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E87121] text-white shadow-2xl transition-transform group-hover:scale-110">
                  <Video className="h-8 w-8 ml-0.5" />
                </div>
                <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                  Watch Pure Bilona Churning Process (2:45)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews Summary */}
            <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-[#FAF8F5] p-6 border border-[#ECE6DC]">
              <div className="text-center sm:text-left">
                <div className="text-4xl font-black text-[#1F2923]">{product.rating}</div>
                <div className="flex items-center gap-1 text-amber-500 my-1 justify-center sm:justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-500">Based on {product.reviewCount} customer ratings</p>
              </div>

              <div className="flex-1 w-full space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <span>5 Star</span>
                  <div className="h-2 flex-1 rounded-full bg-zinc-200 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[92%]" />
                  </div>
                  <span>92%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4 Star</span>
                  <div className="h-2 flex-1 rounded-full bg-zinc-200 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[8%]" />
                  </div>
                  <span>8%</span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {productReviews.length === 0 ? (
                <p className="text-xs text-zinc-500">No reviews yet for this product. Be the first to review!</p>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-[#ECE6DC] p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900">{rev.customerName}</span>
                        {rev.isVerified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-400 text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-200'}`}
                        />
                      ))}
                    </div>

                    <p className="text-zinc-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="border-t border-[#F0ECE4] pt-6">
              <h4 className="text-sm font-bold text-[#1F2923] mb-3">Write a Customer Review</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-3 max-w-xl">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanzirul Islam"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[5, 4, 3, 2, 1].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReviewRating(num)}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold border ${
                          newReviewRating === num
                            ? 'bg-amber-50 border-amber-400 text-amber-700'
                            : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                        <span>{num} Star</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your experience with the fragrance, taste, and purity of this product..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full rounded-xl border border-[#DCD6CA] bg-[#FAF8F5] p-2.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E87121] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-[#072D24] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0c4437] transition-all"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* 5. RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-3">
            <h2 className="text-xl font-bold text-[#1F2923]">Related Products</h2>
            <Link
              href={`${baseHref}/categories/${product.category}`}
              className="text-xs font-bold text-[#072D24] hover:text-[#E87121]"
            >
              View More &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} baseHref={baseHref} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
