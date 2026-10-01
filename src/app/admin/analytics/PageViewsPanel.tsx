import React from 'react';
import type { PageViewStats } from '@/lib/services/trackingService';

const label = (path: string) =>
  path === '/' ? 'Home' : path.split('/').filter(Boolean).map((s) => s.replace(/-/g, ' ')).join(' › ');

export function PageViewsPanel({ stats }: { stats: PageViewStats }) {
  const max = Math.max(1, ...stats.daily.map((d) => d.views));
  const delta = stats.prev7 ? Math.round(((stats.last7 - stats.prev7) / stats.prev7) * 100) : null;
  const card = 'p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs';
  const cardLabel = 'text-xs font-semibold uppercase tracking-wider text-[#858585]';

  const list = (title: string, rows: { path: string; views: number }[], empty: string) => (
    <div className={card}>
      <h3 className="text-sm font-bold text-[#111111] mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-xs text-[#858585]">{empty}</p>
      ) : (
        <ul className="divide-y divide-[#F0F0ED]">
          {rows.map((r) => (
            <li key={r.path} className="flex items-center justify-between gap-3 py-2 text-xs">
              <span className="min-w-0">
                <span className="block text-[#111111] capitalize truncate">{label(r.path)}</span>
                <span className="block text-[#858585] font-mono truncate">{r.path}</span>
              </span>
              <span className="font-mono font-semibold text-[#111111] shrink-0">{r.views.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[#111111]">Website Traffic</h2>
        <p className="text-xs text-[#555555] mt-0.5">Real page view counts from your site visitors.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={card}>
          <p className={cardLabel}>Total Views</p>
          <p className="text-2xl font-bold text-[#111111] mt-2">{stats.total.toLocaleString()}</p>
          <p className="text-xs text-[#555555] mt-1">All time</p>
        </div>
        <div className={card}>
          <p className={cardLabel}>Last 7 Days</p>
          <p className="text-2xl font-bold text-[#111111] mt-2">{stats.last7.toLocaleString()}</p>
          <p className="text-xs text-[#555555] mt-1">
            {delta === null ? 'No earlier week to compare' : `${delta >= 0 ? '+' : ''}${delta}% vs previous 7d`}
          </p>
        </div>
        <div className={card}>
          <p className={cardLabel}>Last 30 Days</p>
          <p className="text-2xl font-bold text-[#111111] mt-2">{stats.last30.toLocaleString()}</p>
          <p className="text-xs text-[#555555] mt-1">Rolling month</p>
        </div>
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-[#111111] mb-4">Views — Last 14 Days</h3>
        <div className="flex items-end gap-1.5 h-32">
          {stats.daily.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full gap-1" title={`${d.day}: ${d.views}`}>
              <span className="text-[9px] font-mono text-[#858585]">{d.views}</span>
              <div className="w-full rounded-t bg-[#1400FF]" style={{ height: `${Math.max(2, (d.views / max) * 100)}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[#858585] mt-2">
          <span>{stats.daily[0]?.day}</span>
          <span>{stats.daily[stats.daily.length - 1]?.day}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list('Top Pages', stats.topPages, 'No views recorded yet.')}
        {list('Blog Post Views', stats.blogPosts, 'No blog views recorded yet.')}
      </div>
    </section>
  );
}
