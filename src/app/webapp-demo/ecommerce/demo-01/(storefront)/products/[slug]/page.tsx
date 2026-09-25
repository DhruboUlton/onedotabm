import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Truck, RotateCcw } from 'lucide-react';
import { ProductVisual } from '../../../_components/ProductVisual';
import { ProductCard } from '../../../_components/ProductCard';
import { AddToCartButton } from '../../../_components/AddToCartButton';
import {
  formatPrice,
  getProduct,
  getStorefrontProducts,
  productCategories,
} from '../../../_data/catalog';

const base = '/webapp-demo/ecommerce/demo-01';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getStorefrontProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.blurb,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.status !== 'active') {
    notFound();
  }

  const category = productCategories.find((item) => item.slug === product.category);
  const related = getStorefrontProducts()
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#9A9189]">
          <li>
            <Link href={base} className="transition-colors hover:text-[#2B2620]">
              Home
            </Link>
          </li>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <li>
            <Link href={`${base}/products`} className="transition-colors hover:text-[#2B2620]">
              Shop
            </Link>
          </li>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <li>
                <Link
                  href={`${base}/products?category=${category.slug}`}
                  className="transition-colors hover:text-[#2B2620]"
                >
                  {category.name}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <li aria-current="page" className="text-[#6B6259]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductVisual
          product={product}
          className="aspect-square w-full rounded-2xl"
          label={false}
        />

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A6A3B]">
            {category?.name}
          </p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">{product.name}</h1>

          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-base text-[#9A9189] line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-[#6B6259]">{product.description}</p>

          <div className="mt-6">
            {product.stock === 0 ? (
              <p className="text-sm text-[#8A6A3B]">Sold out — back in stock next month.</p>
            ) : product.stock <= 8 ? (
              <p className="text-sm text-[#8A6A3B]">Only {product.stock} left in stock.</p>
            ) : (
              <p className="text-sm text-[#6B6259]">In stock, ships within 2 working days.</p>
            )}
          </div>

          <AddToCartButton product={product} className="mt-6 w-full sm:w-auto" />

          <dl className="mt-8 space-y-2 border-t border-[#E7E2DA] pt-6">
            <dt className="text-xs font-medium uppercase tracking-wider text-[#2B2620]">Details</dt>
            <dd>
              <ul className="mt-2 space-y-1.5">
                {product.details.map((detail) => (
                  <li key={detail} className="flex gap-2 text-sm text-[#6B6259]">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#8A6A3B]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </dd>
          </dl>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <li className="flex items-center gap-2.5 rounded-lg border border-[#E7E2DA] bg-white p-3 text-xs text-[#6B6259]">
              <Truck className="h-4 w-4 shrink-0 text-[#8A6A3B]" aria-hidden="true" />
              Free delivery over ৳5,000
            </li>
            <li className="flex items-center gap-2.5 rounded-lg border border-[#E7E2DA] bg-white p-3 text-xs text-[#6B6259]">
              <RotateCcw className="h-4 w-4 shrink-0 text-[#8A6A3B]" aria-hidden="true" />
              30-day returns
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-[#E7E2DA] pt-12">
          <h2 className="font-serif text-2xl tracking-tight">More in {category?.name}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.slug}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
