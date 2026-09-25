'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../_types';
import { useStore } from '../_context/StoreContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  baseHref?: string;
}

export function ProductCard({
  product,
  baseHref = '/webapp-demo/ecommerce/demo-02',
}: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  // Price calculation
  const minPrice = product.sizeOptions && product.sizeOptions.length > 0
    ? Math.min(...product.sizeOptions.map((s) => s.price))
    : product.price;

  const maxPrice = product.sizeOptions && product.sizeOptions.length > 0
    ? Math.max(...product.sizeOptions.map((s) => s.price))
    : product.price;

  const displayPrice = minPrice === maxPrice ? `৳ ${minPrice.toLocaleString()}` : `৳ ${minPrice.toLocaleString()} - ৳ ${maxPrice.toLocaleString()}`;

  const hasDiscount = product.compareAtPrice > product.price;
  const savings = product.compareAtPrice - product.price;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* 1. Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
        <Link href={`${baseHref}/products/${product.slug}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Glass sheen highlight simulation */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Save ৳{savings.toLocaleString()}
            </span>
          )}
          {product.badge && product.badge !== 'Save ৳230' && (
            <span className="bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/90 text-zinc-600 hover:bg-white hover:text-rose-500 shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-white text-zinc-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] text-zinc-500 font-medium">
          <span className="uppercase tracking-wider truncate">{product.categoryName}</span>
          <div className="flex items-center gap-1 shrink-0 text-amber-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-zinc-700">{product.rating.toFixed(1)}</span>
            <span className="text-zinc-400 text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <Link
          href={`${baseHref}/products/${product.slug}`}
          className="font-bold text-sm text-zinc-900 hover:text-black line-clamp-2 leading-snug mb-2 transition-colors flex-1"
        >
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-extrabold text-zinc-900">
            {displayPrice}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through">
              ৳{product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Bottom Action Button matching Reference A */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
          <Link
            href={`${baseHref}/products/${product.slug}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs font-semibold hover:bg-zinc-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Options</span>
          </Link>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
