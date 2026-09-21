'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Receipt,
  ArrowLeft,
  Printer,
  CreditCard,
  CheckCircle2,
  XCircle,
  Trash2,
  Building2,
  Calendar,
  DollarSign,
  Loader2,
  X,
  Send,
  Clock,
} from 'lucide-react';
import { InvoiceRecord, InvoiceStatus } from '@/types/database';
import {
  updateInvoiceStatusAction,
  deleteInvoiceAction,
  recordPaymentAction,
} from '@/lib/actions/adminActions';
import { Card } from '@/components/ui/Card';

interface InvoiceDetailClientProps {
  invoice: InvoiceRecord;
}

export function InvoiceDetailClient({ invoice }: InvoiceDetailClientProps) {
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

  const formatMoney = (amount: number, cur = invoice.currency || 'BDT') => {
    const symbol = cur === 'BDT' ? '৳' : '$';
    return `${symbol}${Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

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
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    partially_paid: 'bg-blue-50 text-blue-700 border-blue-200',
    sent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    overdue: 'bg-red-50 text-red-700 border-red-200',
    cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Actions (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
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
      <Card className="bg-white border border-[#E5E5E2] p-8 sm:p-12 shadow-sm relative">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-8 border-b border-[#E5E5E2]">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white font-bold text-sm">
                1•
              </div>
              <span className="text-xl font-bold tracking-tight text-[#111111]">OneDot ABM</span>
            </div>
            <p className="text-xs text-[#555555] max-w-sm">
              Strategic Marketing & Custom Web Development
              <br />
              Gulshan-2, Dhaka 1212, Bangladesh
              <br />
              hello@onedotabm.com | +880 1700-000000
            </p>
          </div>

          <div className="sm:text-right">
            <h2 className="text-2xl font-bold font-mono tracking-tight text-[#111111]">INVOICE</h2>
            <div className="text-sm font-mono font-semibold text-[#1400FF] mt-1">
              {invoice.invoice_number}
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border ${
                  statusColors[invoice.status] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {invoice.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Client & Date Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-[#E5E5E2] text-xs">
          <div>
            <span className="font-mono uppercase tracking-wider text-[#858585] font-semibold block mb-2">
              Billed To:
            </span>
            <div className="text-sm font-bold text-[#111111]">
              {(invoice as any).client_name || 'Client'}
            </div>
            {(invoice as any).client_contact && (
              <div className="text-[#555555] mt-0.5">Attn: {(invoice as any).client_contact}</div>
            )}
            {(invoice as any).client_email && (
              <div className="text-[#555555]">Email: {(invoice as any).client_email}</div>
            )}
            {(invoice as any).client_phone && (
              <div className="text-[#555555]">Phone: {(invoice as any).client_phone}</div>
            )}
            {(invoice as any).client_address && (
              <div className="text-[#555555]">Address: {(invoice as any).client_address}</div>
            )}
          </div>

          <div className="sm:text-right space-y-2">
            <div>
              <span className="text-[#858585] block font-mono uppercase">Issue Date</span>
              <span className="font-semibold text-[#111111]">
                {new Date(invoice.issue_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-[#858585] block font-mono uppercase">Payment Due Date</span>
              <span className="font-semibold text-amber-700">
                {new Date(invoice.due_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {invoice.payment_method && (
              <div>
                <span className="text-[#858585] block font-mono uppercase">Payment Mode</span>
                <span className="font-semibold text-[#111111]">{invoice.payment_method}</span>
              </div>
            )}
            {(invoice as any).quotation_number && (
              <div>
                <span className="text-[#858585] block font-mono uppercase">Reference Quotation</span>
                <span className="font-semibold text-[#1400FF]">
                  {(invoice as any).quotation_number}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="py-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5E5E2] font-mono uppercase text-[#858585]">
                <tr>
                  <th className="py-3 px-2 w-12">#</th>
                  <th className="py-3 px-2">Deliverable Description</th>
                  <th className="py-3 px-2 text-right">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2]">
                {(invoice.items || []).map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-4 px-2 font-mono text-[#858585]">{idx + 1}</td>
                    <td className="py-4 px-2 font-medium text-[#111111]">{item.description}</td>
                    <td className="py-4 px-2 text-right font-mono text-[#555555]">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-[#555555]">
                      {formatMoney(item.unit_price, invoice.currency)}
                    </td>
                    <td className="py-4 px-2 text-right font-mono font-semibold text-[#111111]">
                      {formatMoney(item.total, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations & Balances */}
          <div className="flex justify-end pt-6 border-t border-[#E5E5E2]">
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between text-[#555555]">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-[#111111]">
                  {formatMoney(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-[#555555]">
                  <span>Discount:</span>
                  <span className="font-mono text-emerald-600">
                    -{formatMoney(invoice.discount, invoice.currency)}
                  </span>
                </div>
              )}
              {invoice.tax > 0 && (
                <div className="flex justify-between text-[#555555]">
                  <span>Tax / VAT:</span>
                  <span className="font-mono font-semibold text-[#111111]">
                    +{formatMoney(invoice.tax, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#E5E5E2]">
                <span>Total Invoiced:</span>
                <span className="font-mono text-base text-[#111111]">
                  {formatMoney(invoice.total, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700">
                <span>Amount Paid:</span>
                <span className="font-mono font-semibold">
                  {formatMoney(invoice.amount_paid, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1400FF] pt-2 border-t border-[#111111]">
                <span>Balance Due:</span>
                <span className="font-mono font-bold">
                  {formatMoney(invoice.amount_due, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Ledger Section */}
        <div className="pt-8 border-t border-[#E5E5E2]">
          <h4 className="font-bold text-sm text-[#111111] mb-3 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#1400FF]" />
            <span>Settled Payment History</span>
          </h4>

          {(!invoice.payments || invoice.payments.length === 0) ? (
            <p className="text-xs text-[#858585] py-2">
              No payments have been recorded for this invoice yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF8] text-[#858585] font-mono uppercase border-b border-[#E5E5E2]">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Reference / TrxID</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E2]">
                  {invoice.payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-3 font-mono">
                        {new Date(p.payment_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#111111]">{p.payment_method}</td>
                      <td className="py-3 px-3 font-mono text-[#555555]">{p.reference || '—'}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                        {formatMoney(p.amount, p.currency)}
                      </td>
                      <td className="py-3 px-3 text-[#555555]">{p.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {invoice.notes && (
          <div className="pt-8 border-t border-[#E5E5E2] text-xs">
            <span className="font-mono uppercase tracking-wider text-[#858585] font-semibold block mb-1">
              Payment Instructions / Bank Wire Details:
            </span>
            <p className="text-[#555555] leading-relaxed whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
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
