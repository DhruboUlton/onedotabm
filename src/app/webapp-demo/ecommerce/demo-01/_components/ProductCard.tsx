'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';
import { Product } from '../_types';
import { useStore } from '../_context/StoreContext';

interface ProductCardProps {
  product: Product;
  baseHref?: string;
}

export function ProductCard({
  product,
  baseHref = '/webapp-demo/ecommerce/demo-01',
}: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#E9E4DC] bg-white p-3.5 transition-all duration-300 hover:border-[#D6CEBF] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      {/* Top badges */}
      <div className="flex items-center justify-between gap-1 mb-2 z-10">
        <div className="flex flex-wrap gap-1">
          {product.badge && (
            <span className="inline-flex items-center rounded-full bg-[#E87121] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent && !product.badge && (
            <span className="inline-flex items-center rounded-full bg-[#072D24] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="inline-flex items-center rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Stock Out
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-zinc-100/80 text-zinc-500 hover:bg-zinc-200/80 hover:text-zinc-900'
          }`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Image container */}
      <Link
        href={`${baseHref}/products/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden rounded-xl bg-[#FAF8F5]"
      >
        <img
          src={product.images[0] || '/demo-assets/ecommerce/gawa-ghee.jpg'}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#8A8175] mb-1">
            <span className="font-medium text-[#072D24]">{product.categoryName}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-semibold text-zinc-800 text-[11px]">{product.rating}</span>
              <span className="text-[10px] text-zinc-400">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`${baseHref}/products/${product.slug}`}>
            <h3 className="line-clamp-2 text-sm font-semibold text-[#1F2923] hover:text-[#E87121] transition-colors leading-snug">
              {product.name}
            </h3>
            {product.bengaliName && (
              <p className="line-clamp-1 text-xs text-[#7A7266] mt-0.5 font-normal">
                {product.bengaliName}
              </p>
            )}
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2 border-t border-[#F0ECE4]">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base font-bold text-[#E87121]">
              ৳{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                ৳{product.compareAtPrice.toLocaleString()}
              </span>
            )}
            <span className="ml-auto text-[11px] text-zinc-500">
              {isOutOfStock ? (
                <span className="text-rose-600 font-medium">Out of stock</span>
              ) : (
                <span className="text-emerald-700 font-medium">In stock</span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-semibold transition-all active:scale-95 ${
                isOutOfStock
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'bg-[#E87121] text-white hover:bg-[#D46013] shadow-sm shadow-orange-500/10'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add to Cart</span>
            </button>

            <Link
              href={`${baseHref}/products/${product.slug}`}
              className="flex items-center justify-center rounded-lg border border-[#072D24] py-2 px-2 text-xs font-semibold text-[#072D24] transition-all hover:bg-[#072D24] hover:text-white active:scale-95 text-center"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
