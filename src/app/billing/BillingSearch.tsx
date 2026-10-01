'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Loader2, Receipt, Search } from 'lucide-react';
import type { InvoiceSummary } from '@/lib/services/invoiceService';
import { formatMoney, formatDate, invoiceStatusMeta } from '@/lib/invoiceMeta';
import { searchInvoicesAction } from './actions';

export function BillingSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<InvoiceSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 3) return;
    setLoading(true);
    setError(null);
    const res = await searchInvoicesAction(query.trim());
    setLoading(false);
    setResults(res.results);
    setError(res.error ?? null);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xs p-6 sm:p-8 mb-4">
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Invoice ID, email address, or phone number…"
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] focus:outline-none focus:border-[#1400FF] focus:bg-white"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading || query.trim().length < 3}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[#1400FF] hover:bg-[#0F00CC] rounded-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Searching…' : 'Find Invoice'}
        </button>
        <p className="text-[11px] text-[#858585] text-center mt-3">Your full invoice number, or the exact email / phone on the invoice</p>
      </form>

      {results && !loading && (
        <div className="space-y-3">
          {error ? (
            <div className="bg-white rounded-2xl border border-[#E5E5E2] p-8 text-center">
              <Receipt className="w-8 h-8 text-rose-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-rose-600">{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E5E2] p-8 text-center">
              <Receipt className="w-8 h-8 text-[#D4D4D0] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#555555]">No invoices found</p>
              <p className="text-xs text-[#858585] mt-1">Enter the full invoice number, or the exact email / phone on the invoice.</p>
            </div>
          ) : (
            results.map((r) => {
              const m = invoiceStatusMeta(r.status);
              const balance = r.total - r.amount_paid;
              return (
                <button
                  key={r.invoice_number}
                  onClick={() => router.push(`/billing/${r.invoice_number}`)}
                  className="w-full bg-white rounded-2xl border border-[#E5E5E2] p-4 sm:p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[#111111] font-mono">{r.invoice_number}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${m.className}`}>{m.label}</span>
                    </div>
                    <p className="text-xs text-[#555555]">{[r.client_name, r.client_company].filter(Boolean).join(' · ')}</p>
                    <p className="text-xs text-[#858585] mt-0.5">Due {formatDate(r.due_date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#111111] font-mono">{formatMoney(r.total, r.currency)}</p>
                    {balance > 0 && <p className="text-xs text-rose-600 font-mono">Balance: {formatMoney(balance, r.currency)}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#858585] shrink-0" />
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
