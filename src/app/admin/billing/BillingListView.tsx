'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Receipt, RefreshCw, Search } from 'lucide-react';
import type { InvoiceSummary } from '@/lib/services/invoiceService';
import { INVOICE_STATUSES, INVOICE_STATUS_META, invoiceStatusMeta, formatMoney, formatDate } from '@/lib/invoiceMeta';

export function BillingListView({
  invoices,
  status,
  query,
}: {
  invoices: InvoiceSummary[];
  status: string;
  query: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(query);
  const [isPending, startTransition] = useTransition();

  function load(nextStatus: string, nextQuery: string) {
    const p = new URLSearchParams();
    if (nextStatus !== 'all') p.set('status', nextStatus);
    if (nextQuery.trim()) p.set('q', nextQuery.trim());
    startTransition(() => router.push(`/admin/billing${p.size ? `?${p}` : ''}`));
  }

  // Money is never added across currencies. Drafts and cancelled invoices are
  // not money anyone owes, so they stay out of the totals.
  const byCurrency: Record<string, { billed: number; paid: number; outstanding: number }> = {};
  for (const inv of invoices) {
    if (inv.status === 'draft' || inv.status === 'cancelled') continue;
    const cur = (inv.currency || 'BDT').toUpperCase();
    byCurrency[cur] ??= { billed: 0, paid: 0, outstanding: 0 };
    byCurrency[cur].billed += inv.total;
    byCurrency[cur].paid += inv.amount_paid;
    byCurrency[cur].outstanding += Math.max(0, inv.total - inv.amount_paid);
  }
  const currencies = Object.keys(byCurrency).sort();

  const stat = (label: string, render: (cur: string) => React.ReactNode) => (
    <div className="p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
      <p className="text-[10px] font-mono uppercase text-[#858585] tracking-wider font-semibold mb-1">{label}</p>
      {currencies.length === 0 ? (
        <p className="text-base font-bold text-[#111111] font-mono">—</p>
      ) : (
        currencies.map((cur) => (
          <p key={cur} className="text-base font-bold font-mono leading-snug">
            {render(cur)}
          </p>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Billing</h1>
          <p className="text-sm text-[#858585] mt-1">Invoices &amp; payments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => load(status, search)}
            aria-label="Refresh"
            className="p-2.5 rounded-lg border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#1400FF]"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => router.push('/admin/billing/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {invoices.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
            <p className="text-[10px] font-mono uppercase text-[#858585] tracking-wider font-semibold mb-1">Invoices</p>
            <p className="text-xl font-bold text-[#111111]">{invoices.length}</p>
          </div>
          {stat('Total Billed', (cur) => (
            <span className="text-[#1400FF]">{formatMoney(byCurrency[cur].billed, cur)}</span>
          ))}
          {stat('Total Paid', (cur) => (
            <span className="text-emerald-600">{formatMoney(byCurrency[cur].paid, cur)}</span>
          ))}
          {stat('Outstanding', (cur) => (
            <span className={byCurrency[cur].outstanding > 0 ? 'text-rose-600' : 'text-emerald-600'}>
              {formatMoney(byCurrency[cur].outstanding, cur)}
            </span>
          ))}
        </div>
      )}

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
            placeholder="Search client, email, phone, invoice ID…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
          />
        </form>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', ...INVOICE_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => load(s, search)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                status === s ? 'bg-[#111111] text-white' : 'bg-[#F0F0ED] text-[#666666] hover:bg-[#E5E5E2] hover:text-[#111111]'
              }`}
            >
              {s === 'all' ? 'All' : INVOICE_STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#E5E5E2] text-[#858585]">
          <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No invoices found</p>
          <p className="text-xs mt-1">
            {status !== 'all' || query ? 'Try changing filters' : 'Create your first invoice above'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => {
            const m = invoiceStatusMeta(inv.status);
            const balance = inv.total - inv.amount_paid;
            return (
              <button
                key={inv.id}
                onClick={() => router.push(`/admin/billing/${inv.id}`)}
                className="w-full text-left bg-white rounded-xl border border-[#E5E5E2] p-4 hover:border-[#1400FF]/40 hover:shadow-xs transition-all flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-[#111111] font-mono">{inv.invoice_number}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${m.className}`}>{m.label}</span>
                  </div>
                  <p className="text-xs text-[#555555] truncate">
                    {[inv.client_name, inv.client_company].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-xs text-[#858585] truncate">
                    {inv.client_email} · Due {formatDate(inv.due_date)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#111111] font-mono">{formatMoney(inv.total, inv.currency)}</p>
                    {inv.status === 'paid' ? (
                      <p className="text-xs text-emerald-600">Fully Paid</p>
                    ) : (
                      balance > 0 &&
                      inv.status !== 'draft' && (
                        <p className="text-xs text-rose-600 font-mono">Bal: {formatMoney(balance, inv.currency)}</p>
                      )
                    )}
                  </div>
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
