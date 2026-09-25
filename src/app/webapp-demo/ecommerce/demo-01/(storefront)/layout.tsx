import React from 'react';
import Link from 'next/link';
import { StoreHeader } from '../_components/StoreHeader';
import { DemoFrame } from '@/demos/components/DemoFrame';
import { storeName, storeTagline, productCategories } from '../_data/catalog';

const base = '/webapp-demo/ecommerce/demo-01';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBF9F6] font-sans text-[#2B2620]">
      <StoreHeader />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[#E7E2DA] bg-[#F3EFE9]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <p className="font-serif text-lg font-semibold">{storeName}</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#6B6259]">{storeTagline}</p>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-wider text-[#2B2620]">Shop</h2>
              <ul className="mt-3 space-y-2">
                {productCategories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`${base}/products?category=${category.slug}`}
                      className="text-sm text-[#6B6259] transition-colors hover:text-[#2B2620]"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-wider text-[#2B2620]">
                Company
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-[#6B6259]">
                <li>About</li>
                <li>Stockists</li>
                <li>Care guide</li>
                <li>Returns</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-wider text-[#2B2620]">
                Contact
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-[#6B6259]">
                <li>hello@kayasupply.example</li>
                <li>+880 1XXX-XXXXXX</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[#E7E2DA] pt-6 text-xs text-[#9A9189] sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 {storeName}. Fictional business, built for demonstration.</p>
            <p>
              Powered by{' '}
              <Link href="/" className="text-[#6B6259] underline underline-offset-2">
                OneDot ABM
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Room for the fixed demo bar */}
      <div className="h-16" aria-hidden="true" />

      <DemoFrame category="ecommerce" demo="demo-01" name={storeName} mode="storefront" />
    </div>
  );
}
