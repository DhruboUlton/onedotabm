'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, Copy, Check } from 'lucide-react';
import { useStore } from '../_context/StoreContext';

interface PromoPopupProps {
  baseHref?: string;
}

export function PromoPopup({
  baseHref = '/webapp-demo/ecommerce/demo-01',
}: PromoPopupProps) {
  const { popup, applyCoupon } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!popup.isEnabled) return;
    const dismissed = sessionStorage.getItem('shuddha_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [popup.isEnabled]);

  if (!isOpen || !popup.isEnabled) return null;

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('shuddha_popup_dismissed', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(popup.couponCode);
    setCopied(true);
    applyCoupon(popup.couponCode);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#ECE6DC]"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={handleDismiss}
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs hover:bg-black/60 transition-colors"
          aria-label="Close promo modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top visual banner */}
        <div className="relative h-44 w-full bg-[#072D24] overflow-hidden">
          <img
            src={popup.image || '/demo-assets/ecommerce/gawa-ghee.jpg'}
            alt="Promotion"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E87121] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              <span>{popup.badge}</span>
            </span>
            <h3 className="mt-1 text-lg font-bold text-white leading-tight">
              {popup.headline}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-xs text-zinc-600 leading-relaxed">
            {popup.description}
          </p>

          {/* Coupon box */}
          {popup.couponCode && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-[#E87121] bg-orange-50/60 p-3">
              <div className="text-left">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#E87121]">
                  Coupon Code
                </span>
                <span className="block font-mono text-base font-extrabold text-[#072D24]">
                  {popup.couponCode}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-lg bg-[#E87121] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#D46013] transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy & Apply</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* CTA Button */}
          <Link
            href={`${baseHref}/products`}
            onClick={handleDismiss}
            className="mt-4 block w-full rounded-xl bg-[#072D24] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c4437] transition-all"
          >
            {popup.ctaText}
          </Link>

          <button
            onClick={handleDismiss}
            className="mt-2.5 text-xs text-zinc-400 hover:text-zinc-600 underline"
          >
            {popup.dismissText}
          </button>

          {popup.disclaimer && (
            <p className="mt-3 text-[10px] text-zinc-400 border-t border-[#F0ECE4] pt-2">
              {popup.disclaimer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
