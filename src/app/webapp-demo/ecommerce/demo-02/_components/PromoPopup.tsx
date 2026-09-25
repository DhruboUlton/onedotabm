'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '../_context/StoreContext';
import { X, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

export function PromoPopup({ baseHref = '/webapp-demo/ecommerce/demo-02' }: { baseHref?: string }) {
  const { popup, showToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!popup.isEnabled) return;
    if (typeof window !== 'undefined' && window.location.search.includes('nopopup')) return;
    const dismissed = sessionStorage.getItem('auraglass_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [popup.isEnabled]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('auraglass_popup_dismissed', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(popup.couponCode);
    setCopied(true);
    showToast(`Voucher code "${popup.couponCode}" copied!`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  if (!isOpen || !popup.isEnabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Visual */}
        <div className="md:w-5/12 bg-zinc-900 relative min-h-[160px] md:min-h-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={popup.image || '/demo-assets/ecommerce/demo-02/poster-f1-redbull.jpg'}
            alt="Promotion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              AuraGlass Limited Offer
            </span>
          </div>
        </div>

        {/* Right Content */}
        <div className="p-6 md:w-7/12 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold tracking-wide uppercase mb-2 w-fit">
            <Sparkles className="w-3 h-3 text-rose-500" />
            {popup.badge}
          </div>

          <h3 className="font-extrabold text-lg text-zinc-900 leading-snug">
            {popup.headline}
          </h3>

          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            {popup.description}
          </p>

          {/* Coupon Code Block */}
          <div className="mt-4 p-2.5 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase font-mono">Use Promo Code</span>
              <strong className="text-sm font-mono font-bold text-zinc-900 tracking-wider">
                {popup.couponCode}
              </strong>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Action CTA */}
          <Link
            href={`${baseHref}/products`}
            onClick={handleDismiss}
            className="mt-4 w-full py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <span>{popup.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleDismiss}
            className="mt-2 text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {popup.dismissText}
          </button>
        </div>
      </div>
    </div>
  );
}
