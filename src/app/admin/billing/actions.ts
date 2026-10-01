'use server';

import { isUuid } from '@/lib/db';
import { adminAction } from '@/lib/actions/guard';
import { CURRENCIES, INVOICE_STATUSES, InvoiceStatus } from '@/lib/invoiceMeta';
import {
  InvoiceInput,
  saveInvoice,
  addPayment,
  deletePayment,
  deleteInvoiceRecord,
} from '@/lib/services/invoiceService';

const LIST = '/admin/billing';

function requireId(id: unknown, what = 'id'): string {
  if (typeof id !== 'string' || !isUuid(id)) throw new Error(`Invalid ${what}`);
  return id;
}

const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const num = (v: unknown) => (Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : 0);
const str = (v: unknown) => (v == null ? '' : String(v));

function clean(input: InvoiceInput): InvoiceInput {
  if (!isDate(input.issue_date) || !isDate(input.due_date)) throw new Error('Issue and due dates are required');
  if (!INVOICE_STATUSES.includes(input.status as InvoiceStatus)) throw new Error('Invalid status');
  if (!CURRENCIES.includes(input.currency)) throw new Error('Invalid currency');
  const link = str(input.cta_payment_link).trim();
  if (link && !/^https?:\/\//i.test(link) && !/^[\w.-]+\.[a-z]{2,}/i.test(link)) {
    throw new Error('Payment link must be a web address');
  }
  return {
    client_id: requireId(input.client_id, 'client'),
    business_id: input.business_id ? requireId(input.business_id, 'business') : null,
    client_company: str(input.client_company).trim(),
    client_address: str(input.client_address).trim(),
    project_id: input.project_id ? requireId(input.project_id, 'project') : null,
    issue_date: input.issue_date,
    due_date: input.due_date,
    currency: input.currency,
    status: input.status,
    discount_type: ['percent', 'fixed'].includes(input.discount_type) ? input.discount_type : 'none',
    discount_value: input.discount_type === 'percent' ? Math.min(100, num(input.discount_value)) : num(input.discount_value),
    discount_note: str(input.discount_note),
    tax_rate: Math.min(100, num(input.tax_rate)),
    tax_label: str(input.tax_label).trim() || 'Tax',
    invoice_notes: str(input.invoice_notes),
    notes: str(input.notes),
    cta_enabled: Boolean(input.cta_enabled),
    cta_title: str(input.cta_title),
    cta_description: str(input.cta_description),
    cta_payment_link: link,
    cta_button_text: str(input.cta_button_text).trim() || 'Pay Now',
    access_expires_at: isDate(input.access_expires_at) ? input.access_expires_at : null,
    pdf_expires_at: isDate(input.pdf_expires_at) ? input.pdf_expires_at : null,
    items: (input.items ?? []).map((it) => ({
      description: str(it.description),
      quantity: num(it.quantity) || 1,
      unit_price: num(it.unit_price),
    })),
  };
}

export async function saveInvoiceAction(id: string | null, input: InvoiceInput) {
  return adminAction(
    (admin) => saveInvoice(id ? requireId(id) : null, clean(input), admin.full_name),
    [LIST, ...(id ? [`${LIST}/${id}`] : [])]
  );
}

export async function deleteInvoiceAction(id: string) {
  return adminAction(() => deleteInvoiceRecord(requireId(id)), [LIST]);
}

export async function addPaymentAction(
  invoiceId: string,
  p: { amount: number; payment_method: string; reference: string; notes: string; payment_date: string }
) {
  return adminAction(() => {
    const amount = Number(p.amount);
    if (!(amount > 0)) throw new Error('Payment amount must be greater than zero');
    return addPayment(requireId(invoiceId), {
      amount,
      payment_method: str(p.payment_method).trim(),
      reference: str(p.reference).trim(),
      notes: str(p.notes).trim(),
      payment_date: isDate(p.payment_date) ? p.payment_date : new Date().toISOString().slice(0, 10),
    });
  }, [LIST, `${LIST}/${invoiceId}`]);
}

export async function deletePaymentAction(invoiceId: string, paymentId: string) {
  return adminAction(() => deletePayment(requireId(invoiceId), requireId(paymentId, 'payment')), [
    LIST,
    `${LIST}/${invoiceId}`,
  ]);
}
