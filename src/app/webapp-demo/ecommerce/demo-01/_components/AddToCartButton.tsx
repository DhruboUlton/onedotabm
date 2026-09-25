'use client';

import React, { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';
import { Product } from '../_data/catalog';

export function AddToCartButton({
  product,
  className = '',
}: {
  product: Product;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock === 0;

  const handleClick = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E2DA] bg-[#F3EFE9] px-6 py-3 text-sm font-medium text-[#9A9189] cursor-not-allowed ${className}`}
      >
        Sold out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#2B2620] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3D372F] active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620] focus-visible:ring-offset-2 ${className}`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          Added to cart
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Add to cart
        </>
      )}
    </button>
  );
}
