import { dbQuery, dbTransaction, isUuid } from '@/lib/db';
import { uniqueAccessCode } from '@/lib/services/projectService';
import { logActivity } from '@/lib/services/activityService';
import { computeTotals, generateDocumentNumber } from '@/lib/invoiceMeta';
import { resolveQuotationStatus, QuotationStatus } from '@/lib/quotationMeta';

export interface QuotationItem {
  id?: string;
  description: string;
  deliverables: string;
  quantity: number;
  unit_price: number;
  total?: number;
}

export interface QuotationSummary {
  id: string;
  quotation_number: string;
  title: string;
  status: QuotationStatus;
  currency: string;
  total: number;
  issue_date: string;
  expiry_date: string;
  client_name: string | null;
  client_email: string | null;
  client_company: string;
}

export interface QuotationDetail extends QuotationSummary {
  client_id: string;
  business_id: string | null;
  client_phone: string | null;
  client_address: string;
  project_id: string | null;
  project_name: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  discount_type: string;
  discount_value: number;
  discount_note: string;
  tax_rate: number;
  tax_label: string;
  /** 'per_item': qty x unit price per line. 'single': one lump-sum price for the scope. */
  pricing_mode: 'per_item' | 'single';
  lump_sum: number;
  scope_overview: string;
  project_timeline: string;
  payment_terms: string;
  /** Terms and conditions. */
  terms: string | null;
  /** Private notes. */
  notes: string | null;
  converted_invoice_id: string | null;
  items: QuotationItem[];
}

export interface QuotationInput {
  client_id: string;
  business_id: string | null;
  client_company: string;
  client_address: string;
  project_id: string | null;
  title: string;
  status: QuotationStatus;
  issue_date: string;
  expiry_date: string;
  currency: string;
  discount_type: string;
  discount_value: number;
  discount_note: string;
  tax_rate: number;
  tax_label: string;
  pricing_mode: 'per_item' | 'single';
  lump_sum: number;
  scope_overview: string;
  project_timeline: string;
  payment_terms: string;
  terms: string;
  notes: string;
  items: QuotationItem[];
}

const NUM = (v: unknown) => Number(v) || 0;

function normalize<T extends object>(row: T): T {
  const out = { ...row } as Record<string, unknown>;
  for (const k of ['subtotal', 'discount', 'tax', 'total', 'discount_value', 'tax_rate']) if (k in out) out[k] = NUM(out[k]);
  if ('status' in out && 'expiry_date' in out) out.status = resolveQuotationStatus(String(out.status), String(out.expiry_date));
  return out as T;
}

const SUMMARY = `
  q.id, q.quotation_number, q.title, q.status, q.currency, q.total, q.issue_date::text, q.expiry_date::text,
  q.client_company, c.contact_person AS client_name, c.email AS client_email`;

export async function getQuotationList(filter: { status?: string; search?: string; projectId?: string }): Promise<QuotationSummary[]> {
  const search = filter.search?.trim() || null;
  const res = await dbQuery<QuotationSummary>(
    `SELECT ${SUMMARY} FROM public.quotations q LEFT JOIN public.clients c ON c.id = q.client_id
      WHERE ($1::text IS NULL OR q.quotation_number ILIKE '%' || $1 || '%' OR q.title ILIKE '%' || $1 || '%'
             OR c.contact_person ILIKE '%' || $1 || '%' OR c.email ILIKE '%' || $1 || '%' OR q.client_company ILIKE '%' || $1 || '%')
        AND ($2::uuid IS NULL OR q.project_id = $2::uuid)
      ORDER BY q.created_at DESC`,
    [search, filter.projectId && isUuid(filter.projectId) ? filter.projectId : null]
  );
  const rows = res.rows.map((r) => normalize(r));
  return filter.status && filter.status !== 'all' ? rows.filter((r) => r.status === filter.status) : rows;
}

