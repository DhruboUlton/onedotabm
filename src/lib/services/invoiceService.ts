import { PoolClient } from 'pg';
import { dbQuery, dbTransaction, isUuid } from '@/lib/db';
import { logActivity } from '@/lib/services/activityService';
import {
  computeTotals,
  resolveInvoiceStatus,
  generateDocumentNumber,
  InvoiceStatus,
} from '@/lib/invoiceMeta';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total?: number;
}

export interface InvoicePayment {
  id: string;
  amount: number;
  payment_method: string;
  reference: string | null;
  notes: string | null;
  payment_date: string;
}

export interface InvoiceSummary {
  id: string;
  invoice_number: string;
  client_name: string | null;
  client_email: string | null;
  client_company: string;
  total: number;
  amount_paid: number;
  status: InvoiceStatus;
  due_date: string;
  currency: string;
}

export interface InvoiceDetail extends InvoiceSummary {
  client_id: string;
  business_id: string | null;
  client_phone: string | null;
  client_address: string;
  project_id: string | null;
  project_name: string | null;
  quotation_number: string | null;
  issue_date: string;
  subtotal: number;
  discount: number;
  tax: number;
  amount_due: number;
  discount_type: string;
  discount_value: number;
  discount_note: string;
  tax_rate: number;
  tax_label: string;
  invoice_notes: string;
  /** Payment instructions. */
  notes: string | null;
  cta_enabled: boolean;
  cta_title: string;
  cta_description: string;
  cta_payment_link: string;
  cta_button_text: string;
  fully_paid_at: string | null;
  access_expires_at: string | null;
  pdf_expires_at: string | null;
  items: InvoiceItem[];
  payments: InvoicePayment[];
}

export interface InvoiceInput {
  client_id: string;
  business_id: string | null;
  client_company: string;
  client_address: string;
  project_id: string | null;
  issue_date: string;
  due_date: string;
  currency: string;
  status: InvoiceStatus;
  discount_type: string;
  discount_value: number;
  discount_note: string;
  tax_rate: number;
  tax_label: string;
  invoice_notes: string;
  notes: string;
  cta_enabled: boolean;
  cta_title: string;
  cta_description: string;
  cta_payment_link: string;
  cta_button_text: string;
  access_expires_at: string | null;
  pdf_expires_at: string | null;
  items: InvoiceItem[];
}

const NUM = (v: unknown) => Number(v) || 0;

// Numeric columns arrive as strings from pg; status is recomputed so an unpaid
// invoice past its due date reads overdue without anyone touching it.
function normalize<T extends object>(row: T): T {
  const out = { ...row } as Record<string, unknown>;
  for (const k of ['subtotal', 'discount', 'tax', 'total', 'amount_paid', 'amount_due', 'discount_value', 'tax_rate']) {
    if (k in out) out[k] = NUM(out[k]);
  }
  if ('status' in out && 'due_date' in out) {
    out.status = resolveInvoiceStatus(String(out.status), NUM(out.total), NUM(out.amount_paid), String(out.due_date));
  }
  return out as T;
}

const SUMMARY_COLUMNS = `
  i.id, i.invoice_number, i.client_company, i.total, i.amount_paid, i.status,
  i.due_date::text, i.currency,
  c.contact_person AS client_name, c.email AS client_email`;

export async function getInvoiceList(filter: { status?: string; search?: string }): Promise<InvoiceSummary[]> {
  const search = filter.search?.trim() || null;
  const res = await dbQuery<InvoiceSummary>(
    `SELECT ${SUMMARY_COLUMNS}
       FROM public.invoices i
       LEFT JOIN public.clients c ON c.id = i.client_id
      WHERE ($1::text IS NULL OR i.invoice_number ILIKE '%' || $1 || '%'
             OR c.contact_person ILIKE '%' || $1 || '%' OR c.email ILIKE '%' || $1 || '%'
             OR c.phone ILIKE '%' || $1 || '%' OR i.client_company ILIKE '%' || $1 || '%')
      ORDER BY i.created_at DESC`,
    [search]
  );
  const rows = res.rows.map((r) => normalize(r));
  // Filter on the effective status, so "Overdue" also finds invoices that only
  // became overdue because time passed.
  return filter.status && filter.status !== 'all' ? rows.filter((r) => r.status === filter.status) : rows;
}

