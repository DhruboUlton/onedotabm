'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  FolderKanban,
  Loader2,
  Plus,
  Receipt,
  Save,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { QuotationDetail } from '@/lib/services/quotationService';
import type { BillingClientOption } from '@/lib/services/invoiceService';
import type { ProjectOption } from '@/lib/services/operationsService';
import { ClientPicker, Field } from '@/components/admin/ClientPicker';
import {
  CURRENCIES,
  computeTotals,
  formatMoney,
  todayISO,
  plusDaysISO,
} from '@/lib/invoiceMeta';
import {
  QUOTATION_STATUSES,
  QUOTATION_STATUS_META,
  quotationStatusMeta,
  PRESET_SERVICES,
  DEFAULT_PAYMENT_TERMS,
  DEFAULT_TERMS,
  QuotationStatus,
} from '@/lib/quotationMeta';
import {
  saveQuotationAction,
  deleteQuotationAction,
  convertToInvoiceAction,
  convertToProjectAction,
  getProjectScopeAction,
} from '../actions';

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

interface FormItem {
  description: string;
  deliverables: string;
  quantity: string;
  unit_price: string;
}
const BLANK: FormItem = { description: '', deliverables: '', quantity: '1', unit_price: '0' };

export function QuotationEditor({
  quotation,
  clients,
  projects,
  initialProjectId,
  defaultCurrency,
  defaultTaxRate,
}: {
  quotation: QuotationDetail | null;
  clients: BillingClientOption[];
  projects: ProjectOption[];
  initialProjectId: string;
  defaultCurrency: string;
  defaultTaxRate: number;
}) {
  const router = useRouter();
  const isNew = !quotation;

  const [title, setTitle] = useState(quotation?.title ?? 'Project Quotation');
  const [status, setStatus] = useState<QuotationStatus>(quotation?.status ?? 'draft');
  const [projectId, setProjectId] = useState(quotation?.project_id ?? initialProjectId);
  const [clientId, setClientId] = useState(quotation?.client_id ?? '');
  const [businessId, setBusinessId] = useState(quotation?.business_id ?? '');
  const [clientCompany, setClientCompany] = useState(quotation?.client_company ?? '');
  const [clientAddress, setClientAddress] = useState(quotation?.client_address ?? '');
  const [issueDate, setIssueDate] = useState(quotation?.issue_date ?? todayISO());
  const [validUntil, setValidUntil] = useState(quotation?.expiry_date ?? plusDaysISO(14));
  const [currency, setCurrency] = useState(quotation?.currency ?? (CURRENCIES.includes(defaultCurrency) ? defaultCurrency : 'BDT'));
  const [scope, setScope] = useState(quotation?.scope_overview ?? '');
  const [timeline, setTimeline] = useState(quotation?.project_timeline ?? '');
  const [paymentTerms, setPaymentTerms] = useState(quotation?.payment_terms ?? DEFAULT_PAYMENT_TERMS);
  const [terms, setTerms] = useState(quotation?.terms ?? DEFAULT_TERMS);
  const [notes, setNotes] = useState(quotation?.notes ?? '');
  const [discountType, setDiscountType] = useState(quotation?.discount_type ?? 'none');
  const [discountValue, setDiscountValue] = useState(String(quotation?.discount_value ?? 0));
  const [discountNote, setDiscountNote] = useState(quotation?.discount_note ?? '');
  const [taxRate, setTaxRate] = useState(String(quotation?.tax_rate ?? defaultTaxRate));
  const [taxLabel, setTaxLabel] = useState(quotation?.tax_label ?? 'Tax');
  const [pricingMode, setPricingMode] = useState<'per_item' | 'single'>(quotation?.pricing_mode ?? 'per_item');
  const [lumpSum, setLumpSum] = useState(String(quotation?.lump_sum ?? 0));
  const [items, setItems] = useState<FormItem[]>(
    quotation?.items.length
      ? quotation.items.map((i) => ({
          description: i.description,
          deliverables: i.deliverables,
          quantity: String(i.quantity),
          unit_price: String(i.unit_price),
        }))
      : [{ ...BLANK }]
  );

  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const { subtotal, discountAmount, taxAmount, total } = computeTotals(
    pricingMode === 'single'
      ? [{ quantity: 1, unit_price: parseFloat(lumpSum) || 0 }]
      : items.map((i) => ({ quantity: parseFloat(i.quantity) || 0, unit_price: parseFloat(i.unit_price) || 0 })),
    discountType,
    parseFloat(discountValue) || 0,
    parseFloat(taxRate) || 0
  );

  function updateItem(idx: number, patch: Partial<FormItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function setValidDays(days: number) {
    const base = new Date(issueDate);
    if (isNaN(base.getTime())) return;
    base.setDate(base.getDate() + days);
    setValidUntil(base.toISOString().slice(0, 10));
  }

  // Picking a project fills the scope from its services and deliverables.
  async function importProject(id: string) {
    if (!id) return;
    setImporting(true);
    const res = await getProjectScopeAction(id);
    setImporting(false);
    if (!res.success || !res.data) {
      alert(res.error || 'Could not read the project.');
      return;
    }
    const p = res.data;
    if (title === 'Project Quotation') setTitle(`${p.title} - Proposal & Scope`);
    if (!scope && p.description) setScope(p.description);
    if (!clientId && p.client_id && clients.some((c) => c.id === p.client_id)) {
      setClientId(p.client_id);
      const biz = clients.find((c) => c.id === p.client_id)?.businesses.find((b) => b.id === p.business_id);
      setBusinessId(biz?.id ?? '');
      setClientCompany(biz?.name ?? '');
      setClientAddress(biz?.address ?? '');
    }
    if (p.items.length === 0) {
      alert('That project has no services yet. Add line items below.');
    } else if (confirm(`Import ${p.items.length} services from "${p.title}" as line items? Set the prices afterwards.`)) {
      setItems(p.items.map((i) => ({ description: i.description, deliverables: i.deliverables, quantity: '1', unit_price: '0' })));
    }
  }

  useEffect(() => {
    // One-time import when arriving from a project's "Create Quotation" button.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isNew && initialProjectId) importProject(initialProjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    if (!clientId) return;
    setSaving(true);
    const res = await saveQuotationAction(quotation?.id ?? null, {
      client_id: clientId,
      business_id: businessId || null,
      client_company: clientCompany,
      client_address: clientAddress,
      project_id: projectId || null,
      title,
      status,
      issue_date: issueDate,
      expiry_date: validUntil,
      currency,
      discount_type: discountType,
      discount_value: parseFloat(discountValue) || 0,
      discount_note: discountNote,
      tax_rate: parseFloat(taxRate) || 0,
      tax_label: taxLabel,
      pricing_mode: pricingMode,
      lump_sum: parseFloat(lumpSum) || 0,
      scope_overview: scope,
      project_timeline: timeline,
      payment_terms: paymentTerms,
      terms,
      notes,
      items: items.map((i) => ({
        description: i.description,
        deliverables: i.deliverables,
        quantity: parseFloat(i.quantity) || 1,
        unit_price: parseFloat(i.unit_price) || 0,
      })),
    });
    setSaving(false);
    if (!res.success || !res.data) {
      alert(res.error || 'Failed to save quotation.');
      return;
    }
    if (isNew) router.push(`/admin/quotations/${res.data.id}`);
    else router.refresh();
  }

  async function handleDelete() {
    if (!quotation || !confirm('Delete this quotation? This cannot be undone.')) return;
    setBusy('delete');
    const res = await deleteQuotationAction(quotation.id);
    if (res.success) router.push('/admin/quotations');
    else {
      alert(res.error || 'Failed to delete quotation.');
      setBusy(null);
    }
  }

  async function handleConvertInvoice() {
    if (!quotation || !confirm('Convert this quotation into a draft invoice in Billing?')) return;
    setBusy('invoice');
    const res = await convertToInvoiceAction(quotation.id);
    if (res.success && res.data) router.push(`/admin/billing/${res.data.id}`);
    else {
      alert(res.error || 'Failed to convert to invoice.');
      setBusy(null);
    }
  }

  async function handleConvertProject() {
    if (!quotation || !confirm('Create a tracked project from this quotation scope and deliverables?')) return;
    setBusy('project');
    const res = await convertToProjectAction(quotation.id);
    if (res.success && res.data) router.push(`/admin/projects/${res.data.id}`);
    else {
      alert(res.error || 'Failed to create project.');
      setBusy(null);
    }
  }

  const meta = quotationStatusMeta(status);
  const actionBtn =
    'flex items-center gap-1.5 px-3.5 py-2 border text-xs font-medium rounded-lg bg-white transition-colors disabled:opacity-50';

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/admin/quotations')}
            aria-label="Back to quotations"
            className="p-2 rounded-lg text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[#111111] font-mono">
                {isNew ? 'New Quotation' : quotation.quotation_number}
              </h1>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.className}`}>{meta.label}</span>
            </div>
            {!isNew && (
              <a
                href={`/quote/${quotation.quotation_number}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#1400FF] hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                Public view <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isNew && (
            <>
              {!quotation.project_id && (
                <button onClick={handleConvertProject} disabled={busy !== null} className={`${actionBtn} border-[#C7D2FE] text-[#1400FF] hover:bg-[#EEF2FF]`}>
                  {busy === 'project' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FolderKanban className="w-3.5 h-3.5" />}
                  Create Project
                </button>
              )}
              {quotation.converted_invoice_id ? (
                <a href={`/admin/billing/${quotation.converted_invoice_id}`} className={`${actionBtn} border-violet-200 text-violet-700 hover:bg-violet-50`}>
                  <Receipt className="w-3.5 h-3.5" /> View Invoice
                </a>
              ) : (
                <button onClick={handleConvertInvoice} disabled={busy !== null} className={`${actionBtn} border-violet-200 text-violet-700 hover:bg-violet-50`}>
                  {busy === 'invoice' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Receipt className="w-3.5 h-3.5" />}
                  Convert to Invoice
                </button>
              )}
              <button onClick={handleDelete} disabled={busy !== null} title="Delete quotation" className="p-2 rounded-lg text-[#858585] hover:text-rose-600 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !clientId}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1400FF] text-white text-sm font-medium rounded-lg hover:bg-[#0F00CC] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : isNew ? 'Create Quotation' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section title="Client">
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

          <Section title="Proposal">
            <div className="space-y-4">
              <Field label="Project Title">
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Store Redesign & Marketing Sprint" />
              </Field>
              <Field label="Linked Project">
                <div className="flex gap-2">
                  <select
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      importProject(e.target.value);
                    }}
                    className={inputCls}
                  >
                    <option value="">No project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_name}
                      </option>
                    ))}
                  </select>
                  {importing && <Loader2 className="w-4 h-4 animate-spin text-[#858585] self-center" />}
                </div>
                <p className="text-[11px] text-[#858585] mt-1">Choosing a project offers to import its services and deliverables as line items.</p>
              </Field>
              <Field label="Scope Overview">
                <textarea value={scope} onChange={(e) => setScope(e.target.value)} rows={4} className={textareaCls} placeholder="Project context, goals, and what this quotation covers…" />
              </Field>
            </div>
          </Section>

          <Section title="Scope & Pricing">
            <div className="inline-flex rounded-lg border border-[#E5E5E2] p-0.5 mb-4 bg-[#F7F7F5]">
              {([['per_item', 'Price per service'], ['single', 'Single total price']] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    if (mode === 'single' && !(parseFloat(lumpSum) > 0)) setLumpSum(String(subtotal));
                    setPricingMode(mode);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                    pricingMode === mode ? 'bg-white text-[#1400FF] shadow-xs' : 'text-[#555555] hover:text-[#111111]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="text-[11px] text-[#858585] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Presets:
              </span>
              {PRESET_SERVICES.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() =>
                    setItems((prev) => [
                      ...(prev.length === 1 && !prev[0].description && prev[0].unit_price === '0' ? [] : prev),
                      { description: p.title, deliverables: p.deliverables, quantity: String(p.quantity), unit_price: String(p.unit_price) },
                    ])
                  }
                  className="px-2.5 py-1 text-[11px] rounded-lg border border-[#E5E5E2] bg-[#F7F7F5] text-[#555555] hover:border-[#1400FF] hover:text-[#1400FF]"
                >
                  + {p.title}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => {
                const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
                return (
                  <div key={idx} className="rounded-lg border border-[#E5E5E2] p-3 space-y-2 bg-[#FAFAF9]">
                    <div className="flex gap-2">
                      <input
                        value={item.description}
                        onChange={(e) => updateItem(idx, { description: e.target.value })}
                        className={inputCls}
                        placeholder="Service or milestone title"
                      />
                      <button
                        onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                        disabled={items.length <= 1}
                        title="Remove item"
                        className="p-2 rounded-lg text-[#858585] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={item.deliverables}
                      onChange={(e) => updateItem(idx, { deliverables: e.target.value })}
                      rows={2}
                      className={textareaCls}
                      placeholder="Deliverables and specifications included in this item…"
                    />
                    {pricingMode === 'per_item' && (
                    <div className="grid grid-cols-3 gap-2 items-end">
                      <Field label="Qty">
                        <input type="number" min="0" step="any" value={item.quantity} onChange={(e) => updateItem(idx, { quantity: e.target.value })} className={inputCls} />
                      </Field>
                      <Field label="Unit Price">
                        <input type="number" min="0" step="any" value={item.unit_price} onChange={(e) => updateItem(idx, { unit_price: e.target.value })} className={inputCls} />
                      </Field>
                      <p className="text-sm font-bold font-mono text-[#111111] text-right pb-2">{formatMoney(amount, currency)}</p>
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setItems((prev) => [...prev, { ...BLANK }])}
              className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#1400FF] hover:text-[#0F00CC]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
            {pricingMode === 'single' && (
              <div className="mt-4 rounded-lg border border-[#C7D2FE] bg-[#EEF2FF] p-3 max-w-xs">
                <Field label={`Total price (${currency})`}>
                  <input type="number" min="0" step="any" value={lumpSum} onChange={(e) => setLumpSum(e.target.value)} className={inputCls} />
                </Field>
              </div>
            )}
          </Section>

          <Section title="Timeline & Terms">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Project Timeline">
                  <textarea value={timeline} onChange={(e) => setTimeline(e.target.value)} rows={3} className={textareaCls} placeholder="Week 1: wireframes, Weeks 2-3: build, Week 4: QA & handover" />
                </Field>
                <Field label="Payment Terms">
                  <textarea value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} rows={3} className={textareaCls} placeholder="50% upfront, 50% on handover." />
                </Field>
              </div>
              <Field label="Terms & Conditions">
                <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={4} className={textareaCls} placeholder="Revision policy, ownership, out-of-scope clauses…" />
              </Field>
              <Field label="Private Notes (not shown to client)">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={textareaCls} placeholder="Notes for yourself about this quote…" />
              </Field>
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Status & Dates">
            <div className="space-y-4">
              <Field label="Status">
                <select value={status} onChange={(e) => setStatus(e.target.value as QuotationStatus)} className={inputCls}>
                  {QUOTATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {QUOTATION_STATUS_META[s].label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#858585] mt-1">{meta.desc}</p>
              </Field>
              <Field label="Issue Date">
                <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Valid Until">
                <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className={inputCls} />
                <div className="flex gap-1.5 mt-1.5">
                  {[7, 14, 30].map((d) => (
                    <button key={d} type="button" onClick={() => setValidDays(d)} className="px-2 py-1 text-[11px] rounded-md border border-[#E5E5E2] text-[#555555] hover:border-[#1400FF] hover:text-[#1400FF]">
                      +{d}d
                    </button>
                  ))}
                </div>
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
            </div>
          </Section>

          <Section title="Discount & Tax">
            <div className="space-y-3">
              <Field label="Discount">
                <div className="flex gap-2">
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className={inputCls}>
                    <option value="none">None</option>
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    disabled={discountType === 'none'}
                    className={`${inputCls} ${discountType === 'none' ? 'opacity-40' : ''}`}
                  />
                </div>
              </Field>
              <input value={discountNote} onChange={(e) => setDiscountNote(e.target.value)} className={inputCls} placeholder="Discount note (e.g. Early bird)" />
              <Field label="Tax">
                <div className="flex gap-2">
                  <input value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} className={inputCls} placeholder="VAT" />
                  <input type="number" min="0" step="any" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className={inputCls} placeholder="Rate %" />
                </div>
              </Field>
            </div>
          </Section>

          <Section title="Totals">
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-[#555555] font-sans">Subtotal</span>
                <span>{formatMoney(subtotal, currency)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#555555] font-sans">Discount</span>
                  <span className="text-emerald-600">-{formatMoney(discountAmount, currency)}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#555555] font-sans">
                    {taxLabel} ({taxRate}%)
                  </span>
                  <span>{formatMoney(taxAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-[#E5E5E2]">
                <span className="font-sans">Total</span>
                <span className="text-[#1400FF]">{formatMoney(total, currency)}</span>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