async function load(where: string, param: string): Promise<QuotationDetail | null> {
  const res = await dbQuery<QuotationDetail>(
    `SELECT q.*, q.issue_date::text, q.expiry_date::text,
            c.contact_person AS client_name, c.email AS client_email, c.phone AS client_phone, p.project_name,
            COALESCE((SELECT json_agg(json_build_object(
              'id', it.id, 'description', it.description, 'deliverables', it.deliverables,
              'quantity', it.quantity::float, 'unit_price', it.unit_price::float, 'total', it.total::float
            ) ORDER BY it.position, it.created_at) FROM public.quotation_items it WHERE it.quotation_id = q.id), '[]'::json) AS items
       FROM public.quotations q
       LEFT JOIN public.clients c ON c.id = q.client_id
       LEFT JOIN public.projects p ON p.id = q.project_id
      WHERE ${where}`,
    [param]
  );
  return res.rows[0] ? normalize(res.rows[0]) : null;
}

export const getQuotationDetail = (id: string) => (isUuid(id) ? load('q.id = $1::uuid', id) : Promise.resolve(null));
export const getQuotationByNumber = (n: string) => load('upper(q.quotation_number) = upper($1)', n);

export async function saveQuotation(id: string | null, input: QuotationInput, actorName = 'Admin'): Promise<{ id: string }> {
  const items = input.items
    .map((it) => ({
      description: it.description.trim() || 'Item',
      deliverables: it.deliverables.trim(),
      quantity: Math.max(0.01, NUM(it.quantity) || 1),
      unit_price: input.pricing_mode === 'single' ? 0 : NUM(it.unit_price),
    }));
  const lump = input.pricing_mode === 'single' ? NUM(input.lump_sum) : 0;
  const t = computeTotals(
    input.pricing_mode === 'single' ? [{ quantity: 1, unit_price: lump }] : items,
    input.discount_type, input.discount_value, input.tax_rate);

  const savedId = await dbTransaction(async (client) => {
    const v = [
      input.client_id, input.business_id, input.client_company, input.client_address, input.project_id,
      input.title, input.status, input.issue_date, input.expiry_date, input.currency,
      t.subtotal, t.discountAmount, t.taxAmount, t.total,
      input.discount_type, input.discount_value, input.discount_note, input.tax_rate, input.tax_label,
      input.scope_overview, input.project_timeline, input.payment_terms, input.terms, input.notes,
      input.pricing_mode, lump,
    ];
    let qid = id;
    if (qid) {
      const res = await client.query(
        `UPDATE public.quotations SET client_id=$1, business_id=$2, client_company=$3, client_address=$4, project_id=$5,
           title=$6, status=$7::text::quotation_status_enum, issue_date=$8, expiry_date=$9, currency=$10,
           subtotal=$11, discount=$12, tax=$13, total=$14,
           discount_type=$15, discount_value=$16, discount_note=$17, tax_rate=$18, tax_label=$19,
           scope_overview=$20, project_timeline=$21, payment_terms=$22, terms=$23, notes=$24, pricing_mode=$25, lump_sum=$26, updated_at=NOW()
         WHERE id=$27 RETURNING id`,
        [...v, qid]
      );
      if (!res.rows[0]) throw new Error('Quotation not found');
      await client.query(`DELETE FROM public.quotation_items WHERE quotation_id = $1`, [qid]);
    } else {
      const settings = await client.query<{ quotation_prefix: string | null }>(`SELECT quotation_prefix FROM public.company_settings LIMIT 1`);
      const prefix = settings.rows[0]?.quotation_prefix || 'QT';
      for (let i = 0; i < 10 && !qid; i++) {
        const res = await client.query<{ id: string }>(
          `INSERT INTO public.quotations (client_id, business_id, client_company, client_address, project_id,
             title, status, issue_date, expiry_date, currency, subtotal, discount, tax, total,
             discount_type, discount_value, discount_note, tax_rate, tax_label,
             scope_overview, project_timeline, payment_terms, terms, notes, pricing_mode, lump_sum, quotation_number)
           VALUES ($1,$2,$3,$4,$5,$6,$7::text::quotation_status_enum,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
           ON CONFLICT (quotation_number) DO NOTHING RETURNING id`,
          [...v, generateDocumentNumber(prefix)]
        );
        qid = res.rows[0]?.id ?? null;
      }
      if (!qid) throw new Error('Could not generate a unique quotation number');
    }
    for (const [position, it] of items.entries()) {
      await client.query(
        `INSERT INTO public.quotation_items (quotation_id, description, deliverables, quantity, unit_price, total, position)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [qid, it.description, it.deliverables, it.quantity, it.unit_price, Math.round(it.quantity * it.unit_price * 100) / 100, position]
      );
    }
    return qid;
  });

  await logActivity({ actorName, action: id ? 'quotation.updated' : 'quotation.created', entityType: 'quotation', entityId: savedId, metadata: { total: t.total } });
  return { id: savedId };
}

export async function deleteQuotationRecord(id: string): Promise<void> {
  await dbQuery(`DELETE FROM public.quotations WHERE id = $1`, [id]);
}

/** Creates a draft invoice from the quotation and marks it converted. */
export async function convertToInvoice(id: string): Promise<{ id: string; invoice_number: string }> {
  return dbTransaction(async (client) => {
    const q = await client.query(`SELECT * FROM public.quotations WHERE id = $1 FOR UPDATE`, [id]);
    const quote = q.rows[0];
    if (!quote) throw new Error('Quotation not found');
    if (quote.converted_invoice_id) throw new Error('This quotation was already converted to an invoice');
    const items = await client.query(`SELECT * FROM public.quotation_items WHERE quotation_id = $1 ORDER BY position, created_at`, [id]);
    const settings = await client.query<{ invoice_prefix: string | null }>(`SELECT invoice_prefix FROM public.company_settings LIMIT 1`);
    const prefix = settings.rows[0]?.invoice_prefix || 'INV';

    let invoice: { id: string; invoice_number: string } | null = null;
    for (let i = 0; i < 10 && !invoice; i++) {
      const res = await client.query<{ id: string; invoice_number: string }>(
        `INSERT INTO public.invoices (client_id, business_id, client_company, client_address, project_id, quotation_id,
           issue_date, due_date, currency, subtotal, discount, tax, total, amount_due, status,
           discount_type, discount_value, discount_note, tax_rate, tax_label, invoice_notes, notes, invoice_number)
         VALUES ($1,$2,$3,$4,$5,$6,CURRENT_DATE,CURRENT_DATE + 14,$7,$8,$9,$10,$11,$11,'draft',
                 $12,$13,$14,$15,$16,$17,$18,$19)
         ON CONFLICT (invoice_number) DO NOTHING RETURNING id, invoice_number`,
        [quote.client_id, quote.business_id, quote.client_company, quote.client_address, quote.project_id, id,
         quote.currency, quote.subtotal, quote.discount, quote.tax, quote.total,
         quote.discount_type, quote.discount_value, quote.discount_note, quote.tax_rate, quote.tax_label,
         `Generated from quotation ${quote.quotation_number}`, quote.payment_terms, generateDocumentNumber(prefix)]
      );
      invoice = res.rows[0] ?? null;
    }
    if (!invoice) throw new Error('Could not generate a unique invoice number');

    // A lump-sum quotation becomes one invoice line carrying the whole price.
    const lines =
      quote.pricing_mode === 'single'
        ? [{
            description: [quote.title, ...items.rows.map((it) => `- ${it.description}`)].join('\n'),
            quantity: 1, unit_price: quote.lump_sum, total: quote.lump_sum,
          }]
        : items.rows.map((it) => ({
            description: it.deliverables ? `${it.description}\nScope: ${it.deliverables}` : it.description,
            quantity: it.quantity, unit_price: it.unit_price, total: it.total,
          }));
    for (const [position, it] of lines.entries()) {
      await client.query(
        `INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, total, position) VALUES ($1,$2,$3,$4,$5,$6)`,
        [invoice.id, it.description, it.quantity, it.unit_price, it.total, position]
      );
    }
    await client.query(`UPDATE public.quotations SET status = 'converted', converted_invoice_id = $2, updated_at = NOW() WHERE id = $1`, [id, invoice.id]);
    if (quote.project_id) await client.query(`UPDATE public.projects SET invoice_number = $2 WHERE id = $1`, [quote.project_id, invoice.invoice_number]);
    return invoice;
  });
}

/** Creates a project from the quotation: one service per line item, one deliverable per scope line. */
export async function convertToProject(id: string): Promise<{ id: string }> {
  return dbTransaction(async (client) => {
    const q = await client.query(`SELECT * FROM public.quotations WHERE id = $1 FOR UPDATE`, [id]);
    const quote = q.rows[0];
    if (!quote) throw new Error('Quotation not found');
    if (quote.project_id) throw new Error('This quotation is already linked to a project');
    const items = await client.query(`SELECT * FROM public.quotation_items WHERE quotation_id = $1 ORDER BY position, created_at`, [id]);

    const code = await uniqueAccessCode(client);
    const proj = await client.query<{ id: string }>(
      `INSERT INTO public.projects (project_name, description, status, start_date, deadline, client_id, business_id, service_type, access_code)
       VALUES ($1,$2,'active',CURRENT_DATE,$3,$4,$5,'',$6) RETURNING id`,
      [quote.title || 'Project', quote.scope_overview, quote.expiry_date, quote.client_id, quote.business_id, code]
    );
    const pid = proj.rows[0].id;
    await client.query(`INSERT INTO public.project_clients (project_id, client_id, business_id) VALUES ($1,$2,$3)`, [pid, quote.client_id, quote.business_id]);

    for (const [i, it] of items.rows.entries()) {
      const svc = await client.query<{ id: string }>(
        `INSERT INTO public.project_services (project_id, title, description, position) VALUES ($1,$2,$3,$4) RETURNING id`,
        [pid, it.description, it.deliverables, i]
      );
      const lines = String(it.deliverables || '').split(/[\n,;•·]/).map((d) => d.trim()).filter(Boolean);
      const titles = lines.length ? lines : [`${it.description} Delivery`];
      for (const [j, title] of titles.entries()) {
        await client.query(`INSERT INTO public.project_deliverables (service_id, title, position) VALUES ($1,$2,$3)`, [svc.rows[0].id, title, j]);
      }
    }
    await client.query(
      `UPDATE public.quotations SET project_id = $2, status = CASE WHEN status = 'draft' THEN 'sent'::quotation_status_enum ELSE status END, updated_at = NOW() WHERE id = $1`,
      [id, pid]
    );
    return { id: pid };
  });
}

export interface ProjectScope {
  title: string;
  description: string;
  client_id: string | null;
  business_id: string | null;
  items: { description: string; deliverables: string }[];
}

/** A project's services and deliverables, shaped as quotation line items. */
export async function getProjectScope(projectId: string): Promise<ProjectScope | null> {
  const res = await dbQuery<{ project_name: string; description: string | null; client_id: string | null; business_id: string | null; services: { title: string; description: string; deliverables: string[] }[] }>(
    `SELECT p.project_name, p.description, p.client_id, p.business_id,
            COALESCE((SELECT json_agg(json_build_object('title', s.title, 'description', s.description,
              'deliverables', COALESCE((SELECT json_agg(d.title ORDER BY d.position) FROM public.project_deliverables d WHERE d.service_id = s.id), '[]'::json))
              ORDER BY s.position) FROM public.project_services s WHERE s.project_id = p.id), '[]'::json) AS services
       FROM public.projects p WHERE p.id = $1::uuid`,
    [projectId]
  );
  const p = res.rows[0];
  if (!p) return null;
  return {
    title: p.project_name,
    description: p.description ?? '',
    client_id: p.client_id,
    business_id: p.business_id,
    items: p.services.map((s) => ({
      description: s.title,
      deliverables: [s.description, s.deliverables.length ? `Deliverables: ${s.deliverables.join(', ')}` : ''].filter(Boolean).join('\n'),
    })),
  };
}