async function loadDetail(where: string, param: string): Promise<InvoiceDetail | null> {
  const res = await dbQuery<InvoiceDetail>(
    `SELECT i.*, i.issue_date::text, i.due_date::text, i.access_expires_at::text, i.pdf_expires_at::text,
            i.fully_paid_at::text,
            c.contact_person AS client_name, c.email AS client_email, c.phone AS client_phone,
            p.project_name, q.quotation_number,
            COALESCE((SELECT json_agg(json_build_object(
               'id', it.id, 'description', it.description, 'quantity', it.quantity::float,
               'unit_price', it.unit_price::float, 'total', it.total::float
             ) ORDER BY it.position, it.created_at) FROM public.invoice_items it WHERE it.invoice_id = i.id), '[]'::json) AS items,
            COALESCE((SELECT json_agg(json_build_object(
               'id', pm.id, 'amount', pm.amount::float, 'payment_method', pm.payment_method,
               'reference', pm.reference, 'notes', pm.notes, 'payment_date', pm.payment_date::text
             ) ORDER BY pm.payment_date, pm.created_at) FROM public.payments pm WHERE pm.invoice_id = i.id), '[]'::json) AS payments
       FROM public.invoices i
       LEFT JOIN public.clients c ON c.id = i.client_id
       LEFT JOIN public.projects p ON p.id = i.project_id
       LEFT JOIN public.quotations q ON q.id = i.quotation_id
      WHERE ${where}`,
    [param]
  );
  return res.rows[0] ? normalize(res.rows[0]) : null;
}

export async function getInvoiceDetail(id: string): Promise<InvoiceDetail | null> {
  return isUuid(id) ? loadDetail('i.id = $1::uuid', id) : null;
}

export async function getInvoiceByNumber(number: string): Promise<InvoiceDetail | null> {
  return loadDetail('upper(i.invoice_number) = upper($1)', number);
}

/** Re-sums payments and rewrites amount_paid, amount_due, status and fully_paid_at. */
async function recompute(client: PoolClient, invoiceId: string): Promise<void> {
  const res = await client.query<{ status: string; total: string; due_date: string; paid: string; fully_paid_at: string | null }>(
    `SELECT i.status, i.total, i.due_date::text, i.fully_paid_at,
            COALESCE((SELECT SUM(amount) FROM public.payments WHERE invoice_id = i.id), 0) AS paid
       FROM public.invoices i WHERE i.id = $1 FOR UPDATE`,
    [invoiceId]
  );
  const inv = res.rows[0];
  if (!inv) throw new Error('Invoice not found');
  const total = NUM(inv.total);
  const paid = NUM(inv.paid);
  const status = resolveInvoiceStatus(inv.status, total, paid, inv.due_date);
  await client.query(
    `UPDATE public.invoices SET
       amount_paid = $2::numeric, amount_due = GREATEST(0, $3::numeric - $2::numeric), status = $4::text::invoice_status_enum,
       fully_paid_at = CASE WHEN $4::text = 'paid' THEN COALESCE(fully_paid_at, NOW()) ELSE NULL END,
       updated_at = NOW()
     WHERE id = $1`,
    [invoiceId, paid, total, status]
  );
}

