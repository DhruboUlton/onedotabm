import { dbQuery, dbTransaction } from '@/lib/db';
import {
  QuotationRecord,
  QuotationItemRecord,
  QuotationStatus,
  InvoiceRecord,
  InvoiceItemRecord,
  InvoiceStatus,
  PaymentRecord,
} from '@/types/database';
import { logActivity } from '@/lib/services/activityService';

// ============================================================================
// CLIENT / PROJECT HELPERS FOR FINANCE UI
// ============================================================================

export interface ClientOption {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
}

export interface ProjectOption {
  id: string;
  project_name: string;
  client_id: string;
}

export async function getClientsForFinance(): Promise<ClientOption[]> {
  const res = await dbQuery<ClientOption>(
    `SELECT id, company_name, contact_person, email FROM public.clients ORDER BY company_name ASC`
  );
  return res.rows;
}

export async function getProjectsForFinance(clientId?: string): Promise<ProjectOption[]> {
  if (clientId) {
    const res = await dbQuery<ProjectOption>(
      `SELECT id, project_name, client_id FROM public.projects WHERE client_id = $1 ORDER BY project_name ASC`,
      [clientId]
    );
    return res.rows;
  }
  const res = await dbQuery<ProjectOption>(
    `SELECT id, project_name, client_id FROM public.projects ORDER BY project_name ASC`
  );
  return res.rows;
}

// ============================================================================
// QUOTATIONS
// ============================================================================

export async function getQuotations(filters?: {
  status?: QuotationStatus | 'all';
  clientId?: string;
  search?: string;
}): Promise<QuotationRecord[]> {
  let query = `
    SELECT 
      q.*,
      c.company_name AS client_name,
      c.email AS client_email,
      p.project_name
    FROM public.quotations q
    LEFT JOIN public.clients c ON q.client_id = c.id
    LEFT JOIN public.projects p ON q.project_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIdx = 1;

  if (filters?.status && filters.status !== 'all') {
    query += ` AND q.status = $${paramIdx++}`;
    params.push(filters.status);
  }

  if (filters?.clientId) {
    query += ` AND q.client_id = $${paramIdx++}`;
    params.push(filters.clientId);
  }

  if (filters?.search) {
    query += ` AND (
      q.quotation_number ILIKE $${paramIdx} OR 
      c.company_name ILIKE $${paramIdx} OR 
      c.contact_person ILIKE $${paramIdx}
    )`;
    params.push(`%${filters.search}%`);
    paramIdx++;
  }

  query += ` ORDER BY q.created_at DESC`;

  const res = await dbQuery<QuotationRecord>(query, params);
  return res.rows.map((row) => ({
    ...row,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    total: Number(row.total),
  }));
}

export async function getQuotationById(id: string): Promise<QuotationRecord | null> {
  const quoteRes = await dbQuery<QuotationRecord>(
    `
    SELECT 
      q.*,
      c.company_name AS client_name,
      c.contact_person AS client_contact,
      c.email AS client_email,
      c.phone AS client_phone,
      c.address AS client_address,
      p.project_name
    FROM public.quotations q
    LEFT JOIN public.clients c ON q.client_id = c.id
    LEFT JOIN public.projects p ON q.project_id = p.id
    WHERE q.id = $1
    `,
    [id]
  );

  if (quoteRes.rows.length === 0) {
    return null;
  }

  const quote = quoteRes.rows[0];

  const itemsRes = await dbQuery<QuotationItemRecord>(
    `SELECT * FROM public.quotation_items WHERE quotation_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return {
    ...quote,
    subtotal: Number(quote.subtotal),
    discount: Number(quote.discount),
    tax: Number(quote.tax),
    total: Number(quote.total),
    items: itemsRes.rows.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      discount: Number(item.discount),
      total: Number(item.total),
    })),
  };
}

