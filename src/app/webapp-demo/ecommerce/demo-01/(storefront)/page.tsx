import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../_components/ProductCard';
import { ProductVisual } from '../_components/ProductVisual';
import {
  featuredSlugs,
  getProduct,
  getStorefrontProducts,
  productCategories,
  storeName,
  storeTagline,
} from '../_data/catalog';

const base = '/webapp-demo/ecommerce/demo-01';

export default function StoreHomePage() {
  const featured = featuredSlugs
    .map((slug) => getProduct(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const newArrivals = getStorefrontProducts().slice(0, 4);
  const heroProduct = featured[0];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[#E7E2DA]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8A6A3B]">
              New season
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {storeTagline}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#6B6259]">
              {storeName} makes a small run of kitchen, lighting and storage pieces. Each one is
              built to be used daily and to look better after a year than it did on day one.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${base}/products`}
                className="inline-flex items-center gap-2 rounded-full bg-[#2B2620] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3D372F] active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620] focus-visible:ring-offset-2"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={`${base}/products?category=lighting`}
                className="inline-flex items-center gap-2 rounded-full border border-[#D6CFC4] bg-white px-6 py-3 text-sm font-medium text-[#2B2620] transition-colors hover:bg-[#F3EFE9] active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
              >
                New in lighting
              </Link>
            </div>
          </div>

          {heroProduct && (
            <Link
              href={`${base}/products/${heroProduct.slug}`}
              className="group relative block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
            >
              <ProductVisual
                product={heroProduct}
                className="aspect-[5/4] w-full transition-transform duration-500 group-hover:scale-[1.02]"
                label={false}
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#8A6A3B]">
                  Featured
                </p>
                <p className="mt-1 font-medium">{heroProduct.name}</p>
                <p className="text-sm text-[#6B6259]">{heroProduct.blurb}</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-[#E7E2DA]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">Shop by category</h2>

          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {productCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`${base}/products?category=${category.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 rounded-xl border border-[#E7E2DA] bg-white p-5 transition-all duration-300 hover:border-[#D6CFC4] hover:shadow-[0_10px_34px_rgba(43,38,32,0.07)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2620]"
                >
                  <div>
                    <h3 className="font-medium transition-colors group-hover:text-[#8A6A3B]">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#6B6259]">
                      {category.tagline}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-[#9A9189] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#2B2620]"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* New arrivals */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">New arrivals</h2>
            <Link
              href={`${base}/products`}
              className="inline-flex items-center gap-1.5 text-sm text-[#6B6259] transition-colors hover:text-[#2B2620]"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
