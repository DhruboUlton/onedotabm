import React from 'react';
import Image from 'next/image';
import { CreditCard } from 'lucide-react';
import type { InvoiceDetail } from '@/lib/services/invoiceService';
import type { CompanySettingsRecord } from '@/types/database';
import { formatMoney, formatDate, invoiceStatusMeta } from '@/lib/invoiceMeta';

const label = 'text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block';

/**
 * The invoice as the client sees it, on screen and on paper. Shared by the
 * public invoice page and the client portal.
 */
export function InvoiceDocument({
  invoice,
  company,
  showFull = true,
}: {
  invoice: InvoiceDetail;
  company: CompanySettingsRecord;
  /** False once the public link is past its full-access window: totals only. */
  showFull?: boolean;
}) {
  const cur = invoice.currency || 'BDT';
  const balance = Math.max(0, invoice.total - invoice.amount_paid);
  const isSettled = invoice.status === 'paid' || balance <= 0;
  const paidPercent = invoice.total > 0 ? Math.min(100, Math.round((invoice.amount_paid / invoice.total) * 100)) : 0;
  const status = invoiceStatusMeta(invoice.status);
  const showCta = showFull && invoice.cta_enabled && !isSettled && (invoice.cta_title || invoice.cta_payment_link);
  const ctaHref = /^https?:\/\//i.test(invoice.cta_payment_link)
    ? invoice.cta_payment_link
    : `https://${invoice.cta_payment_link}`;

  return (
    <div className="space-y-4">
      {showCta && (
        <div data-print-hide className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1400FF] text-white flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-[#111111]">{invoice.cta_title || 'Payment Required'}</p>
            {invoice.cta_description && (
              <p className="text-sm text-[#555555] leading-relaxed mt-0.5 whitespace-pre-line">{invoice.cta_description}</p>
            )}
            <p className="text-xs text-[#555555] mt-1 font-mono">Balance due: {formatMoney(balance, cur)}</p>
          </div>
          {invoice.cta_payment_link && (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1400FF] text-white text-sm font-semibold hover:bg-[#0F00CC] shrink-0"
            >
              {invoice.cta_button_text || 'Pay Now'}
            </a>
          )}
        </div>
      )}

      <div data-print-document className="bg-white border border-[#E5E5E2] shadow-sm overflow-hidden rounded-2xl">
        <div className="px-6 sm:px-14 py-10 sm:py-14">
          {/* Letterhead */}
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
                {company.phone && <div>{company.phone}</div>}
                {company.address && <div>{company.address}</div>}
              </div>
            </div>
            <div className="sm:text-right">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">INVOICE</h2>
              <div className="font-mono text-sm text-[#1400FF] mt-1">{invoice.invoice_number}</div>
              <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full border ${status.className}`}>
                {status.label}
              </span>
            </div>
          </div>

          {/* Bill to / summary */}
          <div className="mt-8 pt-6 border-t border-[#E5E5E2] grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className={`${label} mb-1.5`}>Bill to</span>
              <div className="text-sm font-bold text-[#111111]">{invoice.client_name}</div>
              {invoice.client_company && <div className="text-xs text-[#111111]">{invoice.client_company}</div>}
              {showFull && (
                <div className="mt-1 space-y-0.5 text-xs text-[#555555]">
                  {invoice.client_email && <div>{invoice.client_email}</div>}
                  {invoice.client_phone && <div>{invoice.client_phone}</div>}
                  {invoice.client_address && <div className="pt-1.5 whitespace-pre-line">{invoice.client_address}</div>}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs sm:text-right">
              <div>
                <span className={label}>Issue date</span>
                <span className="font-bold text-[#111111] tabular-nums">{formatDate(invoice.issue_date)}</span>
              </div>
              <div>
                <span className={label}>Currency</span>
                <span className="font-bold text-[#111111]">{cur}</span>
              </div>
              <div>
                <span className={label}>Due date</span>
                <span className={`font-bold tabular-nums ${isSettled ? 'text-[#111111]' : 'text-amber-600'}`}>
                  {formatDate(invoice.due_date)}
                </span>
              </div>
              <div>
                <span className={label}>Invoice total</span>
                <span className="font-bold text-[#1400FF] tabular-nums">{formatMoney(invoice.total, cur)}</span>
              </div>
              {invoice.quotation_number && (
                <div>
                  <span className={label}>Quotation</span>
                  <span className="font-bold font-mono text-[#1400FF]">{invoice.quotation_number}</span>
                </div>
              )}
            </div>
          </div>

          {showFull && (
            <>
              {/* Line items */}
              <div className="mt-8 pt-6 border-t border-[#E5E5E2] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.15em] text-[#858585]">
                      <th className="pb-4 font-semibold">Description</th>
                      <th className="pb-4 font-semibold text-right w-16">Qty</th>
                      <th className="pb-4 font-semibold text-right w-32">Unit price</th>
                      <th className="pb-4 font-semibold text-right w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, idx) => (
                      <tr key={item.id || idx} className="border-t border-[#F0F0ED]">
                        <td className="py-3.5 pr-3 text-[#111111] align-top">{item.description}</td>
                        <td className="py-3.5 text-right text-[#555555] tabular-nums align-top">{item.quantity}</td>
                        <td className="py-3.5 text-right text-[#555555] tabular-nums align-top">{formatMoney(item.unit_price, cur)}</td>
                        <td className="py-3.5 text-right text-[#111111] tabular-nums align-top">
                          {formatMoney(item.total ?? item.quantity * item.unit_price, cur)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-[#E5E5E2]">
                      <td colSpan={2} />
                      <td className="py-3 text-right text-[#555555]">Subtotal</td>
                      <td className="py-3 text-right text-[#111111] tabular-nums">{formatMoney(invoice.subtotal, cur)}</td>
                    </tr>
                    {invoice.discount > 0 && (
                      <tr>
                        <td colSpan={2} />
                        <td className="py-1 text-right text-[#555555]">
                          Discount
                          {invoice.discount_type === 'percent' ? ` (${invoice.discount_value}%)` : ''}
                          {invoice.discount_note ? ` — ${invoice.discount_note}` : ''}
                        </td>
                        <td className="py-1 text-right text-emerald-600 tabular-nums">-{formatMoney(invoice.discount, cur)}</td>
                      </tr>
                    )}
                    {invoice.tax > 0 && (
                      <tr>
                        <td colSpan={2} />
                        <td className="py-1 text-right text-[#555555]">
                          {invoice.tax_label || 'Tax'}
                          {invoice.tax_rate ? ` (${invoice.tax_rate}%)` : ''}
                        </td>
                        <td className="py-1 text-right text-[#111111] tabular-nums">+{formatMoney(invoice.tax, cur)}</td>
                      </tr>
                    )}
                    <tr className="border-t border-[#E5E5E2]">
                      <td colSpan={2} />
                      <td className="py-4 text-right text-sm font-bold text-[#111111]">Total</td>
                      <td className="py-4 text-right text-sm font-bold text-[#111111] tabular-nums">{formatMoney(invoice.total, cur)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment history */}
              <div className="mt-8 pt-6 border-t border-[#E5E5E2]">
                <span className={`${label} mb-3`}>Payment history</span>
                {invoice.payments.length === 0 ? (
                  <p className="text-xs text-[#858585]">No payments recorded yet.</p>
                ) : (
                  <ul className="text-xs">
                    {invoice.payments.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-4 py-2.5 border-b border-[#F0F0ED]">
                        <span className="text-[#555555]">
                          <span className="tabular-nums">{formatDate(p.payment_date)}</span>
                          {p.payment_method && (
                            <>
                              <span className="mx-2 text-[#D8D8D4]">·</span>
                              <span className="text-[#111111]">{p.payment_method}</span>
                            </>
                          )}
                          {p.reference && (
                            <>
                              <span className="mx-2 text-[#D8D8D4]">·</span>
                              <span className="font-mono text-[#858585]">{p.reference}</span>
                            </>
                          )}
                        </span>
                        <span className="font-semibold text-emerald-600 tabular-nums shrink-0">{formatMoney(p.amount, cur)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {invoice.amount_paid > 0 && !isSettled && (
                  <div className="mt-4">
                    <div className="h-1.5 w-full rounded-full bg-[#E5E5E2] overflow-hidden">
                      <div className="h-full rounded-full bg-[#1400FF]" style={{ width: `${paidPercent}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] text-[#858585]">
                      {paidPercent}% paid · Paid: {formatMoney(invoice.amount_paid, cur)}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Balance */}
          <div data-print-keep className={`mt-8 rounded-xl px-6 py-5 ${isSettled ? 'bg-emerald-600' : 'bg-[#1400FF]'}`}>
            <span className="text-[11px] text-white/70 block">{isSettled ? 'Settled in full' : 'Balance Due'}</span>
            <span className="text-2xl font-bold text-white tabular-nums">{formatMoney(balance, cur)}</span>
          </div>

          {showFull && invoice.invoice_notes && (
            <div className="mt-10 pt-6 border-t border-[#E5E5E2]" data-print-keep>
              <span className={`${label} mb-2`}>Notes</span>
              <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line">{invoice.invoice_notes}</p>
            </div>
          )}
          {showFull && invoice.notes && (
            <div className="mt-6 pt-6 border-t border-[#E5E5E2]" data-print-keep>
              <span className={`${label} mb-2`}>Payment instructions</span>
              <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="border-t border-[#E5E5E2] px-6 sm:px-14 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[11px] text-[#858585]">
          <span>{company.company_name}</span>
          <span className="font-mono">{invoice.invoice_number}</span>
        </div>
      </div>
    </div>
  );
}
