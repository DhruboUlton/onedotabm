'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../_context/StoreContext';
import { Mail, Phone, MapPin, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export function StoreFooter() {
  const { settings, categories, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    showToast('Subscribed to Kinetic Dispatch', 'You will receive weekly tech drop notices and exclusive hardware discounts.', 'success');
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors">
      {/* Trust Badges Strip */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 py-6">
        <div className="container mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Verified Vendors Only</h4>
              <p className="text-[11px] text-slate-500">Rigorous hardware authenticity vetting</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">2-Year Warranty</h4>
              <p className="text-[11px] text-slate-500">Comprehensive manufacturer coverage</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Free Express Delivery</h4>
              <p className="text-[11px] text-slate-500">On all qualifying orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Dedicated Support</h4>
              <p className="text-[11px] text-slate-500">24/7 technical hardware advisory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/webapp-demo/ecommerce/demo-03" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/30">
                K
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-50">
                KINETIC<span className="text-blue-600 dark:text-blue-400">GEAR</span>
              </span>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The multi-vendor electronics marketplace engineered for performance. Discover verified creator hardware, flagship mobile technology, low-latency esports gear, and clean GaN power architectures.
            </p>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5">
              Departments
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/webapp-demo/ecommerce/demo-03/products?category=${cat.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/webapp-demo/ecommerce/demo-03/products"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  View All Departments →
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/webapp-demo/ecommerce/demo-03/track-order" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/webapp-demo/ecommerce/demo-03/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href="/webapp-demo/ecommerce/demo-03/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Warranty Verification
                </Link>
              </li>
              <li>
                <Link href="/webapp-demo/ecommerce/demo-03/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tech Journal & Guides
                </Link>
              </li>
              <li>
                <Link href="/webapp-demo/ecommerce/demo-03/vendors" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Verified Vendor Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3.5">
              Kinetic Dispatch
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Subscribe to receive weekly hardware drops, teardown reviews, and private merchant coupons.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                You are registered for tech alerts!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 Kinetic Gear. Fictional Multi-Vendor Demo Powered by OneDot ABM.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Security Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
