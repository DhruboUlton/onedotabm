'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../../_context/StoreContext';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const { articles } = useStore();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          Editorial & Research
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          Kinetic Tech Journal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          In-depth technical architecture breakdowns, creator desk setups, and acoustic engineering analysis.
        </p>
      </div>

      {/* Featured Article Top */}
      {articles.length > 0 && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 group">
          <div className="lg:col-span-7 relative h-72 lg:h-[420px] bg-slate-800">
            <Image
              src={articles[0].coverImage}
              alt={articles[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                {articles[0].category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 leading-snug">
                {articles[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {articles[0].excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{articles[0].author}</div>
                <div className="text-[11px]">{articles[0].authorRole}</div>
              </div>
              <div className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                <span>{articles[0].readTime}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of remaining articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {articles.slice(1).map((art) => (
          <article
            key={art.id}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                <Image
                  src={art.coverImage}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 text-white backdrop-blur-md">
                  {art.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>{art.date}</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{art.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
