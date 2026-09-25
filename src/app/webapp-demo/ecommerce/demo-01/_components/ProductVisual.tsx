import React from 'react';
import { Product } from '../_data/catalog';

/**
 * Product imagery, generated rather than stocked.
 *
 * Shipping real product photography for a fictional store means either stock
 * images that fight the design or a pile of binary assets to maintain. This
 * draws a coherent, per-product visual from the product's own tone, so the
 * catalogue reads as one brand and weighs nothing.
 */

export function ProductVisual({
  product,
  className = '',
  label = true,
}: {
  product: Product;
  className?: string;
  label?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(150deg, ${product.tone.from}, ${product.tone.to})`,
      }}
      role="img"
      aria-label={`${product.name} — illustrative product visual`}
    >
      {/* Soft light source, keeps the flat gradient from reading as a swatch */}
      <div className="absolute -top-1/3 left-1/4 h-2/3 w-2/3 rounded-full bg-white/25 blur-3xl" />

      {/* Silhouette block, proportioned per category so the grid has rhythm */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`rounded-lg bg-white/20 ring-1 ring-white/30 backdrop-blur-[1px] ${
            product.category === 'lighting'
              ? 'h-1/2 w-1/4 rounded-b-none'
              : product.category === 'textiles'
                ? 'h-1/3 w-1/2'
                : product.category === 'storage'
                  ? 'h-2/5 w-2/5'
                  : 'h-2/5 w-1/3 rounded-full'
          }`}
        />
      </div>

      {label && (
        <span className="absolute bottom-3 left-3 rounded-full bg-black/25 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-sm">
          {product.category}
        </span>
      )}
    </div>
  );
}
