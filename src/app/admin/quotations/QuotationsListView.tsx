'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, FileText, Plus, Search, TrendingUp } from 'lucide-react';
import type { QuotationSummary } from '@/lib/services/quotationService';
import { QUOTATION_STATUSES, QUOTATION_STATUS_META, quotationStatusMeta } from '@/lib/quotationMeta';
import { formatMoney, formatDate } from '@/lib/invoiceMeta';

export function QuotationsListView({
  quotations,
  status,
  query,
}: {
  quotations: QuotationSummary[];
  status: string;
  query: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(query);
  const [, startTransition] = useTransition();

  function load(nextStatus: string, nextQuery: string) {
    const p = new URLSearchParams();
    if (nextStatus !== 'all') p.set('status', nextStatus);
    if (nextQuery.trim()) p.set('q', nextQuery.trim());
    startTransition(() => router.push(`/admin/quotations${p.size ? `?${p}` : ''}`));
  }

  // Never add across currencies.
  const sum = (pred: (q: QuotationSummary) => boolean) => {
    const by: Record<string, number> = {};
    for (const q of quotations) if (pred(q)) by[q.currency] = (by[q.currency] ?? 0) + q.total;
    return Object.entries(by).sort(([a], [b]) => a.localeCompare(b));
  };
  const won = (q: QuotationSummary) => q.status === 'accepted' || q.status === 'converted';
  const pipeline = sum((q) => q.status !== 'rejected' && q.status !== 'expired');
  const wonSum = sum(won);
  const pending = quotations.filter((q) => q.status === 'draft' || q.status === 'sent').length;
  const decided = quotations.filter((q) => won(q) || q.status === 'rejected' || q.status === 'expired').length;
  const winRate = decided ? Math.round((quotations.filter(won).length / decided) * 100) : 0;

  const money = (rows: [string, number][], cls: string) =>
    rows.length === 0 ? (
      <p className="text-xl font-bold font-mono">—</p>
    ) : (
      rows.map(([cur, v]) => (
        <p key={cur} className={`text-lg font-bold font-mono leading-snug ${cls}`}>
          {formatMoney(v, cur)}
        </p>
      ))
    );
  const card = 'p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-xs';
  const cardLabel = 'text-[10px] font-mono uppercase text-[#858585] tracking-wider font-semibold mb-1';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Quotations</h1>
          <p className="text-sm text-[#858585] mt-1">Project estimates, proposals &amp; scope pricing</p>
        </div>
        <button
          onClick={() => router.push('/admin/quotations/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Quotation
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={card}>
          <p className={`${cardLabel} flex items-center justify-between`}>
            Pipeline Value <TrendingUp className="w-3.5 h-3.5 text-[#1400FF]" />
          </p>
          {money(pipeline, 'text-[#111111]')}
          <p className="text-[11px] text-[#858585] mt-0.5">{quotations.length} total quotes</p>
        </div>
        <div className={card}>
          <p className={`${cardLabel} flex items-center justify-between`}>
            Won / Accepted <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </p>
          {money(wonSum, 'text-emerald-600')}
          <p className="text-[11px] text-[#858585] mt-0.5">{quotations.filter(won).length} quotes closed</p>
        </div>
        <div className={card}>
          <p className={cardLabel}>Pending Quotes</p>
          <p className="text-xl font-bold text-[#111111]">{pending}</p>
          <p className="text-[11px] text-[#858585] mt-0.5">Drafts &amp; awaiting reply</p>
        </div>
        <div className={card}>
          <p className={cardLabel}>Win Rate</p>
          <p className="text-xl font-bold text-[#111111]">{winRate}%</p>
          <p className="text-[11px] text-[#858585] mt-0.5">Of decided quotes</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(status, search);
          }}
          className="relative flex-1"
        >
          <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search number, title, client, company…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
          />
        </form>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', ...QUOTATION_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => load(s, search)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                status === s ? 'bg-[#111111] text-white' : 'bg-[#F0F0ED] text-[#666666] hover:bg-[#E5E5E2] hover:text-[#111111]'
              }`}
            >
              {s === 'all' ? 'All' : QUOTATION_STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      {quotations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#E5E5E2] text-[#858585]">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No quotations found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {quotations.map((q) => {
            const m = quotationStatusMeta(q.status);
            return (
              <button
                key={q.id}
                onClick={() => router.push(`/admin/quotations/${q.id}`)}
                className="w-full text-left bg-white rounded-xl border border-[#E5E5E2] p-4 hover:border-[#1400FF]/40 hover:shadow-xs transition-all flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-[#111111] font-mono">{q.quotation_number}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${m.className}`}>{m.label}</span>
                  </div>
                  <p className="text-sm text-[#111111] truncate">{q.title}</p>
                  <p className="text-xs text-[#858585] truncate">
                    {[q.client_name, q.client_company, q.client_email].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-xs text-[#858585]">
                    Issued {formatDate(q.issue_date)} · Valid until {formatDate(q.expiry_date)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-sm font-bold text-[#111111] font-mono">{formatMoney(q.total, q.currency)}</p>
                  <ChevronRight className="w-4 h-4 text-[#858585] group-hover:text-[#1400FF]" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
