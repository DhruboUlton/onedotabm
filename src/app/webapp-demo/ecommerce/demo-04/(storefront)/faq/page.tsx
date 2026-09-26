'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, MapPin, Phone, Mail, HelpCircle } from 'lucide-react';
import { StoreHeader } from '../../_components/StoreHeader';
import { StoreFooter } from '../../_components/StoreFooter';
import { BreadcrumbBanner } from '../../_components/BreadcrumbBanner';
import { useStore } from '../../_context/StoreContext';

export default function FaqPage() {
  const { settings } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What age group are WonderSprout toys designed for?',
      a: 'Our catalogue ranges from 18-month sensory grasping & stacking toys up to 16-year architectural puzzle challenges. Each product page features explicit recommended age brackets and fine motor skill focus areas.',
    },
    {
      q: 'Are your paints and finishes safe for mouthing toddlers?',
      a: 'Yes, 100%. All paints are food-grade, water-based non-toxic stains certified to EN71 and ASTM F963 standards. They contain zero lead, phthalates, BPA, or chemical lacquers.',
    },
    {
      q: 'Do you offer bulk discounts for Montessori schools and daycares?',
      a: 'Yes! We supply hundreds of certified preschools and learning pods across the country. Click "Enquire For Schools" in our header or visit our Contact page to receive institutional pricing.',
    },
    {
      q: 'What is your shipping timeframe and return policy?',
      a: 'Orders ship same-day from Austin, TX and arrive within 2–4 business days. We provide a 30-day no-questions-asked refund policy. If your child doesn’t love the toy, return shipping is completely free.',
    },
    {
      q: 'How should I clean and disinfect wooden educational toys?',
      a: 'Wipe wooden toys with a clean, slightly damp cloth dipped in mild warm soapy water, then air dry. Avoid submerging wooden toys in water or using harsh chemical disinfectants.',
    },
    {
      q: 'Where do you source your lumber?',
      a: 'We harvest exclusively from certified FSC-managed European beechwood and sustainable pine forests. For every toy manufactured, a native sapling is planted in community learning orchards.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      <StoreHeader />

      <BreadcrumbBanner
        title="Frequently Asked Questions"
        breadcrumbs={[{ label: 'FAQs & Help' }]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Cols: Accordion Questions */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bubblegum text-xl sm:text-2xl text-[#0F172A] hover:text-[#EB1551] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-[#1CBBB4] transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#EB1551]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 font-nunito text-xs sm:text-sm text-[#6B6B84] leading-relaxed border-t border-slate-100 bg-[#FFEFE4]/30 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right 5 Cols: Photo & Address Card */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-xl border-4 border-[#FFEFE4] bg-white sticky top-24">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/demo-assets/ecommerce/demo-04/classroom.jpg"
                alt="WonderSprout Learning Center"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-[#0A6375] text-white p-6 space-y-4">
              <h4 className="font-bubblegum text-2xl text-[#FFDA43]">
                WonderSprout Support Atelier
              </h4>
              <p className="text-xs text-white/80 font-nunito leading-relaxed">
                Have questions about our wooden developmental sets or custom classroom curricula?
              </p>
              <div className="space-y-2.5 text-xs text-white/90 font-nunito pt-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#F7941E] shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#1CBBB4] shrink-0" />
                  <a href={`tel:${settings.supportPhone}`} className="hover:underline font-bold">
                    {settings.supportPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#EB1551] shrink-0" />
                  <a href={`mailto:${settings.supportEmail}`} className="hover:underline">
                    {settings.supportEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
