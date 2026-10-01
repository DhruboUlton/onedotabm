import React from 'react';
import Image from 'next/image';
import type { QuotationDetail } from '@/lib/services/quotationService';
import type { CompanySettingsRecord } from '@/types/database';
import { formatMoney, formatDate } from '@/lib/invoiceMeta';
import { quotationStatusMeta } from '@/lib/quotationMeta';

const label = 'text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block';

function Block({ title, children }: { title: string; children: string }) {
  if (!children.trim()) return null;
  return (
    <div className="mt-8 pt-6 border-t border-[#E5E5E2]" data-print-keep>
      <span className={`${label} mb-2`}>{title}</span>
      <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line">{children}</p>
    </div>
  );
}

export function QuotationDocument({ quotation: q, company }: { quotation: QuotationDetail; company: CompanySettingsRecord }) {
  const cur = q.currency || 'BDT';
  const status = quotationStatusMeta(q.status);
  return (
    <div data-print-document className="bg-white border border-[#E5E5E2] shadow-sm overflow-hidden rounded-2xl">
      <div className="px-6 sm:px-14 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white border border-[#E5E5E2] flex items-center justify-center">
                <Image src="/logo.png" alt={`${company.company_name} logo`} width={28} height={28} className="object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1400FF]">{company.company_name}</span>
            </div>
            <div className="mt-2 text-[11px] leading-relaxed text-[#555555]">
              {company.tagline && <div className="text-[#111111]">{company.tagline}</div>}
              {company.email && <div>{company.email}</div>}
              {company.address && <div>{company.address}</div>}
            </div>
          </div>
          <div className="sm:text-right">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">QUOTATION</h2>
            <div className="font-mono text-sm text-[#1400FF] mt-1">{q.quotation_number}</div>
            <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border ${status.className}`}>
              {status.label}
            </span>
          </div>
        </div>

        <h3 className="mt-8 text-lg font-bold text-[#111111]">{q.title}</h3>

        <div className="mt-6 pt-6 border-t border-[#E5E5E2] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className={`${label} mb-1.5`}>Prepared for</span>
            <div className="text-sm font-bold text-[#111111]">{q.client_name}</div>
            {q.client_company && <div className="text-xs text-[#111111]">{q.client_company}</div>}
            <div className="mt-1 space-y-0.5 text-xs text-[#555555]">
              {q.client_email && <div>{q.client_email}</div>}
              {q.client_phone && <div>{q.client_phone}</div>}
              {q.client_address && <div className="pt-1.5 whitespace-pre-line">{q.client_address}</div>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs sm:text-right">
            <div>
              <span className={label}>Issue date</span>
              <span className="font-bold text-[#111111] tabular-nums">{formatDate(q.issue_date)}</span>
            </div>
            <div>
              <span className={label}>Valid until</span>
              <span className="font-bold text-amber-600 tabular-nums">{formatDate(q.expiry_date)}</span>
            </div>
            <div>
              <span className={label}>Currency</span>
              <span className="font-bold text-[#111111]">{cur}</span>
            </div>
            <div>
              <span className={label}>Total</span>
              <span className="font-bold text-[#1400FF] tabular-nums">{formatMoney(q.total, cur)}</span>
            </div>
          </div>
        </div>

        <Block title="Scope overview">{q.scope_overview}</Block>

        <div className="mt-8 pt-6 border-t border-[#E5E5E2] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.15em] text-[#858585]">
                <th className="pb-4 font-semibold">Scope</th>
                <th className="pb-4 font-semibold text-right w-16">Qty</th>
                <th className="pb-4 font-semibold text-right w-32">Unit price</th>
                <th className="pb-4 font-semibold text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {q.items.map((it, i) => (
                <tr key={it.id || i} className="border-t border-[#F0F0ED]">
                  <td className="py-3.5 pr-3 align-top">
                    <div className="font-semibold text-[#111111]">{it.description}</div>
                    {it.deliverables && <div className="mt-1 text-[#555555] whitespace-pre-line leading-relaxed">{it.deliverables}</div>}
                  </td>
                  <td className="py-3.5 text-right text-[#555555] tabular-nums align-top">{it.quantity}</td>
                  <td className="py-3.5 text-right text-[#555555] tabular-nums align-top">{formatMoney(it.unit_price, cur)}</td>
                  <td className="py-3.5 text-right text-[#111111] tabular-nums align-top">{formatMoney(it.total ?? it.quantity * it.unit_price, cur)}</td>
                </tr>
              ))}
              <tr className="border-t border-[#E5E5E2]">
                <td colSpan={2} />
                <td className="py-3 text-right text-[#555555]">Subtotal</td>
                <td className="py-3 text-right tabular-nums">{formatMoney(q.subtotal, cur)}</td>
              </tr>
              {q.discount > 0 && (
                <tr>
                  <td colSpan={2} />
                  <td className="py-1 text-right text-[#555555]">
                    Discount{q.discount_type === 'percent' ? ` (${q.discount_value}%)` : ''}
                    {q.discount_note ? ` — ${q.discount_note}` : ''}
                  </td>
                  <td className="py-1 text-right text-emerald-600 tabular-nums">-{formatMoney(q.discount, cur)}</td>
                </tr>
              )}
              {q.tax > 0 && (
                <tr>
                  <td colSpan={2} />
                  <td className="py-1 text-right text-[#555555]">
                    {q.tax_label || 'Tax'}
                    {q.tax_rate ? ` (${q.tax_rate}%)` : ''}
                  </td>
                  <td className="py-1 text-right tabular-nums">+{formatMoney(q.tax, cur)}</td>
                </tr>
              )}
              <tr className="border-t border-[#E5E5E2]">
                <td colSpan={2} />
                <td className="py-4 text-right text-sm font-bold text-[#111111]">Total</td>
                <td className="py-4 text-right text-sm font-bold text-[#111111] tabular-nums">{formatMoney(q.total, cur)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Block title="Project timeline">{q.project_timeline}</Block>
        <Block title="Payment terms">{q.payment_terms}</Block>
        <Block title="Terms & conditions">{q.terms ?? ''}</Block>
      </div>
      <div className="border-t border-[#E5E5E2] px-6 sm:px-14 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[11px] text-[#858585]">
        <span>{company.company_name}</span>
        <span className="font-mono">{q.quotation_number}</span>
      </div>
    </div>
  );
}
