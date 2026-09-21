'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  Send,
  Eye,
  X,
  Building2,
  Calendar,
  DollarSign,
  ArrowUpRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { QuotationRecord, QuotationStatus } from '@/types/database';
import { ClientOption, ProjectOption } from '@/lib/services/financeService';
import {
  createQuotationAction,
  updateQuotationStatusAction,
  deleteQuotationAction,
} from '@/lib/actions/adminActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface QuotationsClientProps {
  initialQuotations: QuotationRecord[];
  clients: ClientOption[];
  projects: ProjectOption[];
}

interface LineItemDraft {
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
}

export function QuotationsClient({
  initialQuotations,
  clients,
  projects,
}: QuotationsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showCreateModalDefault = searchParams.get('create') === 'true';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(showCreateModalDefault);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [projectId, setProjectId] = useState('');
  const [currency, setCurrency] = useState('BDT');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [notes, setNotes] = useState('Scope includes marketing operations and web infrastructure.');
  const [terms, setTerms] = useState(
    'Payment schedule: 50% advance upon quotation sign-off, 50% on milestone completion. Valid for 30 days.'
  );

  const [items, setItems] = useState<LineItemDraft[]>([
    {
      description: 'Performance Marketing Retainer (Month 1)',
      quantity: 1,
      unit_price: 60000,
      discount: 0,
      total: 60000,
    },
  ]);

  // Recalculate line total
  const updateItem = (index: number, field: keyof LineItemDraft, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      const qty = Number(field === 'quantity' ? value : item.quantity) || 0;
      const price = Number(field === 'unit_price' ? value : item.unit_price) || 0;
      const disc = Number(field === 'discount' ? value : item.discount) || 0;
      item.total = Math.max(0, qty * price - disc);
      next[index] = item;
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { description: '', quantity: 1, unit_price: 0, discount: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, it) => sum + it.total, 0);
  const grandTotal = Math.max(0, subtotal - globalDiscount + taxAmount);

  // Filtered quotations
  const filtered = initialQuotations.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const matchNum = q.quotation_number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClient = q.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchNum || matchClient;
    }
    return true;
  });

  const totalValue = initialQuotations.reduce((sum, q) => sum + q.total, 0);
  const acceptedValue = initialQuotations
    .filter((q) => q.status === 'accepted')
    .reduce((sum, q) => sum + q.total, 0);

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setErrorMsg('Please select a client.');
      return;
    }
    if (items.some((it) => !it.description.trim())) {
      setErrorMsg('All line items must have a description.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const res = await createQuotationAction({
      client_id: clientId,
      project_id: projectId || null,
      currency,
      issue_date: issueDate,
      expiry_date: expiryDate,
      discount: globalDiscount,
      tax: taxAmount,
      notes,
      terms,
      items: items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unit_price,
        discount: it.discount,
        total: it.total,
      })),
    });

    setSubmitting(false);

    if (res.success && res.data) {
      setIsCreateOpen(false);
      router.push(`/admin/quotations/${res.data.id}`);
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to create quotation.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: QuotationStatus) => {
    await updateQuotationStatusAction(id, newStatus);
    router.refresh();
  };

  const handleDelete = async (id: string, quoteNum: string) => {
    if (confirm(`Are you sure you want to delete quotation ${quoteNum}?`)) {
      await deleteQuotationAction(id);
      router.refresh();
    }
  };

  const formatMoney = (amount: number, cur = 'BDT') => {
    const symbol = cur === 'BDT' ? '৳' : '$';
    return `${symbol}${Number(amount || 0).toLocaleString('en-US')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Quotations & Proposals</h1>
          <p className="text-xs text-[#555555]">
            Generate line-item client proposals, track approvals, and convert to invoices.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white text-xs font-semibold shadow-[0_2px_12px_rgba(20,0,255,0.25)] transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-[#E5E5E2]">
          <span className="text-[11px] font-mono uppercase text-[#858585] font-semibold">
            Total Quotations
          </span>
          <div className="text-xl font-bold text-[#111111] mt-1">{initialQuotations.length}</div>
          <div className="text-xs text-[#555555] mt-1">Total Pipeline: {formatMoney(totalValue)}</div>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E5E2]">
          <span className="text-[11px] font-mono uppercase text-[#858585] font-semibold">
            Accepted Proposals
          </span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {initialQuotations.filter((q) => q.status === 'accepted').length}
          </div>
          <div className="text-xs text-[#555555] mt-1">Won Value: {formatMoney(acceptedValue)}</div>
        </Card>

        <Card className="p-4 bg-white border border-[#E5E5E2]">
          <span className="text-[11px] font-mono uppercase text-[#858585] font-semibold">
            Pending Review
          </span>
          <div className="text-xl font-bold text-blue-600 mt-1">
            {initialQuotations.filter((q) => q.status === 'sent' || q.status === 'draft').length}
          </div>
          <div className="text-xs text-[#555555] mt-1">Awaiting client decision</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E5E2]">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'draft', 'sent', 'accepted', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#111111] text-white'
                  : 'text-[#555555] hover:bg-[#F0F0ED] hover:text-[#111111]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#858585]" />
          <input
            type="text"
            placeholder="Search quotations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E5E5E2] text-xs focus:outline-none focus:ring-1 focus:ring-[#1400FF] bg-[#F7F7F5]"
          />
        </div>
      </div>

      {/* Quotations Table */}
      <Card className="bg-white border border-[#E5E5E2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#858585] font-mono uppercase tracking-wider border-b border-[#E5E5E2]">
              <tr>
                <th className="py-3.5 px-4">Quotation #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#858585]">
                    No quotations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#111111]">
                      <Link
                        href={`/admin/quotations/${quote.id}`}
                        className="text-[#1400FF] hover:underline flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{quote.quotation_number}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#111111]">
                      <div>{quote.client_name || 'Client'}</div>
                      <div className="text-[10px] text-[#858585]">{quote.client_email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#555555]">
                      {new Date(quote.issue_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-[#555555]">
                      {new Date(quote.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#111111]">
                      {formatMoney(quote.total, quote.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                          quote.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : quote.status === 'sent'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : quote.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <Link
                        href={`/admin/quotations/${quote.id}`}
                        className="inline-flex px-2.5 py-1 rounded-lg bg-[#F0F0ED] hover:bg-[#E5E5E2] text-[#111111] text-[11px] font-medium transition-colors"
                      >
                        View
                      </Link>
                      {quote.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(quote.id, 'sent')}
                          className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1400FF] text-[11px] font-medium transition-colors"
                          title="Mark Sent"
                        >
                          Send
                        </button>
                      )}
                      {quote.status === 'sent' && (
                        <button
                          onClick={() => handleStatusChange(quote.id, 'accepted')}
                          className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-medium transition-colors"
                          title="Mark Accepted"
                        >
                          Accept
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(quote.id, quote.quotation_number)}
                        className="p-1 rounded-lg text-[#858585] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE QUOTATION MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E5E5E2] flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-base text-[#111111]">Create New Quotation</h3>
                <p className="text-xs text-[#858585]">
                  Automated line items, tax, and professional agency proposal.
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-[#111111] hover:bg-[#F0F0ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleCreateQuotation} className="p-6 space-y-6 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Client & Currency Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Select Client *</label>
                  <select
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      setProjectId('');
                    }}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white focus:ring-1 focus:ring-[#1400FF]"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name} ({c.contact_person})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white focus:ring-1 focus:ring-[#1400FF]"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              {/* Associated Project (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111]">
                  Associated Project (Optional)
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white focus:ring-1 focus:ring-[#1400FF]"
                >
                  <option value="">-- None / Standalone Proposal --</option>
                  {projects
                    .filter((p) => !clientId || p.client_id === clientId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white focus:ring-1 focus:ring-[#1400FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white focus:ring-1 focus:ring-[#1400FF]"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111]">
                    Scope Line Items
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1400FF] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            placeholder="Deliverable description (e.g. Meta Ads Management & Strategy)"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            required
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5E5E2] text-xs bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length <= 1}
                          className="p-1.5 rounded text-[#858585] hover:text-red-600 disabled:opacity-30"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-[#858585] block">Quantity</span>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, 'quantity', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2.5 py-1 rounded-lg border border-[#E5E5E2] bg-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#858585] block">Unit Price</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unit_price}
                            onChange={(e) =>
                              updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2.5 py-1 rounded-lg border border-[#E5E5E2] bg-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#858585] block">Discount</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.discount}
                            onChange={(e) =>
                              updateItem(index, 'discount', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2.5 py-1 rounded-lg border border-[#E5E5E2] bg-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#858585] block">Total</span>
                          <div className="py-1 px-2 font-mono font-semibold text-[#111111]">
                            {formatMoney(item.total, currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Calculations */}
              <div className="p-4 rounded-xl bg-[#F0F0ED] border border-[#E5E5E2] space-y-2 text-xs">
                <div className="flex justify-between text-[#555555]">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">{formatMoney(subtotal, currency)}</span>
                </div>
                <div className="flex items-center justify-between text-[#555555]">
                  <span>Overall Discount:</span>
                  <input
                    type="number"
                    min="0"
                    value={globalDiscount}
                    onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-0.5 text-right font-mono bg-white rounded border border-[#E5E5E2]"
                  />
                </div>
                <div className="flex items-center justify-between text-[#555555]">
                  <span>Tax / VAT Amount:</span>
                  <input
                    type="number"
                    min="0"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-0.5 text-right font-mono bg-white rounded border border-[#E5E5E2]"
                  />
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#D8D8D4]">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base text-[#1400FF]">
                    {formatMoney(grandTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Terms & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#111111]">Terms & Conditions</label>
                  <textarea
                    rows={3}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F0F0ED] border border-[#E5E5E2] text-xs font-medium text-[#555555]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Generate Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
