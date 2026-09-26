'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Sparkles, CheckCircle2, Shield, Leaf, Smile } from 'lucide-react';
import { StoreHeader } from '../../_components/StoreHeader';
import { StoreFooter } from '../../_components/StoreFooter';
import { BreadcrumbBanner } from '../../_components/BreadcrumbBanner';

export default function AboutPage() {
  const base = '/webapp-demo/ecommerce/demo-04';

  return (
    <div className="flex-1 flex flex-col bg-white">
      <StoreHeader />

      <BreadcrumbBanner
        title="About WonderSprout"
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full space-y-20">
        {/* Mission Story Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFEFE4]">
            <Image
              src="/demo-assets/ecommerce/demo-04/classroom.jpg"
              alt="WonderSprout learning environment"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-black uppercase tracking-wider text-[#EB1551] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Our Pedagogic Philosophy</span>
            </span>
            <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A] leading-tight">
              Cultivating Young Curiosity Through Hands-On Discovery
            </h2>
            <p className="text-sm sm:text-base text-[#6B6B84] leading-relaxed font-nunito">
              WonderSprout was founded by Montessori educators who observed that modern children were inundated with flashing, battery-powered screens that induce passive consumption rather than active problem-solving.
            </p>
            <p className="text-sm sm:text-base text-[#6B6B84] leading-relaxed font-nunito">
              We set out to engineer learning materials crafted exclusively from European beechwood, organic wheat flour dough, and natural dyes. Every weight, contour, and sensory click is tested for physical intuition.
            </p>
            <div className="pt-2">
              <Link href={`${base}/collection`} className="ws-btn-primary px-8 py-3.5 text-xs uppercase tracking-wider font-extrabold shadow-md inline-block">
                Explore Our Collection &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="bg-[#FFEFE4] p-8 sm:p-12 rounded-[40px] border border-[#F7941E]/20 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-bubblegum text-3xl sm:text-4xl text-[#0A6375]">
              The Four WonderSprout Pillars
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B84] font-nunito">
              Every toy we release is measured strictly against four developmental benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf className="w-6 h-6 text-[#1CBBB4]" />,
                title: 'Sustainable Woods',
                desc: '100% FSC-certified beechwood and pine with non-toxic organic vegetable finishes.',
              },
              {
                icon: <Smile className="w-6 h-6 text-[#F7941E]" />,
                title: 'Self-Correction',
                desc: 'Toys designed so children intuitively know when a shape fits or a gear aligns.',
              },
              {
                icon: <Shield className="w-6 h-6 text-[#EB1551]" />,
                title: 'Certified Safe',
                desc: 'Rigorous EN71, ASTM F963, and CPSIA certified testing with zero phthalates.',
              },
              {
                icon: <Heart className="w-6 h-6 text-[#FFDA43]" />,
                title: 'Heirloom Longevity',
                desc: 'Built to withstand decades of classroom play and be passed down to siblings.',
              },
            ].map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl space-y-3 shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEFE4] flex items-center justify-center">
                  {p.icon}
                </div>
                <h4 className="font-bubblegum text-xl text-[#0F172A]">{p.title}</h4>
                <p className="text-xs text-[#6B6B84] font-nunito leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
