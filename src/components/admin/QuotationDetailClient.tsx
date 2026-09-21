'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  ArrowLeft,
  Printer,
  Send,
  CheckCircle2,
  XCircle,
  Receipt,
  Trash2,
  Building2,
  Calendar,
  DollarSign,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { QuotationRecord, QuotationStatus } from '@/types/database';
import {
  updateQuotationStatusAction,
  deleteQuotationAction,
  createInvoiceAction,
} from '@/lib/actions/adminActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface QuotationDetailClientProps {
  quotation: QuotationRecord;
}

export function QuotationDetailClient({ quotation }: QuotationDetailClientProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const formatMoney = (amount: number, cur = quotation.currency || 'BDT') => {
    const symbol = cur === 'BDT' ? '৳' : '$';
    return `${symbol}${Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleStatusUpdate = async (status: QuotationStatus) => {
    setLoadingAction(status);
    const res = await updateQuotationStatusAction(quotation.id, status);
    setLoadingAction(null);
    if (res.success) {
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete quotation ${quotation.quotation_number}?`)) {
      setLoadingAction('delete');
      const res = await deleteQuotationAction(quotation.id);
      if (res.success) {
        router.push('/admin/quotations');
      } else {
        setLoadingAction(null);
        alert(res.error || 'Failed to delete quotation');
      }
    }
  };

  const handleConvertToInvoice = async () => {
    if (!confirm('Create a formal invoice from this accepted quotation?')) return;
    setConverting(true);

    const res = await createInvoiceAction({
      client_id: quotation.client_id,
      project_id: quotation.project_id,
      quotation_id: quotation.id,
      currency: quotation.currency,
      discount: quotation.discount,
      tax: quotation.tax,
      status: 'draft',
      notes: `Generated from Quotation ${quotation.quotation_number}`,
      items: (quotation.items || []).map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unit_price,
        discount: it.discount,
        total: it.total,
      })),
    });

    setConverting(false);

    if (res.success && res.data) {
      router.push(`/admin/billing/${res.data.id}`);
    } else {
      alert(res.error || 'Failed to generate invoice');
    }
  };

  const printProposal = () => {
    window.print();
  };

  const statusColors: Record<string, string> = {
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    sent: 'bg-blue-50 text-blue-700 border-blue-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Navigation & Action Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <Link
          href="/admin/quotations"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#555555] hover:text-[#111111]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quotations</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={printProposal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E5E2] text-xs font-medium text-[#111111] hover:bg-[#F0F0ED]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          {quotation.status === 'draft' && (
            <button
              onClick={() => handleStatusUpdate('sent')}
              disabled={loadingAction === 'sent'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#1400FF] border border-blue-200 text-xs font-semibold hover:bg-blue-100"
            >
              {loadingAction === 'sent' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Mark as Sent</span>
            </button>
          )}

          {quotation.status === 'sent' && (
            <button
              onClick={() => handleStatusUpdate('accepted')}
              disabled={loadingAction === 'accepted'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100"
            >
              {loadingAction === 'accepted' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Mark Accepted</span>
            </button>
          )}

          {quotation.status !== 'rejected' && (
            <button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={loadingAction === 'rejected'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#858585] border border-[#E5E5E2] text-xs font-medium hover:text-red-600 hover:border-red-200"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          )}

          {quotation.status === 'accepted' && (
            <button
              onClick={handleConvertToInvoice}
              disabled={converting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white text-xs font-semibold shadow-xs"
            >
              {converting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Receipt className="w-3.5 h-3.5" />
              )}
              <span>Convert to Invoice</span>
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={loadingAction === 'delete'}
            className="p-1.5 rounded-xl text-[#858585] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
            title="Delete quotation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Quotation Document Card */}
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
            <h2 className="text-2xl font-bold font-mono tracking-tight text-[#111111]">
              QUOTATION
            </h2>
            <div className="text-sm font-mono font-semibold text-[#1400FF] mt-1">
              {quotation.quotation_number}
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border ${
                  statusColors[quotation.status] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {quotation.status}
              </span>
            </div>
          </div>
        </div>

        {/* Client & Date Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-[#E5E5E2] text-xs">
          <div>
            <span className="font-mono uppercase tracking-wider text-[#858585] font-semibold block mb-2">
              Prepared For:
            </span>
            <div className="text-sm font-bold text-[#111111]">
              {(quotation as any).client_name || 'Client'}
            </div>
            {(quotation as any).client_contact && (
              <div className="text-[#555555] mt-0.5">Attn: {(quotation as any).client_contact}</div>
            )}
            {(quotation as any).client_email && (
              <div className="text-[#555555]">Email: {(quotation as any).client_email}</div>
            )}
            {(quotation as any).client_phone && (
              <div className="text-[#555555]">Phone: {(quotation as any).client_phone}</div>
            )}
            {(quotation as any).client_address && (
              <div className="text-[#555555]">Address: {(quotation as any).client_address}</div>
            )}
          </div>

          <div className="sm:text-right space-y-2">
            <div>
              <span className="text-[#858585] block font-mono uppercase">Issue Date</span>
              <span className="font-semibold text-[#111111]">
                {new Date(quotation.issue_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-[#858585] block font-mono uppercase">Valid Until</span>
              <span className="font-semibold text-[#111111]">
                {new Date(quotation.expiry_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {(quotation as any).project_name && (
              <div>
                <span className="text-[#858585] block font-mono uppercase">Project Scope</span>
                <span className="font-semibold text-[#111111]">
                  {(quotation as any).project_name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5E5E2] font-mono uppercase text-[#858585]">
                <tr>
                  <th className="py-3 px-2 w-12">#</th>
                  <th className="py-3 px-2">Description / Deliverable</th>
                  <th className="py-3 px-2 text-right">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2]">
                {(quotation.items || []).map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-4 px-2 font-mono text-[#858585]">{idx + 1}</td>
                    <td className="py-4 px-2 font-medium text-[#111111]">
                      {item.description}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-[#555555]">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-[#555555]">
                      {formatMoney(item.unit_price, quotation.currency)}
                    </td>
                    <td className="py-4 px-2 text-right font-mono font-semibold text-[#111111]">
                      {formatMoney(item.total, quotation.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end pt-6 border-t border-[#E5E5E2]">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#555555]">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-[#111111]">
                  {formatMoney(quotation.subtotal, quotation.currency)}
                </span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between text-[#555555]">
                  <span>Discount:</span>
                  <span className="font-mono text-emerald-600">
                    -{formatMoney(quotation.discount, quotation.currency)}
                  </span>
                </div>
              )}
              {quotation.tax > 0 && (
                <div className="flex justify-between text-[#555555]">
                  <span>Tax / VAT:</span>
                  <span className="font-mono font-semibold text-[#111111]">
                    +{formatMoney(quotation.tax, quotation.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#111111] pt-3 border-t border-[#111111]">
                <span>Total Quotation:</span>
                <span className="font-mono text-base text-[#1400FF]">
                  {formatMoney(quotation.total, quotation.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions & Notes */}
        <div className="pt-8 border-t border-[#E5E5E2] grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          {quotation.terms && (
            <div>
              <span className="font-mono uppercase tracking-wider text-[#858585] font-semibold block mb-1">
                Terms & Conditions:
              </span>
              <p className="text-[#555555] leading-relaxed whitespace-pre-line">
                {quotation.terms}
              </p>
            </div>
          )}
          {quotation.notes && (
            <div>
              <span className="font-mono uppercase tracking-wider text-[#858585] font-semibold block mb-1">
                Notes:
              </span>
              <p className="text-[#555555] leading-relaxed whitespace-pre-line">
                {quotation.notes}
              </p>
            </div>
          )}
        </div>

        {/* Signature Authorization Block */}
        <div className="pt-12 mt-12 border-t border-[#E5E5E2] grid grid-cols-2 gap-8 text-xs text-[#858585]">
          <div>
            <div className="border-b border-[#D8D8D4] w-48 h-10 mb-2"></div>
            <span>Authorized Signature (OneDot ABM)</span>
          </div>
          <div>
            <div className="border-b border-[#D8D8D4] w-48 h-10 mb-2"></div>
            <span>Client Acceptance Signature & Date</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
