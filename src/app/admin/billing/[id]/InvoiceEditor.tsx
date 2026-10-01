'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CreditCard,
  Download,
  ExternalLink,
  Loader2,
  Plus,
  Receipt,
  Save,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from 'lucide-react';
import type { InvoiceDetail, BillingClientOption } from '@/lib/services/invoiceService';
import {
  CURRENCIES,
  INVOICE_STATUSES,
  INVOICE_STATUS_META,
  InvoiceStatus,
  computeTotals,
  formatMoney,
  todayISO,
  plusDaysISO,
} from '@/lib/invoiceMeta';
import { ClientPicker, Field } from '@/components/admin/ClientPicker';
import { saveInvoiceAction, deleteInvoiceAction, addPaymentAction, deletePaymentAction } from '../actions';

const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-[#E5E5E2] bg-white text-[#111111] focus:outline-none focus:border-[#1400FF] transition-colors';
const textareaCls = `${inputCls} resize-none`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E2] shadow-xs p-5 sm:p-6">
      <h2 className="text-[11px] font-mono font-semibold text-[#858585] uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ─── Editor ─────────────────────────────────────────────────────────────────

interface FormItem {
  description: string;
  quantity: string;
  unit_price: string;
}
const BLANK_ITEM: FormItem = { description: '', quantity: '1', unit_price: '0' };
const blankPay = () => ({ amount: '', payment_method: '', reference: '', notes: '', payment_date: todayISO() });

