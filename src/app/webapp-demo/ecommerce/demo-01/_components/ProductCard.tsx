import React from 'react';
import Link from 'next/link';
import { ProductVisual } from './ProductVisual';
import { Product, formatPrice } from '../_data/catalog';

const base = '/webapp-demo/ecommerce/demo-01';

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 8;

  return (
    <Link
      href={`${base}/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E7E2DA] bg-white transition-all duration-300 hover:border-[#D6CFC4] hover:shadow-[0_10px_34px_rgba(43,38,32,0.08)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
    >
      <div className="relative">
        <ProductVisual product={product} className="aspect-[4/3] w-full" label={false} />

        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-[#2B2620] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
            Sold out
          </span>
        )}
        {lowStock && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#8A6A3B]">
            {product.stock} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          <h3 className="text-sm font-medium text-[#2B2620] transition-colors group-hover:text-[#8A6A3B]">
            {product.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[#6B6259]">{product.blurb}</p>
        </div>

        <p className="flex items-baseline gap-2 text-sm">
          <span className="font-medium text-[#2B2620]">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-xs text-[#9A9189] line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
