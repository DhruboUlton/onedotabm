'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Copy, Check, Gift } from 'lucide-react';
import { useStore } from '../_context/StoreContext';

export function PromoPopup() {
  const { popup, applyCoupon, addToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show after 3 seconds if enabled and not closed in current session
    if (!popup.isEnabled) return;
    const dismissed = sessionStorage.getItem('ws_promo_dismissed');
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
    sessionStorage.setItem('ws_promo_dismissed', 'true');
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(popup.couponCode);
    setCopied(true);
    applyCoupon(popup.couponCode);
    addToast('success', 'Coupon Copied & Applied!', `${popup.couponCode} applied to your cart.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleDismiss}
      />

      {/* Popup Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border-4 border-[#FFEFE4]">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-[#EB1551] hover:text-white flex items-center justify-center transition-colors text-slate-500 shadow-sm"
          aria-label="Dismiss pop-up"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square sm:aspect-auto sm:h-full bg-[#FFEFE4] overflow-hidden">
            <Image
              src={popup.image}
              alt={popup.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EB1551] text-white text-[10px] font-black uppercase tracking-wider mb-2">
                <Gift className="w-3 h-3" />
                <span>{popup.badge}</span>
              </span>
              <h3 className="font-bubblegum text-2xl text-[#0F172A] leading-tight">
                {popup.title}
              </h3>
              <p className="text-xs text-[#6B6B84] mt-1.5 leading-relaxed font-nunito">
                {popup.description}
              </p>
            </div>

            {/* Voucher Box */}
            <div className="bg-[#FFEFE4] p-3 rounded-2xl border border-[#F7941E]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6B6B84] font-bold block uppercase tracking-wider">
                  Discount Code
                </span>
                <span className="font-extrabold text-base text-[#0A6375] font-mono">
                  {popup.couponCode}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-[#0A6375] hover:bg-[#1CBBB4] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#FFDA43]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Applied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                href={popup.buttonLink}
                onClick={handleDismiss}
                className="w-full ws-btn-primary py-3 text-xs uppercase tracking-wider font-extrabold text-center block shadow-md"
              >
                {popup.buttonText}
              </Link>
              <button
                onClick={handleDismiss}
                className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                No thanks, continue browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
