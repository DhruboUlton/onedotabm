'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, HeartHandshake, Truck, Award } from 'lucide-react';
import { useStore } from '../_context/StoreContext';

interface StoreFooterProps {
  baseHref?: string;
}

export function StoreFooter({
  baseHref = '/webapp-demo/ecommerce/demo-01',
}: StoreFooterProps) {
  const { settings, categories } = useStore();

  return (
    <footer className="border-t border-[#ECE6DC] bg-[#FAF8F5] text-zinc-700">
      {/* 1. Value propositions strip */}
      <div className="border-b border-[#ECE6DC] bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#072D24]/10 text-[#072D24]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2923] uppercase tracking-wide">
                  ১০০% খাঁটি পণ্য
                </h4>
                <p className="text-[11px] text-zinc-500">ল্যাব টেস্টে পরীক্ষিত ও প্রাকৃতিক</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E87121]/10 text-[#E87121]">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2923] uppercase tracking-wide">
                  দ্রুততম ডেলিভারি
                </h4>
                <p className="text-[11px] text-zinc-500">ঢাকা সিটিতে ২৪ ঘণ্টায় পৌঁছাবে</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#072D24]/10 text-[#072D24]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2923] uppercase tracking-wide">
                  ক্যাশ অন ডেলিভারি
                </h4>
                <p className="text-[11px] text-zinc-500">পণ্য দেখে মূল্য পরিশোধের সুবিধা</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E87121]/10 text-[#E87121]">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2923] uppercase tracking-wide">
                  সহজ রিটার্ন পলিসি
                </h4>
                <p className="text-[11px] text-zinc-500">সন্তুষ্ট না হলে ৭ দিনে ফেরত</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={baseHref} className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#072D24] text-white">
                <svg className="h-5 w-5 text-[#E87121]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <span className="font-black text-lg tracking-tight text-[#072D24]">
                SHUDDHA<span className="text-[#E87121]">.</span>HARVEST
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-zinc-600 max-w-sm">
              শুদ্ধ হারভেস্ট — বিশুদ্ধ ও অর্গানিক খাদ্যপণ্যের বিশ্বস্ত নাম। আমরা সরাসরি কৃষক ও নিজস্ব তত্ত্বাবধানে প্রস্তুত ঘি, সুন্দরবনের মধু, সরিষার তেল ও খাঁটি মশলা পৌঁছে দিচ্ছি আপনার দোড়গোড়ায়।
            </p>

            <div className="space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#E87121]" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#E87121]" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#E87121]" />
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-[#072D24]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E9E4DC] hover:text-[#E87121] transition-colors cursor-pointer" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E9E4DC] hover:text-[#E87121] transition-colors cursor-pointer" aria-label="Instagram">
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E9E4DC] hover:text-[#E87121] transition-colors cursor-pointer" aria-label="YouTube">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#072D24] mb-3">
              ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`${baseHref}/categories/${c.slug}`}
                    className="hover:text-[#E87121] transition-colors"
                  >
                    {c.name} ({c.bengaliName})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#072D24] mb-3">
              কাস্টমার কেয়ার
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link href={`${baseHref}/products`} className="hover:text-[#E87121] transition-colors">
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/cart`} className="hover:text-[#E87121] transition-colors">
                  শপিং কার্ট
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/checkout`} className="hover:text-[#E87121] transition-colors">
                  চেকআউট
                </Link>
              </li>
              <li>
                <Link href={`${baseHref}/admin`} className="hover:text-[#E87121] transition-colors">
                  এডমিন প্যানেল
                </Link>
              </li>
            </ul>
          </div>

          {/* App Download & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#072D24] mb-3">
              মোবাইল অ্যাপ
            </h4>
            <p className="text-xs text-zinc-500">
              শীঘ্রই আসছে আমাদের অ্যান্ড্রয়েড ও আইওএস মোবাইল অ্যাপ্লিকেশন!
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-black px-3.5 py-2 text-white">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.198-.184-.31-.44-.31-.724V2.538c0-.284.112-.54.31-.724zM15.207 13.414l2.122 2.122-12.87 7.43 10.748-9.552zm0-2.828L4.459 1.034l12.87 7.43-2.122 2.122zm1.414 1.414l3.197 1.846c.928.536.928 1.41 0 1.946l-3.197 1.846-2.122-2.122 2.122-2.122z" />
                </svg>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider opacity-70">Get it on</span>
                  <span className="block text-[11px] font-bold">Google Play</span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-black px-3.5 py-2 text-white">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.11 1.84-.97 2.95 1.08.08 2.12-.55 2.78-1.29" />
                </svg>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider opacity-70">Download on the</span>
                  <span className="block text-[11px] font-bold">App Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment strip */}
        <div className="mt-10 border-t border-[#ECE6DC] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-zinc-500">
            <span className="font-semibold text-zinc-700">Accepted Payment Methods:</span>
            <span className="rounded-md bg-white px-2 py-1 border border-zinc-200 font-bold text-pink-600">bKash</span>
            <span className="rounded-md bg-white px-2 py-1 border border-zinc-200 font-bold text-orange-600">Nagad</span>
            <span className="rounded-md bg-white px-2 py-1 border border-zinc-200 font-bold text-purple-600">Rocket</span>
            <span className="rounded-md bg-white px-2 py-1 border border-zinc-200 font-bold text-blue-800">VISA</span>
            <span className="rounded-md bg-white px-2 py-1 border border-zinc-200 font-bold text-red-600">MasterCard</span>
            <span className="rounded-md bg-white px-2 py-1 border border-zinc-200 font-bold text-emerald-800">Cash on Delivery</span>
          </div>

          <div className="text-zinc-500 text-center md:text-right">
            <span>&copy; {new Date().getFullYear()} Shuddha Harvest. All rights reserved.</span>
            <span className="ml-2">
              Powered by{' '}
              <Link href="/" className="font-semibold text-[#072D24] underline hover:text-[#E87121]">
                OneDot ABM
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
