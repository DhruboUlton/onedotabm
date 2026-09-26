'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { StoreHeader } from '../../_components/StoreHeader';
import { StoreFooter } from '../../_components/StoreFooter';
import { BreadcrumbBanner } from '../../_components/BreadcrumbBanner';

export default function BlogPage() {
  const base = '/webapp-demo/ecommerce/demo-04';

  const articles = [
    {
      id: 'art-01',
      title: 'Why Toddlers Thrive with Natural Wooden Toys Over Plastic Lights',
      slug: 'why-toddlers-thrive-with-wooden-toys',
      author: 'Sarah Michelle (AMI Lead)',
      date: 'September 22, 2026',
      tags: ['Montessori', 'Sensory Play', 'Brain Development'],
      image: '/demo-assets/ecommerce/demo-04/about-kids.jpg',
      excerpt:
        'Electronic toys with flashing LEDs and synthesized voices often trigger cognitive overstimulation. Natural beechwood invites self-directed inquiry and builds tactile proprioception.',
    },
    {
      id: 'art-02',
      title: '5 Maria Montessori Principles You Can Apply at Home This Weekend',
      slug: '5-montessori-principles-at-home',
      author: 'Julian Mercer',
      date: 'September 15, 2026',
      tags: ['Home Setup', 'Independence'],
      image: '/demo-assets/ecommerce/demo-04/classroom.jpg',
      excerpt:
        'From organizing low wooden shelves to providing accessible water pitchers, empowering autonomy starts with intentional, child-proportional environments.',
    },
    {
      id: 'art-03',
      title: 'Teaching Pre-K Arithmetic Visually: The Magic of the Counting Abacus',
      slug: 'teaching-pre-k-arithmetic-visually',
      author: 'Emma Watson',
      date: 'September 08, 2026',
      tags: ['Math Intuition', 'STEM Tools'],
      image: '/demo-assets/ecommerce/demo-04/abacus-board.jpg',
      excerpt:
        'Abstract mathematical numerals become concrete concepts when toddlers can physically feel the difference between two heavy beads and ten sliding counters.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      <StoreHeader />

      <BreadcrumbBanner
        title="Parenting & Montessori Journal"
        breadcrumbs={[{ label: 'Blog' }]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main 8 Cols: Articles */}
          <div className="lg:col-span-8 space-y-10">
            {articles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FFEFE4]">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {art.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-[#0A6375]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-[#6B6B84] font-nunito">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#1CBBB4]" />
                      <span>{art.author}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#F7941E]" />
                      <span>{art.date}</span>
                    </span>
                  </div>

                  <h2 className="font-bubblegum text-2xl sm:text-3xl text-[#0F172A] group-hover:text-[#EB1551] transition-colors leading-snug">
                    {art.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#6B6B84] font-nunito leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-[#EB1551] group-hover:text-[#1CBBB4] transition-colors ws-wavy-underline">
                      <span>Read Pedagogic Guide</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right 4 Cols: Sidebar */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Search / Newsletter widget */}
            <div className="bg-[#FFEFE4] p-6 rounded-3xl border border-[#F7941E]/20 space-y-3">
              <span className="text-xs font-bold text-[#EB1551] uppercase tracking-wider">
                Weekly Pedagogic Insights
              </span>
              <h4 className="font-bubblegum text-2xl text-[#0A6375]">
                WonderSprout Newsletter
              </h4>
              <p className="text-xs text-[#6B6B84] font-nunito leading-relaxed">
                Receive Maria Montessori classroom activity plans directly to your inbox every Friday morning.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-2 pt-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#1CBBB4]"
                />
                <button
                  type="submit"
                  className="w-full ws-btn-primary py-2.5 text-xs uppercase tracking-wider font-extrabold"
                >
                  Join 12,000+ Parents
                </button>
              </form>
            </div>

            {/* Popular Topics */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A6375]">
                Educational Categories
              </h4>
              <div className="space-y-1.5 text-xs font-bold font-nunito text-[#0F172A]">
                {[
                  { name: 'Montessori Home Environment', count: 14 },
                  { name: 'Motor Skills & Grip Training', count: 9 },
                  { name: 'STEM Robotics for Toddlers', count: 8 },
                  { name: 'Sensory Regulation & Clay', count: 6 },
                  { name: 'Classroom Infrastructure', count: 5 },
                ].map((cat, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-2 rounded-xl hover:bg-[#FFEFE4] cursor-pointer transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-slate-400">({cat.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
