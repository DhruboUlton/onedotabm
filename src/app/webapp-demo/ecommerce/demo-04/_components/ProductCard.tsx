'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Scale, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../_types';
import { useStore } from '../_context/StoreContext';

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addToCart, wishlist, toggleWishlist, compareList, toggleCompare, openQuickAdd } =
    useStore();
  const base = '/webapp-demo/ecommerce/demo-04';

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  return (
    <div className="group ws-product-card bg-white rounded-3xl p-3 flex flex-col justify-between relative overflow-hidden">
      {/* 1. Image Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-[#FFEFE4]/40 overflow-hidden mb-3">
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider text-white shadow-sm ${
                product.badge.includes('OFF')
                  ? 'bg-[#F7941E]'
                  : product.badge === 'Hot'
                  ? 'bg-[#EB1551]'
                  : 'bg-[#1CBBB4]'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Action Icons Rail (Right Side) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isWishlisted
                ? 'bg-[#EB1551] text-white'
                : 'bg-white text-[#6B6B84] hover:bg-[#EB1551] hover:text-white'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isCompared
                ? 'bg-[#0A6375] text-white'
                : 'bg-white text-[#6B6B84] hover:bg-[#0A6375] hover:text-white'
            }`}
            title="Compare Product"
            aria-label="Compare"
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickAdd(product);
            }}
            className="w-8 h-8 rounded-full bg-white text-[#6B6B84] hover:bg-[#1CBBB4] hover:text-white flex items-center justify-center shadow-md transition-colors"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image Link */}
        <Link href={`${base}/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Rising Quick Action Buttons (At Bottom of Image) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickAdd(product);
            }}
            className="flex-1 bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-bold py-2 rounded-xl shadow-md transition-colors border border-slate-200"
          >
            Quick View
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex-1 bg-[#EB1551] hover:bg-[#1CBBB4] text-white text-xs font-bold py-2 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* 2. Product Meta Info */}
      <div className="flex-1 flex flex-col justify-between px-1">
        <div>
          <span className="text-[11px] font-bold text-[#1CBBB4] tracking-wide uppercase">
            {product.category}
          </span>
          <h3 className="font-nunito font-bold text-base text-[#0F172A] group-hover:text-[#EB1551] transition-colors line-clamp-2 leading-snug mt-0.5">
            <Link href={`${base}/products/${product.slug}`}>{product.title}</Link>
          </h3>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base sm:text-lg text-[#0F172A]">
              ${product.basePrice.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#F7941E] line-through font-semibold">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 text-xs text-[#6B6B84]">
            <div className="flex text-[#EB1551]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-current text-[#EB1551]'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold">({product.reviewCount})</span>
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-3 block sm:hidden">
          <button
            onClick={() => addToCart(product)}
            className="w-full ws-btn-primary py-2 text-xs font-bold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
