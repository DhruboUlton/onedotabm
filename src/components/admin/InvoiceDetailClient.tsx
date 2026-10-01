'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  CreditCard,
  XCircle,
  Trash2,
  Loader2,
  X,
  Send,
} from 'lucide-react';
import { CompanySettingsRecord, InvoiceRecord, InvoiceStatus } from '@/types/database';
import {
  updateInvoiceStatusAction,
  deleteInvoiceAction,
  recordPaymentAction,
} from '@/lib/actions/adminActions';
import { Card } from '@/components/ui/Card';

interface InvoiceDetailClientProps {
  invoice: InvoiceRecord;
  /** Letterhead details, from company settings. */
  company: CompanySettingsRecord;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export function InvoiceDetailClient({ invoice, company }: InvoiceDetailClientProps) {
  const router = useRouter();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState<number>(invoice.amount_due);
  const [paymentMethod, setPaymentMethod] = useState(invoice.payment_method || 'Bank Transfer');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('Payment settlement received.');

  const formatMoney = (amount: number, cur = invoice.currency || 'BDT') =>
    `${cur} ${Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleStatusUpdate = async (status: InvoiceStatus) => {
    setLoadingStatus(status);
    const res = await updateInvoiceStatusAction(invoice.id, status);
    setLoadingStatus(null);
    if (res.success) {
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoice_number}?`)) {
      setLoadingStatus('delete');
      const res = await deleteInvoiceAction(invoice.id);
      if (res.success) {
        router.push('/admin/billing');
      } else {
        setLoadingStatus(null);
        alert(res.error || 'Failed to delete invoice');
      }
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const res = await recordPaymentAction({
      invoice_id: invoice.id,
      amount: paymentAmount,
      currency: invoice.currency,
      payment_method: paymentMethod,
      payment_date: paymentDate,
      reference: paymentRef,
      notes: paymentNotes,
    });

    setSubmitting(false);

    if (res.success) {
      setIsPaymentOpen(false);
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to record payment');
    }
  };

  const statusColors: Record<string, string> = {
    paid: 'text-emerald-600',
    partially_paid: 'text-amber-500',
    sent: 'text-[#1400FF]',
    draft: 'text-[#858585]',
    overdue: 'text-red-600',
    cancelled: 'text-[#B5B5B2]',
  };

  const isSettled = invoice.amount_due <= 0;
  const clientName = (invoice as any).client_name || 'Client';
  const paidPercent =
    invoice.total > 0 ? Math.min(100, Math.round((invoice.amount_paid / invoice.total) * 100)) : 0;
  const showProgress = invoice.amount_paid > 0 && !isSettled;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Actions (Hidden when printing) */}
      <div
        data-print-hide
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden"
      >
        <Link
          href="/admin/billing"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#555555] hover:text-[#111111]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Billing Ledger</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E5E2] text-xs font-medium text-[#111111] hover:bg-[#F0F0ED]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          {invoice.amount_due > 0 && (
            <button
              onClick={() => {
                setPaymentAmount(invoice.amount_due);
                setIsPaymentOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          )}

          {invoice.status === 'draft' && (
            <button
              onClick={() => handleStatusUpdate('sent')}
              disabled={loadingStatus === 'sent'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#1400FF] border border-blue-200 text-xs font-semibold hover:bg-blue-100"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Mark Sent</span>
            </button>
          )}

          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={loadingStatus === 'cancelled'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#858585] border border-[#E5E5E2] text-xs font-medium hover:text-red-600 hover:border-red-200"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={loadingStatus === 'delete'}
            className="p-1.5 rounded-xl text-[#858585] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
            title="Delete invoice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <Card
        data-print-document
        className="bg-white border border-[#E5E5E2] shadow-sm overflow-hidden p-0 rounded-2xl"
      >
        <div className="px-8 sm:px-14 py-10 sm:py-14">
          {/* Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white border border-[#E5E5E2] flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt={`${company.company_name} logo`}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#1400FF]">
                  {company.company_name}
                </span>
              </div>

              <div className="mt-2 text-[11px] leading-relaxed text-[#555555]">
                {company.tagline && <div className="text-[#111111]">{company.tagline}</div>}
                {company.email && <div>{company.email}</div>}
                {company.phone && <div>{company.phone}</div>}
                {company.address && <div>{company.address}</div>}
              </div>
            </div>

            <div className="sm:text-right">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                INVOICE
              </h2>
              <div className="font-mono text-sm text-[#1400FF] mt-1">{invoice.invoice_number}</div>
              <div
                className={`mt-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
                  statusColors[invoice.status] || 'text-[#858585]'
                }`}
              >
                {invoice.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Bill to / summary */}
          <div className="mt-8 pt-6 border-t border-[#E5E5E2] grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block mb-1.5">
                Bill to
              </span>
              <div className="text-sm font-bold text-[#111111]">
                {(invoice as any).client_contact || clientName}
              </div>
              {(invoice as any).client_contact && clientName && (
                <div className="text-xs text-[#111111]">{clientName}</div>
              )}
              <div className="mt-1 space-y-0.5 text-xs text-[#555555]">
                {(invoice as any).client_email && <div>{(invoice as any).client_email}</div>}
                {(invoice as any).client_phone && <div>{(invoice as any).client_phone}</div>}
                {(invoice as any).client_address && (
                  <div className="pt-1.5">{(invoice as any).client_address}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs sm:text-right">
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block">
                  Issue date
                </span>
                <span className="font-bold text-[#111111] tabular-nums">
                  {formatDate(invoice.issue_date)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block">
                  Currency
                </span>
                <span className="font-bold text-[#111111]">{invoice.currency || 'BDT'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block">
                  Due date
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    isSettled ? 'text-[#111111]' : 'text-amber-600'
                  }`}
                >
                  {formatDate(invoice.due_date)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block">
                  Invoice total
                </span>
                <span className="font-bold text-[#1400FF] tabular-nums">
                  {formatMoney(invoice.total, invoice.currency)}
                </span>
              </div>
              {invoice.payment_method && (
                <div>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block">
                    Payment mode
                  </span>
                  <span className="font-bold text-[#111111]">{invoice.payment_method}</span>
                </div>
              )}
              {(invoice as any).quotation_number && (
                <div>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block">
                    Quotation
                  </span>
                  <span className="font-bold font-mono text-[#1400FF]">
                    {(invoice as any).quotation_number}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Line items */}
          <div className="mt-8 pt-6 border-t border-[#E5E5E2] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.15em] text-[#858585]">
                  <th className="pb-4 font-semibold">Description</th>
                  <th className="pb-4 font-semibold text-right w-20">Qty</th>
                  <th className="pb-4 font-semibold text-right w-36">Unit price</th>
                  <th className="pb-4 font-semibold text-right w-36">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((item, idx) => (
                  <tr key={item.id || idx} className="border-t border-[#F0F0ED]">
                    <td className="py-3.5 text-[#111111] align-top">{item.description}</td>
                    <td className="py-3.5 text-right text-[#555555] tabular-nums align-top">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 text-right text-[#555555] tabular-nums align-top">
                      {formatMoney(item.unit_price, invoice.currency)}
                    </td>
                    <td className="py-3.5 text-right text-[#111111] tabular-nums align-top">
                      {formatMoney(item.total, invoice.currency)}
                    </td>
                  </tr>
                ))}

                <tr className="border-t border-[#E5E5E2]">
                  <td colSpan={2} />
                  <td className="py-3 text-right text-[#555555]">Subtotal</td>
                  <td className="py-3 text-right text-[#111111] tabular-nums">
                    {formatMoney(invoice.subtotal, invoice.currency)}
                  </td>
                </tr>
                {invoice.discount > 0 && (
                  <tr>
                    <td colSpan={2} />
                    <td className="py-1 text-right text-[#555555]">Discount</td>
                    <td className="py-1 text-right text-emerald-600 tabular-nums">
                      -{formatMoney(invoice.discount, invoice.currency)}
                    </td>
                  </tr>
                )}
                {invoice.tax > 0 && (
                  <tr>
                    <td colSpan={2} />
                    <td className="py-1 text-right text-[#555555]">Tax / VAT</td>
                    <td className="py-1 text-right text-[#111111] tabular-nums">
                      +{formatMoney(invoice.tax, invoice.currency)}
                    </td>
                  </tr>
                )}
                <tr className="border-t border-[#E5E5E2]">
                  <td colSpan={2} />
                  <td className="py-4 text-right text-sm font-bold text-[#111111]">Total</td>
                  <td className="py-4 text-right text-sm font-bold text-[#111111] tabular-nums">
                    {formatMoney(invoice.total, invoice.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment history */}
          <div className="mt-8 pt-6 border-t border-[#E5E5E2]">
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#858585] font-semibold block mb-3">
              Payment history
            </span>

            {!invoice.payments || invoice.payments.length === 0 ? (
              <p className="text-xs text-[#858585]">No payments recorded yet.</p>
            ) : (
              <ul className="text-xs">
                {invoice.payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-4 py-2.5 border-b border-[#F0F0ED]"
                  >
                    <span className="text-[#555555]">
                      <span className="tabular-nums">{formatDate(payment.payment_date)}</span>
                      <span className="mx-2 text-[#D8D8D4]">·</span>
                      <span className="text-[#111111]">{payment.payment_method}</span>
                      {payment.reference && (
                        <>
                          <span className="mx-2 text-[#D8D8D4]">·</span>
                          <span className="font-mono text-[#858585]">{payment.reference}</span>
                        </>
                      )}
                    </span>
                    <span className="font-semibold text-emerald-600 tabular-nums shrink-0">
                      {formatMoney(payment.amount, payment.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {showProgress && (
              <div className="mt-4">
                <div className="h-1.5 w-full rounded-full bg-[#E5E5E2] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1400FF]"
                    style={{ width: `${paidPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-[#858585]">
                  {paidPercent}% paid · Paid: {formatMoney(invoice.amount_paid, invoice.currency)}
                </p>
              </div>
            )}
          </div>

          {/* Balance */}
          <div
            data-print-keep
            className={`mt-8 rounded-xl px-6 py-5 ${isSettled ? 'bg-emerald-600' : 'bg-[#1400FF]'}`}
          >
            <span className="text-[11px] text-white/70 block">
              {isSettled ? 'Settled in full' : 'Balance Due'}
            </span>
            <span className="text-2xl font-bold text-white tabular-nums">
              {formatMoney(invoice.amount_due, invoice.currency)}
            </span>
          </div>

          {/* Payment instructions */}
          {invoice.notes && (
            <div className="mt-10 pt-6 border-t border-[#E5E5E2]" data-print-keep>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#858585] font-semibold block mb-2">
                Payment instructions
              </span>
              <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>

        {/* Foot */}
        <div className="border-t border-[#E5E5E2] px-8 sm:px-14 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[11px] text-[#858585]">
          <span>{company.company_name}</span>
          <span className="font-mono">{invoice.invoice_number}</span>
        </div>
      </Card>

      {/* RECORD PAYMENT MODAL */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
              <div>
                <h3 className="font-bold text-base text-[#111111]">Record Payment</h3>
                <p className="text-xs text-[#858585]">Invoice {invoice.invoice_number}</p>
              </div>
              <button
                onClick={() => setIsPaymentOpen(false)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-[#111111] hover:bg-[#F0F0ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] flex items-center justify-between text-xs">
                <span className="text-[#555555]">Outstanding Due:</span>
                <span className="font-mono font-bold text-[#1400FF]">
                  {formatMoney(invoice.amount_due, invoice.currency)}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">Amount Received *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#858585] font-mono">
                    {invoice.currency === 'BDT' ? '৳' : '$'}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E5E5E2] text-xs font-mono bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">Reference / TrxID</label>
                <input
                  type="text"
                  placeholder="e.g. EBL-TRX-9981 or bKash TrxID"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">Notes</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E2] text-xs font-medium text-[#555555]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