export async function createQuotation(
  data: {
    quotation_number?: string;
    client_id: string;
    project_id?: string | null;
    issue_date?: string;
    expiry_date?: string;
    currency?: string;
    subtotal?: number;
    discount?: number;
    tax?: number;
    total?: number;
    notes?: string | null;
    terms?: string | null;
    status?: QuotationStatus;
  },
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    total?: number;
  }>
): Promise<QuotationRecord> {
  return dbTransaction(async (client) => {
    // Generate quotation number if not provided
    let quoteNumber = data.quotation_number;
    if (!quoteNumber) {
      const year = new Date().getFullYear();
      const countRes = await client.query('SELECT count(*) FROM public.quotations');
      const count = parseInt(countRes.rows[0].count, 10) + 1;
      quoteNumber = `Q-${year}-${String(count).padStart(4, '0')}`;
    }

    // Calculate line item totals and aggregates
    const computedItems = items.map((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.unit_price) || 0;
      const disc = Number(item.discount) || 0;
      const lineTotal = Number(item.total) || Math.max(0, qty * price - disc);
      return {
        ...item,
        quantity: qty,
        unit_price: price,
        discount: disc,
        total: lineTotal,
      };
    });

    const calculatedSubtotal = computedItems.reduce((acc, item) => acc + item.total, 0);
    const subtotal = data.subtotal !== undefined ? Number(data.subtotal) : calculatedSubtotal;
    const discount = Number(data.discount) || 0;
    const tax = Number(data.tax) || 0;
    const total = data.total !== undefined ? Number(data.total) : Math.max(0, subtotal - discount + tax);

    const insertQuoteRes = await client.query(
      `
      INSERT INTO public.quotations (
        quotation_number, client_id, project_id, issue_date, expiry_date,
        currency, subtotal, discount, tax, total, notes, terms, status
      )
      VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), COALESCE($5, CURRENT_DATE + INTERVAL '30 days'),
              COALESCE($6, 'BDT'), $7, $8, $9, $10, $11, $12, COALESCE($13, 'draft'))
      RETURNING *
      `,
      [
        quoteNumber,
        data.client_id,
        data.project_id || null,
        data.issue_date || null,
        data.expiry_date || null,
        data.currency || 'BDT',
        subtotal,
        discount,
        tax,
        total,
        data.notes || null,
        data.terms || null,
        data.status || 'draft',
      ]
    );

    const createdQuotation = insertQuoteRes.rows[0];

    // Insert line items
    const insertedItems: QuotationItemRecord[] = [];
    for (const item of computedItems) {
      const itemRes = await client.query(
        `
        INSERT INTO public.quotation_items (quotation_id, description, quantity, unit_price, discount, total)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [createdQuotation.id, item.description, item.quantity, item.unit_price, item.discount, item.total]
      );
      insertedItems.push(itemRes.rows[0]);
    }

    // Activity logging
    await logActivity({
      action: 'quotation.created',
      entityType: 'quotation',
      entityId: createdQuotation.id,
      entityTitle: quoteNumber,
      metadata: {
        total,
        clientId: data.client_id,
        itemsCount: items.length,
      },
    });

    return {
      ...createdQuotation,
      subtotal: Number(createdQuotation.subtotal),
      discount: Number(createdQuotation.discount),
      tax: Number(createdQuotation.tax),
      total: Number(createdQuotation.total),
      items: insertedItems,
    };
  });
}

export async function updateQuotationStatus(
  id: string,
  status: QuotationStatus
): Promise<QuotationRecord> {
  const res = await dbQuery<QuotationRecord>(
    `
    UPDATE public.quotations
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  if (res.rows.length === 0) {
    throw new Error(`Quotation not found: ${id}`);
  }

  const updated = res.rows[0];

  await logActivity({
    action: `quotation.${status}`,
    entityType: 'quotation',
    entityId: id,
    entityTitle: updated.quotation_number,
    metadata: { status, total: updated.total },
  });

  return {
    ...updated,
    subtotal: Number(updated.subtotal),
    discount: Number(updated.discount),
    tax: Number(updated.tax),
    total: Number(updated.total),
  };
}

export async function deleteQuotation(id: string): Promise<boolean> {
  const existing = await dbQuery<QuotationRecord>(
    'SELECT quotation_number FROM public.quotations WHERE id = $1',
    [id]
  );

  const res = await dbQuery('DELETE FROM public.quotations WHERE id = $1 RETURNING id', [id]);
  const deleted = (res.rowCount ?? 0) > 0;

  if (deleted && existing.rows[0]) {
    await logActivity({
      action: 'quotation.deleted',
      entityType: 'quotation',
      entityId: id,
      entityTitle: existing.rows[0].quotation_number,
    });
  }

  return deleted;
}

// ============================================================================
// INVOICES
// ============================================================================

export async function getInvoices(filters?: {
  status?: InvoiceStatus | 'all';
  clientId?: string;
  search?: string;
}): Promise<InvoiceRecord[]> {
  let query = `
    SELECT 
      i.*,
      c.company_name AS client_name,
      c.email AS client_email,
      p.project_name
    FROM public.invoices i
    LEFT JOIN public.clients c ON i.client_id = c.id
    LEFT JOIN public.projects p ON i.project_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIdx = 1;

  if (filters?.status && filters.status !== 'all') {
    query += ` AND i.status = $${paramIdx++}`;
    params.push(filters.status);
  }

  if (filters?.clientId) {
    query += ` AND i.client_id = $${paramIdx++}`;
    params.push(filters.clientId);
  }

  if (filters?.search) {
    query += ` AND (
      i.invoice_number ILIKE $${paramIdx} OR 
      c.company_name ILIKE $${paramIdx} OR 
      c.contact_person ILIKE $${paramIdx}
    )`;
    params.push(`%${filters.search}%`);
    paramIdx++;
  }

  query += ` ORDER BY i.created_at DESC`;

  const res = await dbQuery<InvoiceRecord>(query, params);
  return res.rows.map((row) => ({
    ...row,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    total: Number(row.total),
    amount_paid: Number(row.amount_paid),
    amount_due: Number(row.amount_due),
  }));
}

export async function getInvoiceById(id: string): Promise<InvoiceRecord | null> {
  const invRes = await dbQuery<InvoiceRecord>(
    `
    SELECT 
      i.*,
      c.company_name AS client_name,
      c.contact_person AS client_contact,
      c.email AS client_email,
      c.phone AS client_phone,
      c.address AS client_address,
      p.project_name,
      q.quotation_number
    FROM public.invoices i
    LEFT JOIN public.clients c ON i.client_id = c.id
    LEFT JOIN public.projects p ON i.project_id = p.id
    LEFT JOIN public.quotations q ON i.quotation_id = q.id
    WHERE i.id = $1
    `,
    [id]
  );

  if (invRes.rows.length === 0) {
    return null;
  }

  const invoice = invRes.rows[0];

  const itemsRes = await dbQuery<InvoiceItemRecord>(
    `SELECT * FROM public.invoice_items WHERE invoice_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  const paymentsRes = await dbQuery<PaymentRecord>(
    `SELECT * FROM public.payments WHERE invoice_id = $1 ORDER BY payment_date DESC, created_at DESC`,
    [id]
  );

  return {
    ...invoice,
    subtotal: Number(invoice.subtotal),
    discount: Number(invoice.discount),
    tax: Number(invoice.tax),
    total: Number(invoice.total),
    amount_paid: Number(invoice.amount_paid),
    amount_due: Number(invoice.amount_due),
    items: itemsRes.rows.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      discount: Number(item.discount),
      total: Number(item.total),
    })),
    payments: paymentsRes.rows.map((p) => ({
      ...p,
      amount: Number(p.amount),
    })),
  };
}

