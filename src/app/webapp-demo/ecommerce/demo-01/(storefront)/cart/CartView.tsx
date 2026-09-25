'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../_components/CartProvider';
import { formatPrice } from '../../_data/catalog';

const base = '/webapp-demo/ecommerce/demo-01';
const SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 15000;

export function CartView() {
  const { lines, subtotal, itemCount, setQuantity, remove, clear } = useCart();
  const [placed, setPlaced] = useState(false);

  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (placed) {
    return (
      <div className="rounded-2xl border border-[#E7E2DA] bg-white p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3EFE9] text-[#8A6A3B]">
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-serif text-2xl">Order placed</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6B6259]">
          In the real build this would hit a payment provider and write an order. Here it just
          proves the flow — nothing was charged and no data was stored.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`${base}/products`}
            className="rounded-full bg-[#2B2620] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3D372F] active:scale-[0.98] active:duration-75"
          >
            Keep shopping
          </Link>
          <Link
            href={`${base}/admin/orders`}
            className="rounded-full border border-[#D6CFC4] bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#F3EFE9] active:scale-[0.98] active:duration-75"
          >
            See orders in admin
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D6CFC4] bg-white p-12 text-center">
        <p className="font-medium">Your cart is empty</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-[#6B6259]">
          Add something from the catalogue and it will show up here.
        </p>
        <Link
          href={`${base}/products`}
          className="mt-6 inline-flex rounded-full bg-[#2B2620] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3D372F] active:scale-[0.98] active:duration-75"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
      <ul className="divide-y divide-[#E7E2DA] border-y border-[#E7E2DA]">
        {lines.map((line) => (
          <li key={line.slug} className="flex flex-wrap items-center gap-4 py-5">
            <div className="min-w-0 flex-1">
              <Link
                href={`${base}/products/${line.slug}`}
                className="font-medium transition-colors hover:text-[#8A6A3B]"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-[#6B6259]">{formatPrice(line.price)} each</p>
            </div>

            <div className="flex items-center rounded-full border border-[#E7E2DA] bg-white">
              <button
                type="button"
                onClick={() => setQuantity(line.slug, line.quantity - 1)}
                aria-label={`Decrease quantity of ${line.name}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6B6259] transition-colors hover:text-[#2B2620] active:scale-[0.95] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
                {line.quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(line.slug, line.quantity + 1)}
                aria-label={`Increase quantity of ${line.name}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6B6259] transition-colors hover:text-[#2B2620] active:scale-[0.95] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <p className="w-24 text-right text-sm font-medium tabular-nums">
              {formatPrice(line.price * line.quantity)}
            </p>

            <button
              type="button"
              onClick={() => remove(line.slug)}
              aria-label={`Remove ${line.name} from cart`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#9A9189] transition-colors hover:text-[#2B2620] active:scale-[0.95] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-[#E7E2DA] bg-white p-6 lg:sticky lg:top-24">
        <h2 className="font-serif text-xl">Summary</h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#6B6259]">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#6B6259]">Shipping</dt>
            <dd className="tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-[#E7E2DA] pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(total)}</dd>
          </div>
        </dl>

        {shipping > 0 && (
          <p className="mt-3 text-xs text-[#8A6A3B]">
            Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free delivery.
          </p>
        )}

        <button
          type="button"
          onClick={() => setPlaced(true)}
          className="mt-6 w-full rounded-full bg-[#2B2620] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3D372F] active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620] focus-visible:ring-offset-2"
        >
          Checkout
        </button>

        <button
          type="button"
          onClick={clear}
          className="mt-3 w-full rounded-full border border-[#E7E2DA] px-6 py-2.5 text-sm text-[#6B6259] transition-colors hover:text-[#2B2620] active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
        >
          Clear cart
        </button>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-[#9A9189]">
          Checkout is a demonstration. No payment is taken.
        </p>
      </aside>
    </div>
  );
}
