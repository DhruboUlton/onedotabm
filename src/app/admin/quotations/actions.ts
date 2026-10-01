'use server';

import { isUuid } from '@/lib/db';
import { adminAction } from '@/lib/actions/guard';
import { CURRENCIES } from '@/lib/invoiceMeta';
import { QUOTATION_STATUSES, QuotationStatus } from '@/lib/quotationMeta';
import {
  QuotationInput,
  saveQuotation,
  deleteQuotationRecord,
  convertToInvoice,
  convertToProject,
  getProjectScope,
} from '@/lib/services/quotationService';

const LIST = '/admin/quotations';

function requireId(id: unknown, what = 'id'): string {
  if (typeof id !== 'string' || !isUuid(id)) throw new Error(`Invalid ${what}`);
  return id;
}
const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const num = (v: unknown) => (Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : 0);
const str = (v: unknown) => (v == null ? '' : String(v));

function clean(i: QuotationInput): QuotationInput {
  if (!isDate(i.issue_date) || !isDate(i.expiry_date)) throw new Error('Issue and valid-until dates are required');
  if (!QUOTATION_STATUSES.includes(i.status as QuotationStatus)) throw new Error('Invalid status');
  if (!CURRENCIES.includes(i.currency)) throw new Error('Invalid currency');
  return {
    client_id: requireId(i.client_id, 'client'),
    business_id: i.business_id ? requireId(i.business_id, 'business') : null,
    client_company: str(i.client_company).trim(),
    client_address: str(i.client_address).trim(),
    project_id: i.project_id ? requireId(i.project_id, 'project') : null,
    title: str(i.title).trim() || 'Project Quotation',
    status: i.status,
    issue_date: i.issue_date,
    expiry_date: i.expiry_date,
    currency: i.currency,
    discount_type: ['percent', 'fixed'].includes(i.discount_type) ? i.discount_type : 'none',
    discount_value: i.discount_type === 'percent' ? Math.min(100, num(i.discount_value)) : num(i.discount_value),
    discount_note: str(i.discount_note).trim(),
    tax_rate: Math.min(100, num(i.tax_rate)),
    tax_label: str(i.tax_label).trim() || 'Tax',
    scope_overview: str(i.scope_overview).trim(),
    project_timeline: str(i.project_timeline).trim(),
    payment_terms: str(i.payment_terms).trim(),
    terms: str(i.terms).trim(),
    notes: str(i.notes).trim(),
    items: (i.items ?? []).map((it) => ({
      description: str(it.description),
      deliverables: str(it.deliverables),
      quantity: num(it.quantity) || 1,
      unit_price: num(it.unit_price),
    })),
  };
}

export async function saveQuotationAction(id: string | null, input: QuotationInput) {
  return adminAction((admin) => saveQuotation(id ? requireId(id) : null, clean(input), admin.full_name), [
    LIST,
    ...(id ? [`${LIST}/${id}`] : []),
  ]);
}

export async function deleteQuotationAction(id: string) {
  return adminAction(() => deleteQuotationRecord(requireId(id)), [LIST]);
}

export async function convertToInvoiceAction(id: string) {
  return adminAction(() => convertToInvoice(requireId(id)), [LIST, `${LIST}/${id}`, '/admin/billing']);
}

export async function convertToProjectAction(id: string) {
  return adminAction(() => convertToProject(requireId(id)), [LIST, `${LIST}/${id}`, '/admin/projects']);
}

export async function getProjectScopeAction(projectId: string) {
  return adminAction(async () => {
    const scope = await getProjectScope(requireId(projectId, 'project'));
    if (!scope) throw new Error('Project not found');
    return scope;
  });
}
