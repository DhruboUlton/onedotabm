'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';
import { WonderSproutLogo, CloudTopDivider, WavyDivider, SunDoodle } from './Doodles';

export function StoreFooter() {
  const { settings } = useStore();
  const base = '/webapp-demo/ecommerce/demo-04';

  const galleryImages = [
    { src: '/demo-assets/ecommerce/demo-04/about-kids.jpg', alt: 'Kids learning blocks' },
    { src: '/demo-assets/ecommerce/demo-04/classroom.jpg', alt: 'Montessori classroom' },
    { src: '/demo-assets/ecommerce/demo-04/rainbow-tower.jpg', alt: 'Rainbow tower' },
    { src: '/demo-assets/ecommerce/demo-04/stem-robot.jpg', alt: 'STEM robot' },
    { src: '/demo-assets/ecommerce/demo-04/busy-board-house.jpg', alt: 'Busy board house' },
    { src: '/demo-assets/ecommerce/demo-04/solar-orrery.jpg', alt: 'Solar orrery' },
  ];

  return (
    <footer className="relative bg-[#0A6375] text-white pt-16 pb-28 sm:pb-32 overflow-hidden mt-16">
      {/* Cloud-topped wave divider at top */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[98%] overflow-hidden pointer-events-none text-[#0A6375]">
        <CloudTopDivider className="w-full h-16 sm:h-24 fill-[#0A6375]" />
      </div>

      {/* Floating Smiling Sun Doodle */}
      <div className="absolute top-6 right-10 sm:right-24 hidden md:block opacity-90 animate-cloud-drift pointer-events-none">
        <SunDoodle className="w-16 h-16" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top 4 Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#1CBBB4] text-[#0A6375] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white font-nunito">Free Shipping</h5>
              <p className="text-xs text-white/70">On all orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#F7941E] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white font-nunito">Certified Safe</h5>
              <p className="text-xs text-white/70">Non-toxic EN71 & ASTM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#EB1551] text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white font-nunito">30-Day Returns</h5>
              <p className="text-xs text-white/70">100% Happiness guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#FFDA43] text-[#0A6375] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white font-nunito">Made with Care</h5>
              <p className="text-xs text-white/70">Sustainably sourced woods</p>
            </div>
          </div>
        </div>

        {/* Main 4 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-sm">
              <WonderSproutLogo />
            </div>
            <p className="text-sm text-white/80 leading-relaxed font-nunito">
              WonderSprout crafts heirloom-grade wooden educational toys and Montessori materials designed to spark self-guided curiosity, tactile development, and joy.
            </p>
            <div className="space-y-2 text-xs text-white/85 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F7941E] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1CBBB4] shrink-0" />
                <a href={`tel:${settings.supportPhone}`} className="hover:text-[#FFEFE4] font-bold">
                  {settings.supportPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#EB1551] shrink-0" />
                <a href={`mailto:${settings.supportEmail}`} className="hover:text-[#FFEFE4]">
                  {settings.supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Learning Information */}
          <div className="space-y-3">
            <h4 className="font-bubblegum text-xl text-[#FFDA43] tracking-wide">
              Learning Programs
            </h4>
            <ul className="space-y-2 text-sm text-white/80 font-nunito">
              <li>
                <Link href={`${base}/about`} className="hover:text-[#1CBBB4] transition-colors">
                  Montessori Pedagogy
                </Link>
              </li>
              <li>
                <Link href={`${base}/collection`} className="hover:text-[#1CBBB4] transition-colors">
                  Sensory & Motor Kits
                </Link>
              </li>
              <li>
                <Link href={`${base}/collection`} className="hover:text-[#1CBBB4] transition-colors">
                  STEM Robotics & Gears
                </Link>
              </li>
              <li>
                <Link href={`${base}/about`} className="hover:text-[#1CBBB4] transition-colors">
                  Preschool Infrastructure
                </Link>
              </li>
              <li>
                <Link href={`${base}/faq`} className="hover:text-[#1CBBB4] transition-colors">
                  Teacher Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href={`${base}/contact`} className="hover:text-[#1CBBB4] transition-colors">
                  Bulk Orders for Schools
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Help */}
          <div className="space-y-3">
            <h4 className="font-bubblegum text-xl text-[#FFDA43] tracking-wide">
              Parent Support
            </h4>
            <ul className="space-y-2 text-sm text-white/80 font-nunito">
              <li>
                <Link href={`${base}/faq`} className="hover:text-[#1CBBB4] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href={`${base}/collection`} className="hover:text-[#1CBBB4] transition-colors">
                  Age-by-Age Toy Finder
                </Link>
              </li>
              <li>
                <Link href={`${base}/contact`} className="hover:text-[#1CBBB4] transition-colors">
                  Track Demo Order
                </Link>
              </li>
              <li>
                <Link href={`${base}/faq`} className="hover:text-[#1CBBB4] transition-colors">
                  Shipping & Free Returns
                </Link>
              </li>
              <li>
                <Link href={`${base}/contact`} className="hover:text-[#1CBBB4] transition-colors">
                  Contact Our Educators
                </Link>
              </li>
              <li>
                <Link href={`${base}/admin`} className="text-[#FFDA43] font-bold hover:underline">
                  Merchant Admin Console &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Our Galleries */}
          <div className="space-y-3">
            <h4 className="font-bubblegum text-xl text-[#FFDA43] tracking-wide">
              Our Play Galleries
            </h4>
            <p className="text-xs text-white/70">
              Moments of wonder captured in Montessori classrooms and homes.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-white/20 group cursor-pointer"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wavy White Divider */}
        <div className="py-4">
          <WavyDivider className="w-full text-white/40" />
        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/70 font-nunito">
          <div>
            &copy; {new Date().getFullYear()} {settings.brandName}. Inspiring early minds. All rights reserved.
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-semibold text-white">
              🔒 Safe 256-Bit Checkout
            </span>
            <div className="flex items-center gap-2 text-white/80 font-bold">
              <span>VISA</span>
              <span>•</span>
              <span>MC</span>
              <span>•</span>
              <span>AMEX</span>
              <span>•</span>
              <span>PAYPAL</span>
              <span>•</span>
              <span>APPLE PAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