export async function saveInvoice(id: string | null, input: InvoiceInput, actorName = 'Admin'): Promise<{ id: string }> {
  const items = input.items
    .map((it) => ({ description: it.description.trim(), quantity: NUM(it.quantity), unit_price: NUM(it.unit_price) }))
    .filter((it) => it.description || it.unit_price);
  const t = computeTotals(items, input.discount_type, input.discount_value, input.tax_rate);

  const savedId = await dbTransaction(async (client) => {
    const values = [
      input.client_id, input.business_id, input.client_company, input.client_address, input.project_id,
      input.issue_date, input.due_date, input.currency, input.status,
      t.subtotal, t.discountAmount, t.taxAmount, t.total,
      input.discount_type, input.discount_value, input.discount_note, input.tax_rate, input.tax_label,
      input.invoice_notes, input.notes,
      input.cta_enabled, input.cta_title, input.cta_description, input.cta_payment_link, input.cta_button_text,
      input.access_expires_at, input.pdf_expires_at,
    ];
    let invoiceId = id;
    if (invoiceId) {
      const res = await client.query(
        `UPDATE public.invoices SET
           client_id = $1, business_id = $2, client_company = $3, client_address = $4, project_id = $5,
           issue_date = $6, due_date = $7, currency = $8, status = $9::text::invoice_status_enum,
           subtotal = $10, discount = $11, tax = $12, total = $13,
           discount_type = $14, discount_value = $15, discount_note = $16, tax_rate = $17, tax_label = $18,
           invoice_notes = $19, notes = $20,
           cta_enabled = $21, cta_title = $22, cta_description = $23, cta_payment_link = $24, cta_button_text = $25,
           access_expires_at = $26, pdf_expires_at = $27, updated_at = NOW()
         WHERE id = $28 RETURNING id`,
        [...values, invoiceId]
      );
      if (!res.rows[0]) throw new Error('Invoice not found');
      await client.query(`DELETE FROM public.invoice_items WHERE invoice_id = $1`, [invoiceId]);
    } else {
      const settings = await client.query<{ invoice_prefix: string | null }>(
        `SELECT invoice_prefix FROM public.company_settings LIMIT 1`
      );
      const prefix = settings.rows[0]?.invoice_prefix || 'INV';
      let created: string | null = null;
      for (let i = 0; i < 10 && !created; i++) {
        const res = await client.query<{ id: string }>(
          `INSERT INTO public.invoices (
             client_id, business_id, client_company, client_address, project_id,
             issue_date, due_date, currency, status,
             subtotal, discount, tax, total,
             discount_type, discount_value, discount_note, tax_rate, tax_label,
             invoice_notes, notes,
             cta_enabled, cta_title, cta_description, cta_payment_link, cta_button_text,
             access_expires_at, pdf_expires_at, invoice_number, amount_due
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::text::invoice_status_enum,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
                     $21,$22,$23,$24,$25,$26,$27,$28,$13)
           ON CONFLICT (invoice_number) DO NOTHING RETURNING id`,
          [...values, generateDocumentNumber(prefix)]
        );
        created = res.rows[0]?.id ?? null;
      }
      if (!created) throw new Error('Could not generate a unique invoice number');
      invoiceId = created;
    }

    for (const [position, it] of items.entries()) {
      await client.query(
        `INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, total, position)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [invoiceId, it.description || 'Item', it.quantity, it.unit_price, Math.round(it.quantity * it.unit_price * 100) / 100, position]
      );
    }
    await recompute(client, invoiceId);
    return invoiceId;
  });

  await logActivity({
    actorName,
    action: id ? 'invoice.updated' : 'invoice.created',
    entityType: 'invoice',
    entityId: savedId,
    metadata: { total: t.total },
  });
  return { id: savedId };
}

export async function addPayment(
  invoiceId: string,
  p: { amount: number; payment_method: string; reference: string; notes: string; payment_date: string }
): Promise<void> {
  await dbTransaction(async (client) => {
    const inv = await client.query<{ currency: string }>(`SELECT currency FROM public.invoices WHERE id = $1`, [invoiceId]);
    if (!inv.rows[0]) throw new Error('Invoice not found');
    await client.query(
      `INSERT INTO public.payments (invoice_id, amount, currency, payment_method, payment_date, reference, notes)
       VALUES ($1, $2, $3, $4, $5::date, NULLIF($6, ''), NULLIF($7, ''))`,
      [invoiceId, p.amount, inv.rows[0].currency, p.payment_method, p.payment_date, p.reference, p.notes]
    );
    await recompute(client, invoiceId);
  });
  await logActivity({
    action: 'payment.recorded',
    entityType: 'invoice',
    entityId: invoiceId,
    metadata: { amount: p.amount, method: p.payment_method },
  });
}

export async function deletePayment(invoiceId: string, paymentId: string): Promise<void> {
  await dbTransaction(async (client) => {
    await client.query(`DELETE FROM public.payments WHERE id = $1 AND invoice_id = $2`, [paymentId, invoiceId]);
    await recompute(client, invoiceId);
  });
}

export async function deleteInvoiceRecord(id: string): Promise<void> {
  const res = await dbQuery<{ invoice_number: string }>(
    `DELETE FROM public.invoices WHERE id = $1 RETURNING invoice_number`,
    [id]
  );
  if (res.rows[0]) {
    await logActivity({ action: 'invoice.deleted', entityType: 'invoice', entityId: id, entityTitle: res.rows[0].invoice_number });
  }
}

/**
 * Public lookup from /billing. Matching is exact on the invoice number, email
 * or phone — never a substring — so a short query cannot fish out other
 * people's invoices. Drafts stay hidden.
 */
export async function searchPublicInvoices(q: string): Promise<InvoiceSummary[]> {
  const query = q.trim();
  if (query.length < 3) return [];
  const phone = query.replace(/[\s()-]/g, '');
  const res = await dbQuery<InvoiceSummary>(
    `SELECT ${SUMMARY_COLUMNS}
       FROM public.invoices i
       LEFT JOIN public.clients c ON c.id = i.client_id
      WHERE i.status <> 'draft'
        AND (upper(i.invoice_number) = upper($1) OR lower(c.email) = lower($1)
             OR regexp_replace(COALESCE(c.phone, ''), '[\\s()-]', '', 'g') = $2)
      ORDER BY i.created_at DESC LIMIT 10`,
    [query, phone]
  );
  return res.rows.map((r) => normalize(r));
}

/** Clients with the businesses (and addresses) the invoice form can bill. */
export interface BillingClientOption {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  businesses: { id: string; name: string; address: string }[];
}

export async function getBillingClients(): Promise<BillingClientOption[]> {
  const res = await dbQuery<BillingClientOption>(
    `SELECT c.id, c.contact_person AS name, c.email, c.phone,
            COALESCE((SELECT json_agg(json_build_object('id', b.id, 'name', b.name, 'address', COALESCE(b.address, ''))
                      ORDER BY b.position, b.created_at)
                      FROM public.client_businesses b WHERE b.client_id = c.id), '[]'::json) AS businesses
       FROM public.clients c ORDER BY c.contact_person`
  );
  return res.rows;
}
