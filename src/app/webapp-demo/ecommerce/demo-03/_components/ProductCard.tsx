'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../_types';
import { useStore } from '../_context/StoreContext';
import { Heart, Eye, ArrowLeftRight, Star, ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  density?: '2' | '3' | '4' | 'list';
}

export function ProductCard({ product, density = '4' }: ProductCardProps) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    openQuickView,
  } = useStore();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const currentImage = activeVariant?.image || product.primaryImage;
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeVariant) {
      addToCart(product, activeVariant, 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  if (density === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 rounded-3xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Image Container - Flush fit */}
        <div className="relative w-full sm:w-48 h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
          <Link href={`/webapp-demo/ecommerce/demo-03/products/${product.slug}`} className="block w-full h-full relative">
            <Image
              src={currentImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, 200px"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-600 text-white shadow-sm z-10">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{product.brand}</span>
            <span>•</span>
            <span>{product.vendorName}</span>
          </div>

          <Link
            href={`/webapp-demo/ecommerce/demo-03/products/${product.slug}`}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
          >
            {product.title}
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>

          {/* Color Swatches */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Color:</span>
              <div className="flex items-center gap-1.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      selectedVariantIndex === idx
                        ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 scale-110'
                        : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                    title={v.name}
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                {activeVariant?.name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-amber-500 text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-bold">{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="w-full sm:w-44 flex sm:flex-col justify-between sm:justify-center items-end sm:items-end gap-3 pt-3 sm:pt-0">
          <div className="text-right">
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
              ${activeVariant.price.toFixed(2)}
            </div>
            {activeVariant.compareAtPrice && (
              <div className="text-xs text-slate-400 line-through">
                ${activeVariant.compareAtPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlist}
              className={`p-2.5 rounded-xl border transition-colors ${
                inWishlist
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
              }`}
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleQuickAdd}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid Card (4, 3, or 2 columns) - completely borderless, image fits the card flush
  return (
    <div className="group relative flex flex-col rounded-3xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Stage: fits the photo card completely with zero borders and zero padding */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={`/webapp-demo/ecommerce/demo-03/products/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={currentImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md ${
                product.badge === 'Sale'
                  ? 'bg-rose-500 text-white'
                  : product.badge === 'New'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.isSponsored && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/80 text-white backdrop-blur-md shadow-sm">
              Sponsored
            </span>
          )}
        </div>

        {/* Floating Quick Actions (Hover Reveal on desktop) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-colors ${
              inWishlist
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                : 'bg-white/90 text-slate-700 hover:text-rose-500 dark:bg-slate-900/90 dark:text-slate-200'
            }`}
            title="Save to Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleQuickView}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 dark:bg-slate-900/90 dark:hover:bg-slate-900 dark:text-slate-200 flex items-center justify-center shadow-md backdrop-blur-md transition-colors"
            title="Quick Preview"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCompare}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-colors ${
              inCompare
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400'
                : 'bg-white/90 text-slate-700 hover:text-blue-600 dark:bg-slate-900/90 dark:text-slate-200'
            }`}
            title="Compare Specs"
            aria-label="Compare"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Add To Cart Button on Image Bottom */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 inset-x-3 py-2 px-3 rounded-2xl bg-slate-900/90 hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 shadow-xl"
          aria-label={`Add ${product.title} to cart`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Quick Add</span>
        </button>
      </div>

      {/* Info Content - clean, generous padding, borderless */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Swatches & Variant Name */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  onMouseEnter={() => setSelectedVariantIndex(idx)}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    selectedVariantIndex === idx
                      ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 scale-110'
                      : 'border border-slate-300 dark:border-slate-600 hover:scale-105 opacity-80'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  aria-label={v.name}
                  title={v.name}
                />
              ))}
            </div>

            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
              {activeVariant?.name}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/webapp-demo/ecommerce/demo-03/products/${product.slug}`}
            className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 leading-snug transition-colors"
          >
            {product.title}
          </Link>
        </div>

        {/* Price & Rating - completely borderless */}
        <div className="mt-3 pt-2 flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-50">
              ${activeVariant.price.toFixed(2)}
            </div>
            {activeVariant.compareAtPrice && activeVariant.compareAtPrice > activeVariant.price && (
              <div className="text-[10px] text-slate-400 line-through">
                ${activeVariant.compareAtPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