export function InvoiceEditor({
  invoice,
  clients,
  defaultCurrency,
  defaultTaxRate,
}: {
  invoice: InvoiceDetail | null;
  clients: BillingClientOption[];
  defaultCurrency: string;
  defaultTaxRate: number;
}) {
  const router = useRouter();
  const isNew = !invoice;

  const [clientId, setClientId] = useState(invoice?.client_id ?? '');
  const [businessId, setBusinessId] = useState(invoice?.business_id ?? '');
  const [clientCompany, setClientCompany] = useState(invoice?.client_company ?? '');
  const [clientAddress, setClientAddress] = useState(invoice?.client_address ?? '');
  const [issueDate, setIssueDate] = useState(invoice?.issue_date ?? todayISO());
  const [dueDate, setDueDate] = useState(invoice?.due_date ?? plusDaysISO(7));
  const [currency, setCurrency] = useState(invoice?.currency ?? (CURRENCIES.includes(defaultCurrency) ? defaultCurrency : 'BDT'));
  const [status, setStatus] = useState<InvoiceStatus>(invoice?.status ?? 'draft');
  const [discountType, setDiscountType] = useState(invoice?.discount_type ?? 'none');
  const [discountValue, setDiscountValue] = useState(String(invoice?.discount_value ?? 0));
  const [discountNote, setDiscountNote] = useState(invoice?.discount_note ?? '');
  const [taxRate, setTaxRate] = useState(String(invoice?.tax_rate ?? defaultTaxRate));
  const [taxLabel, setTaxLabel] = useState(invoice?.tax_label ?? 'Tax');
  const [invoiceNotes, setInvoiceNotes] = useState(invoice?.invoice_notes ?? '');
  const [paymentNotes, setPaymentNotes] = useState(invoice?.notes ?? '');
  const [ctaEnabled, setCtaEnabled] = useState(invoice?.cta_enabled ?? false);
  const [ctaTitle, setCtaTitle] = useState(invoice?.cta_title ?? '');
  const [ctaDescription, setCtaDescription] = useState(invoice?.cta_description ?? '');
  const [ctaPaymentLink, setCtaPaymentLink] = useState(invoice?.cta_payment_link ?? '');
  const [ctaButtonText, setCtaButtonText] = useState(invoice?.cta_button_text ?? 'Pay Now');
  const [accessExpiresAt, setAccessExpiresAt] = useState(invoice?.access_expires_at ?? '');
  const [pdfExpiresAt, setPdfExpiresAt] = useState(invoice?.pdf_expires_at ?? '');
  const [items, setItems] = useState<FormItem[]>(
    invoice?.items.length
      ? invoice.items.map((i) => ({ description: i.description, quantity: String(i.quantity), unit_price: String(i.unit_price) }))
      : [{ ...BLANK_ITEM }]
  );

  const [newPay, setNewPay] = useState(blankPay);
  const [addingPay, setAddingPay] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingPay, setSavingPay] = useState(false);

  const payments = invoice?.payments ?? [];
  const paid = payments.reduce((s, p) => s + p.amount, 0);
  const { subtotal, discountAmount, taxAmount, total } = computeTotals(
    items.map((i) => ({ quantity: parseFloat(i.quantity) || 0, unit_price: parseFloat(i.unit_price) || 0 })),
    discountType,
    parseFloat(discountValue) || 0,
    parseFloat(taxRate) || 0
  );

  function updateItem(idx: number, field: keyof FormItem, value: string) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }

  async function handleSave() {
    if (!clientId) return;
    setSaving(true);
    const res = await saveInvoiceAction(invoice?.id ?? null, {
      client_id: clientId,
      business_id: businessId || null,
      client_company: clientCompany,
      client_address: clientAddress,
      project_id: invoice?.project_id ?? null,
      issue_date: issueDate,
      due_date: dueDate,
      currency,
      status,
      discount_type: discountType,
      discount_value: parseFloat(discountValue) || 0,
      discount_note: discountNote,
      tax_rate: parseFloat(taxRate) || 0,
      tax_label: taxLabel,
      invoice_notes: invoiceNotes,
      notes: paymentNotes,
      cta_enabled: ctaEnabled,
      cta_title: ctaTitle,
      cta_description: ctaDescription,
      cta_payment_link: ctaPaymentLink,
      cta_button_text: ctaButtonText,
      access_expires_at: accessExpiresAt || null,
      pdf_expires_at: pdfExpiresAt || null,
      items: items.map((it) => ({
        description: it.description,
        quantity: parseFloat(it.quantity) || 1,
        unit_price: parseFloat(it.unit_price) || 0,
      })),
    });
    setSaving(false);
    if (!res.success || !res.data) {
      alert(res.error || 'Failed to save invoice.');
      return;
    }
    if (isNew) router.push(`/admin/billing/${res.data.id}`);
    else router.refresh();
  }

  async function handleDelete() {
    if (!invoice || !confirm('Delete this invoice and all its payments? This cannot be undone.')) return;
    setDeleting(true);
    const res = await deleteInvoiceAction(invoice.id);
    if (res.success) router.push('/admin/billing');
    else {
      alert(res.error || 'Failed to delete invoice.');
      setDeleting(false);
    }
  }

  async function handleAddPayment() {
    const amount = parseFloat(newPay.amount);
    if (!invoice || !(amount > 0)) return;
    setSavingPay(true);
    const res = await addPaymentAction(invoice.id, { ...newPay, amount });
    setSavingPay(false);
    if (!res.success) {
      alert(res.error || 'Failed to record payment.');
      return;
    }
    setNewPay(blankPay());
    setAddingPay(false);
    router.refresh();
  }

  async function handleDeletePayment(paymentId: string) {
    if (!invoice || !confirm('Remove this payment?')) return;
    const res = await deletePaymentAction(invoice.id, paymentId);
    if (res.success) router.refresh();
    else alert(res.error || 'Failed to remove payment.');
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/admin/billing')}
            aria-label="Back to billing"
            className="p-2 rounded-lg text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <Receipt className="w-4 h-4 text-[#1400FF]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#111111] truncate font-mono">
              {isNew ? 'New Invoice' : invoice.invoice_number}
            </h1>
            {!isNew && (
              <div className="flex items-center gap-2 mt-0.5">
                <a
                  href={`/billing/${invoice.invoice_number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#1400FF] hover:underline flex items-center gap-1"
                >
                  Public view <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[#E5E5E2]">·</span>
                <a
                  href={`/billing/${invoice.invoice_number}?print=1`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#555555] hover:text-[#1400FF] flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> PDF
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete invoice"
              className="p-2.5 rounded-lg text-[#858585] hover:text-rose-600 hover:bg-rose-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !clientId}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1400FF] text-white text-sm font-medium rounded-lg hover:bg-[#0F00CC] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : isNew ? 'Create Invoice' : 'Save Changes'}
          </button>
        </div>
      </div>

      <Section title="Client Information">
        <ClientPicker
          clients={clients}
          clientId={clientId}
          businessId={businessId}
          company={clientCompany}
          address={clientAddress}
          onClient={(c) => {
            setClientId(c?.id ?? '');
            setBusinessId('');
            setClientCompany('');
            setClientAddress('');
          }}
          onBusiness={(id, name, address) => {
            setBusinessId(id);
            setClientCompany(name);
            setClientAddress(address);
          }}
          onCompany={setClientCompany}
          onAddress={setClientAddress}
        />
      </Section>

      <Section title="Invoice Details">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Issue Date">
            <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Due Date">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Currency">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)} className={inputCls}>
              {INVOICE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {INVOICE_STATUS_META[s].label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="text-[11px] text-[#858585] mt-3">
          Paid, partial and overdue follow from payments and the due date; draft and cancelled stick.
        </p>
      </Section>

      <Section title="Line Items">
        <div className="hidden sm:grid grid-cols-[1fr_80px_150px_36px] gap-2 px-1 mb-2">
          {['Description', 'Qty', 'Unit Price', ''].map((h) => (
            <span key={h} className="text-[10px] font-mono font-semibold text-[#858585] uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => {
            const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
            return (
              <div key={idx} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_80px_150px_36px] gap-2 items-start">
                <input
                  value={item.description}
                  onChange={(e) => updateItem(idx, 'description', e.target.value)}
                  className={inputCls}
                  placeholder="Item description"
                />
                <div className="flex sm:contents gap-2">
                  <input
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    type="number"
                    min="0"
                    step="any"
                    className={`${inputCls} w-20 sm:w-full`}
                    placeholder="1"
                  />
                  <div className="relative">
                    <input
                      value={item.unit_price}
                      onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                      type="number"
                      min="0"
                      step="any"
                      className={inputCls}
                      placeholder="0"
                    />
                    <span className="block text-[10px] text-[#858585] font-mono mt-0.5 text-right">
                      {formatMoney(amount, currency)}
                    </span>
                  </div>
                  <button
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                    disabled={items.length <= 1}
                    title="Remove item"
                    className="p-2 rounded-lg text-[#858585] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setItems((prev) => [...prev, { ...BLANK_ITEM }])}
          className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#1400FF] hover:text-[#0F00CC]"
        >
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </Section>

      <Section title="Discount & Tax">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Field label="Discount Type">
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className={inputCls}>
              <option value="none">None</option>
              <option value="percent">Percent (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </Field>
          <Field label="Discount Value">
            <input
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              type="number"
              min="0"
              step="any"
              disabled={discountType === 'none'}
              className={`${inputCls} ${discountType === 'none' ? 'opacity-40' : ''}`}
              placeholder="0"
            />
          </Field>
          <Field label="Discount Note">
            <input value={discountNote} onChange={(e) => setDiscountNote(e.target.value)} className={inputCls} placeholder="Optional label" />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tax Rate (%)">
            <input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} type="number" min="0" step="any" className={inputCls} placeholder="0" />
          </Field>
          <Field label="Tax Label">
            <input value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} className={inputCls} placeholder="Tax / VAT / GST" />
          </Field>
        </div>
      </Section>

      <Section title="Totals Preview">
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-[#555555] font-sans">Subtotal</span>
              <span className="text-[#111111]">{formatMoney(subtotal, currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between gap-3">
                <span className="text-[#555555] font-sans">
                  Discount{discountType === 'percent' ? ` (${discountValue}%)` : ''}
                  {discountNote ? ` — ${discountNote}` : ''}
                </span>
                <span className="text-emerald-600">-{formatMoney(discountAmount, currency)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#555555] font-sans">
                  {taxLabel} ({taxRate}%)
                </span>
                <span className="text-[#111111]">{formatMoney(taxAmount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-[#E5E5E2]">
              <span className="text-[#111111] font-sans">Total</span>
              <span className="text-[#1400FF]">{formatMoney(total, currency)}</span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Notes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Invoice Notes">
            <textarea
              value={invoiceNotes}
              onChange={(e) => setInvoiceNotes(e.target.value)}
              rows={3}
              className={textareaCls}
              placeholder="Terms, project scope, any note for the client…"
            />
          </Field>
          <Field label="Payment Notes">
            <textarea
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              rows={3}
              className={textareaCls}
              placeholder="Bank details, payment instructions…"
            />
          </Field>
        </div>
      </Section>

      <Section title="Payment CTA">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-[#111111]">Show payment CTA to client</p>
            <p className="text-xs text-[#858585]">Displays a payment button on the invoice page (hidden when fully paid)</p>
          </div>
          <button
            type="button"
            onClick={() => setCtaEnabled((v) => !v)}
            aria-pressed={ctaEnabled}
            aria-label="Toggle payment CTA"
            className="text-[#1400FF]"
          >
            {ctaEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-[#858585]" />}
          </button>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity ${ctaEnabled ? '' : 'opacity-40 pointer-events-none'}`}>
          <Field label="CTA Title">
            <input value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} className={inputCls} placeholder="Payment Required" />
          </Field>
          <Field label="Button Text">
            <input value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} className={inputCls} placeholder="Pay Now" />
          </Field>
          <Field label="CTA Description" className="sm:col-span-2">
            <textarea
              value={ctaDescription}
              onChange={(e) => setCtaDescription(e.target.value)}
              rows={2}
              className={textareaCls}
              placeholder="Please complete payment via bKash or bank transfer…"
            />
          </Field>
          <Field label="Payment Link URL" className="sm:col-span-2">
            <input
              value={ctaPaymentLink}
              onChange={(e) => setCtaPaymentLink(e.target.value)}
              className={inputCls}
              placeholder="https://…"
            />
          </Field>
        </div>
      </Section>

      <Section title="Lifecycle Overrides">
        <p className="text-xs text-[#858585] mb-4 leading-relaxed">
          By default: full access expires 3 days after paid; PDF-only window lasts until day 10. Set dates here to override.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Extend Full Access Until">
            <input type="date" value={accessExpiresAt} onChange={(e) => setAccessExpiresAt(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Extend PDF Access Until">
            <input type="date" value={pdfExpiresAt} onChange={(e) => setPdfExpiresAt(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <button
          onClick={() => {
            setAccessExpiresAt('');
            setPdfExpiresAt('');
          }}
          className="mt-3 text-xs text-[#858585] hover:text-rose-600"
        >
          Clear overrides (use defaults)
        </button>
      </Section>

      {!isNew && (
        <Section title="Payments">
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-sm text-[#111111]">
              Paid: <span className="font-bold text-emerald-600 font-mono">{formatMoney(paid, currency)}</span> of{' '}
              <span className="font-bold font-mono">{formatMoney(invoice.total, currency)}</span>
            </p>
            <button
              onClick={() => setAddingPay((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#1400FF] border border-[#C7D2FE] rounded-lg hover:bg-[#EEF2FF]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Payment
            </button>
          </div>

          {addingPay && (
            <div className="bg-[#F7F7F5] rounded-xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Amount *">
                <input
                  value={newPay.amount}
                  onChange={(e) => setNewPay((p) => ({ ...p, amount: e.target.value }))}
                  type="number"
                  min="0"
                  step="any"
                  className={inputCls}
                  placeholder="0.00"
                />
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  value={newPay.payment_date}
                  onChange={(e) => setNewPay((p) => ({ ...p, payment_date: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Method">
                <input
                  value={newPay.payment_method}
                  onChange={(e) => setNewPay((p) => ({ ...p, payment_method: e.target.value }))}
                  className={inputCls}
                  placeholder="bKash / Bank / Cash…"
                />
              </Field>
              <Field label="Reference">
                <input
                  value={newPay.reference}
                  onChange={(e) => setNewPay((p) => ({ ...p, reference: e.target.value }))}
                  className={inputCls}
                  placeholder="Txn ID or ref"
                />
              </Field>
              <Field label="Note" className="col-span-2">
                <input
                  value={newPay.notes}
                  onChange={(e) => setNewPay((p) => ({ ...p, notes: e.target.value }))}
                  className={inputCls}
                  placeholder="Optional note"
                />
              </Field>
              <div className="col-span-2 sm:col-span-3 flex gap-2 justify-end pt-1">
                <button
                  onClick={() => {
                    setAddingPay(false);
                    setNewPay(blankPay());
                  }}
                  className="px-4 py-2 text-sm text-[#555555] border border-[#E5E5E2] bg-white rounded-lg hover:bg-[#F0F0ED]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  disabled={savingPay || !(parseFloat(newPay.amount) > 0)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                >
                  {savingPay ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Record Payment
                </button>
              </div>
            </div>
          )}

          {payments.length === 0 ? (
            <p className="text-sm text-[#858585] py-4 text-center">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 py-3 px-4 bg-[#F7F7F5] rounded-lg">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111111]">
                      {p.payment_date}
                      {p.payment_method && <span className="text-[#858585]"> · {p.payment_method}</span>}
                    </p>
                    {(p.reference || p.notes) && (
                      <p className="text-xs text-[#858585] truncate">
                        {[p.reference && `Ref: ${p.reference}`, p.notes].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-emerald-600 font-mono">+{formatMoney(p.amount, currency)}</span>
                    <button
                      onClick={() => handleDeletePayment(p.id)}
                      title="Remove payment"
                      className="p-1.5 rounded-lg text-[#858585] hover:text-rose-600 hover:bg-rose-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