export async function createInvoice(
  data: {
    invoice_number?: string;
    client_id: string;
    project_id?: string | null;
    quotation_id?: string | null;
    issue_date?: string;
    due_date?: string;
    currency?: string;
    subtotal?: number;
    discount?: number;
    tax?: number;
    total?: number;
    status?: InvoiceStatus;
    payment_method?: string | null;
    notes?: string | null;
  },
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    total?: number;
  }>
): Promise<InvoiceRecord> {
  return dbTransaction(async (client) => {
    // Generate invoice number if not provided
    let invoiceNumber = data.invoice_number;
    if (!invoiceNumber) {
      const year = new Date().getFullYear();
      const countRes = await client.query('SELECT count(*) FROM public.invoices');
      const count = parseInt(countRes.rows[0].count, 10) + 1;
      invoiceNumber = `INV-${year}-${String(count).padStart(4, '0')}`;
    }

    const computedItems = items.map((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.unit_price) || 0;
      const disc = Number(item.discount) || 0;
      const lineTotal = Number(item.total) || Math.max(0, qty * price - disc);
      return {
        ...item,
        quantity: qty,
        unit_price: price,
        discount: disc,
        total: lineTotal,
      };
    });

    const calculatedSubtotal = computedItems.reduce((acc, item) => acc + item.total, 0);
    const subtotal = data.subtotal !== undefined ? Number(data.subtotal) : calculatedSubtotal;
    const discount = Number(data.discount) || 0;
    const tax = Number(data.tax) || 0;
    const total = data.total !== undefined ? Number(data.total) : Math.max(0, subtotal - discount + tax);
    const amountPaid = 0;
    const amountDue = total;

    const insertInvRes = await client.query(
      `
      INSERT INTO public.invoices (
        invoice_number, client_id, project_id, quotation_id, issue_date, due_date,
        currency, subtotal, discount, tax, total, amount_paid, amount_due,
        status, payment_method, notes
      )
      VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), COALESCE($6, CURRENT_DATE + INTERVAL '14 days'),
              COALESCE($7, 'BDT'), $8, $9, $10, $11, $12, $13,
              COALESCE($14, 'draft'), $15, $16)
      RETURNING *
      `,
      [
        invoiceNumber,
        data.client_id,
        data.project_id || null,
        data.quotation_id || null,
        data.issue_date || null,
        data.due_date || null,
        data.currency || 'BDT',
        subtotal,
        discount,
        tax,
        total,
        amountPaid,
        amountDue,
        data.status || 'draft',
        data.payment_method || null,
        data.notes || null,
      ]
    );

    const createdInvoice = insertInvRes.rows[0];

    const insertedItems: InvoiceItemRecord[] = [];
    for (const item of computedItems) {
      const itemRes = await client.query(
        `
        INSERT INTO public.invoice_items (invoice_id, description, quantity, unit_price, discount, total)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [createdInvoice.id, item.description, item.quantity, item.unit_price, item.discount, item.total]
      );
      insertedItems.push(itemRes.rows[0]);
    }

    await logActivity({
      action: 'invoice.created',
      entityType: 'invoice',
      entityId: createdInvoice.id,
      entityTitle: invoiceNumber,
      metadata: {
        total,
        clientId: data.client_id,
        itemsCount: items.length,
      },
    });

    return {
      ...createdInvoice,
      subtotal: Number(createdInvoice.subtotal),
      discount: Number(createdInvoice.discount),
      tax: Number(createdInvoice.tax),
      total: Number(createdInvoice.total),
      amount_paid: Number(createdInvoice.amount_paid),
      amount_due: Number(createdInvoice.amount_due),
      items: insertedItems,
    };
  });
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus
): Promise<InvoiceRecord> {
  const res = await dbQuery<InvoiceRecord>(
    `
    UPDATE public.invoices
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  if (res.rows.length === 0) {
    throw new Error(`Invoice not found: ${id}`);
  }

  const updated = res.rows[0];

  await logActivity({
    action: `invoice.${status}`,
    entityType: 'invoice',
    entityId: id,
    entityTitle: updated.invoice_number,
    metadata: { status, total: updated.total },
  });

  return {
    ...updated,
    subtotal: Number(updated.subtotal),
    discount: Number(updated.discount),
    tax: Number(updated.tax),
    total: Number(updated.total),
    amount_paid: Number(updated.amount_paid),
    amount_due: Number(updated.amount_due),
  };
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const existing = await dbQuery<InvoiceRecord>(
    'SELECT invoice_number FROM public.invoices WHERE id = $1',
    [id]
  );

  const res = await dbQuery('DELETE FROM public.invoices WHERE id = $1 RETURNING id', [id]);
  const deleted = (res.rowCount ?? 0) > 0;

  if (deleted && existing.rows[0]) {
    await logActivity({
      action: 'invoice.deleted',
      entityType: 'invoice',
      entityId: id,
      entityTitle: existing.rows[0].invoice_number,
    });
  }

  return deleted;
}

// ============================================================================
// PAYMENTS
// ============================================================================

export async function recordPayment(data: {
  invoice_id: string;
  amount: number;
  currency?: string;
  payment_method: string;
  payment_date?: string;
  reference?: string | null;
  notes?: string | null;
}): Promise<PaymentRecord> {
  return dbTransaction(async (client) => {
    // 1. Fetch current invoice
    const invRes = await client.query<InvoiceRecord>(
      'SELECT * FROM public.invoices WHERE id = $1 FOR UPDATE',
      [data.invoice_id]
    );

    if (invRes.rows.length === 0) {
      throw new Error(`Invoice not found: ${data.invoice_id}`);
    }

    const invoice = invRes.rows[0];
    const paymentAmount = Number(data.amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      throw new Error('Payment amount must be a positive number');
    }

    // 2. Insert payment record
    const paymentInsertRes = await client.query<PaymentRecord>(
      `
      INSERT INTO public.payments (
        invoice_id, amount, currency, payment_method, payment_date, reference, notes
      )
      VALUES ($1, $2, COALESCE($3, 'BDT'), $4, COALESCE($5, CURRENT_DATE), $6, $7)
      RETURNING *
      `,
      [
        data.invoice_id,
        paymentAmount,
        data.currency || invoice.currency || 'BDT',
        data.payment_method,
        data.payment_date || null,
        data.reference || null,
        data.notes || null,
      ]
    );

    const payment = paymentInsertRes.rows[0];

    // 3. Recalculate total amount paid for this invoice
    const sumRes = await client.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_paid FROM public.payments WHERE invoice_id = $1',
      [data.invoice_id]
    );
    const newAmountPaid = Number(sumRes.rows[0].total_paid);
    const invoiceTotal = Number(invoice.total);
    const newAmountDue = Math.max(0, invoiceTotal - newAmountPaid);

    // Determine new status
    let newStatus: InvoiceStatus = invoice.status;
    if (newAmountDue <= 0.01) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partially_paid';
    }

    // 4. Update invoice balances and status
    await client.query(
      `
      UPDATE public.invoices
      SET amount_paid = $1, amount_due = $2, status = $3, updated_at = NOW()
      WHERE id = $4
      `,
      [newAmountPaid, newAmountDue, newStatus, data.invoice_id]
    );

    // 5. Activity log
    await logActivity({
      action: 'payment.recorded',
      entityType: 'invoice',
      entityId: data.invoice_id,
      entityTitle: invoice.invoice_number,
      metadata: {
        paymentId: payment.id,
        amount: paymentAmount,
        method: data.payment_method,
        reference: data.reference,
        newAmountDue,
        status: newStatus,
      },
    });

    return {
      ...payment,
      amount: Number(payment.amount),
    };
  });
}
