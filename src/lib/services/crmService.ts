import { cache } from 'react';
import { dbQuery, isUuid } from '@/lib/db';
import { progressSql } from '@/lib/services/projectService';
import { logActivity } from '@/lib/services/activityService';
import type { ClientBusinessInput } from '@/lib/forms/clientBusinesses';
import {
  LeadRecord,
  LeadStatus,
  Priority,
  ClientRecord,
  ClientBusinessRecord,
  ProjectRecord,
  WebsiteRecord,
  QuotationRecord,
  InvoiceRecord,
} from '@/types/database';

export type { ClientBusinessInput };

export interface ClientDetailRecord extends ClientRecord {
  account_manager_name?: string | null;
  businesses: ClientBusinessRecord[];
  projects: ProjectRecord[];
  websites: WebsiteRecord[];
  quotations: QuotationRecord[];
  invoices: InvoiceRecord[];
}

// ============================================================================
// 1. LEADS SERVICE
// ============================================================================

export interface GetLeadsOptions {
  search?: string;
  status?: LeadStatus | 'all';
  priority?: Priority | 'all';
  limit?: number;
  offset?: number;
}

export async function getLeads(options: GetLeadsOptions = {}): Promise<LeadRecord[]> {
  const { search, status, priority, limit = 100, offset = 0 } = options;

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (status && status !== 'all') {
    conditions.push(`l.status = $${paramIndex++}`);
    params.push(status);
  }

  if (priority && priority !== 'all') {
    conditions.push(`l.priority = $${paramIndex++}`);
    params.push(priority);
  }

  if (search && search.trim() !== '') {
    const s = `%${search.trim()}%`;
    conditions.push(
      `(l.name ILIKE $${paramIndex} OR l.company ILIKE $${paramIndex} OR l.email ILIKE $${paramIndex} OR l.phone ILIKE $${paramIndex} OR l.service_interested ILIKE $${paramIndex})`
    );
    params.push(s);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit);
  const limitClause = `LIMIT $${paramIndex++}`;

  params.push(offset);
  const offsetClause = `OFFSET $${paramIndex++}`;

  const query = `
    SELECT 
      l.*,
      p.full_name AS assigned_to_name
    FROM public.leads l
    LEFT JOIN public.profiles p ON l.assigned_to = p.id
    ${whereClause}
    ORDER BY l.created_at DESC
    ${limitClause} ${offsetClause}
  `;

  const res = await dbQuery<LeadRecord>(query, params);
  return res.rows;
}

// cache(): generateMetadata() and the page component both call this with the
// same id on every detail-page load; without dedup that's 2 round trips
// (each ~300ms+ on a cross-region DB) for what is really one query.
export const getLeadById = cache(async (id: string): Promise<LeadRecord | null> => {
  if (!isUuid(id)) return null;

  const query = `
    SELECT
      l.*,
      p.full_name AS assigned_to_name
    FROM public.leads l
    LEFT JOIN public.profiles p ON l.assigned_to = p.id
    WHERE l.id = $1
  `;
  const res = await dbQuery<LeadRecord>(query, [id]);
  return res.rows[0] || null;
});

export async function createLead(data: Partial<LeadRecord>): Promise<LeadRecord> {
  const res = await dbQuery<LeadRecord>(
    `INSERT INTO public.leads (
      name,
      company,
      email,
      phone,
      country,
      city,
      website,
      service_interested,
      lead_source,
      budget,
      message,
      assigned_to,
      status,
      priority,
      tags,
      notes,
      next_follow_up,
      last_contact
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
    ) RETURNING *`,
    [
      data.name,
      data.company || null,
      data.email,
      data.phone || null,
      data.country || 'Bangladesh',
      data.city || null,
      data.website || null,
      data.service_interested || null,
      data.lead_source || 'website',
      data.budget || null,
      data.message || null,
      data.assigned_to || null,
      data.status || 'new',
      data.priority || 'medium',
      data.tags || [],
      data.notes || null,
      data.next_follow_up || null,
      data.last_contact || null,
    ]
  );

  const lead = res.rows[0];

  await logActivity({
    action: 'lead.created',
    entityType: 'lead',
    entityId: lead.id,
    entityTitle: lead.name,
    metadata: {
      company: lead.company,
      email: lead.email,
      status: lead.status,
      priority: lead.priority,
    },
  });

  return lead;
}

export async function updateLead(id: string, data: Partial<LeadRecord>): Promise<LeadRecord> {
  const fields: string[] = [];
  const params: any[] = [id];
  let paramIndex = 2;

  const allowedFields: (keyof LeadRecord)[] = [
    'name',
    'company',
    'email',
    'phone',
    'country',
    'city',
    'website',
    'service_interested',
    'lead_source',
    'budget',
    'message',
    'assigned_to',
    'status',
    'priority',
    'tags',
    'notes',
    'next_follow_up',
    'last_contact',
  ];

  for (const field of allowedFields) {
    if (field in data) {
      fields.push(`${field} = $${paramIndex++}`);
      params.push(data[field] === undefined ? null : data[field]);
    }
  }

  if (fields.length === 0) {
    const existing = await getLeadById(id);
    if (!existing) throw new Error(`Lead ${id} not found`);
    return existing;
  }

  fields.push('updated_at = NOW()');

  const query = `
    UPDATE public.leads
    SET ${fields.join(', ')}
    WHERE id = $1
    RETURNING *
  `;

  const res = await dbQuery<LeadRecord>(query, params);
  const updatedLead = res.rows[0];

  await logActivity({
    action: 'lead.updated',
    entityType: 'lead',
    entityId: id,
    entityTitle: updatedLead.name,
    metadata: {
      updatedFields: Object.keys(data),
      status: updatedLead.status,
    },
  });

  return updatedLead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord> {
  const res = await dbQuery<LeadRecord>(
    `UPDATE public.leads
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status]
  );

  const updated = res.rows[0];
  if (!updated) throw new Error(`Lead ${id} not found`);

  await logActivity({
    action: 'lead.status_changed',
    entityType: 'lead',
    entityId: id,
    entityTitle: updated.name,
    metadata: { newStatus: status },
  });

  return updated;
}

export async function deleteLead(id: string): Promise<boolean> {
  const existing = await getLeadById(id);
  const res = await dbQuery(`DELETE FROM public.leads WHERE id = $1`, [id]);

  if (existing) {
    await logActivity({
      action: 'lead.deleted',
      entityType: 'lead',
      entityId: id,
      entityTitle: existing.name,
      metadata: { company: existing.company, email: existing.email },
    });
  }

  return (res.rowCount ?? 0) > 0;
}

/**
 * Turns a lead into a client: the person becomes the client, the company (if
 * any) their first business, and the lead is marked won. A client is
 * identified by email, so an existing one is reported rather than duplicated.
 */
export async function convertLeadToClient(leadId: string): Promise<ClientRecord> {
  const lead = await getLeadById(leadId);
  if (!lead) throw new Error(`Lead with ID ${leadId} not found`);

  const existing = await dbQuery<{ id: string }>(
    `SELECT id FROM public.clients WHERE lower(email) = lower($1)`,
    [lead.email]
  );
  if (existing.rows[0]) {
    throw new Error('A client with this email already exists. Open them from Clients instead.');
  }

  const client = await createClient({
    contact_person: lead.name,
    email: lead.email,
    phone: lead.phone || undefined,
    website: lead.website || undefined,
    services: lead.service_interested ? [lead.service_interested] : [],
    notes: lead.message || undefined,
    businesses: lead.company ? [{ name: lead.company, website: lead.website || undefined }] : [],
  });

  await dbQuery(`UPDATE public.leads SET status = 'won', updated_at = NOW() WHERE id = $1`, [leadId]);
  await logActivity({
    action: 'lead.converted_to_client',
    entityType: 'client',
    entityId: client.id,
    entityTitle: client.contact_person,
    metadata: { leadId },
  });
  return client;
}

// ============================================================================
// 3. CLIENTS SERVICE
// ============================================================================

export interface GetClientsOptions {
  search?: string;
  status?: string;
}

export async function getClients(options: GetClientsOptions = {}): Promise<ClientRecord[]> {
  const { search, status } = options;

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (status && status !== 'all') {
    conditions.push(`c.status = $${paramIndex++}`);
    params.push(status);
  }

  if (search && search.trim() !== '') {
    const s = `%${search.trim()}%`;
    conditions.push(
      `(c.company_name ILIKE $${paramIndex} OR c.contact_person ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex} OR c.phone ILIKE $${paramIndex} OR c.industry ILIKE $${paramIndex}
        OR EXISTS (SELECT 1 FROM public.client_businesses b WHERE b.client_id = c.id AND b.name ILIKE $${paramIndex}))`
    );
    params.push(s);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      c.*,
      p.full_name AS account_manager_name,
      COALESCE((SELECT COUNT(*) FROM public.project_clients pc WHERE pc.client_id = c.id), 0)::int AS project_count,
      COALESCE((SELECT SUM(amount_paid) FROM public.invoices WHERE client_id = c.id), 0)::numeric AS total_revenue,
      COALESCE((
        SELECT array_agg(b.name ORDER BY b.position, b.created_at)
        FROM public.client_businesses b WHERE b.client_id = c.id
      ), '{}') AS business_names
    FROM public.clients c
    LEFT JOIN public.profiles p ON c.account_manager = p.id
    ${whereClause}
    ORDER BY c.created_at DESC
  `;

  const res = await dbQuery<ClientRecord>(query, params);
  return res.rows.map((row) => ({
    ...row,
    project_count: Number(row.project_count || 0),
    total_revenue: Number(row.total_revenue || 0),
    business_names: row.business_names || [],
  }));
}

// cache(): see getLeadById above — same double-fetch shape.
export const getClientById = cache(async (id: string): Promise<ClientDetailRecord | null> => {
  if (!isUuid(id)) return null;

  // 1. Fetch client info
  const clientQuery = `
    SELECT 
      c.*,
      p.full_name AS account_manager_name,
      COALESCE((SELECT COUNT(*) FROM public.project_clients pc WHERE pc.client_id = c.id), 0)::int AS project_count,
      COALESCE((SELECT SUM(amount_paid) FROM public.invoices WHERE client_id = c.id), 0)::numeric AS total_revenue
    FROM public.clients c
    LEFT JOIN public.profiles p ON c.account_manager = p.id
    WHERE c.id = $1
  `;
  const clientRes = await dbQuery<ClientRecord & { account_manager_name?: string }>(clientQuery, [id]);
  const client = clientRes.rows[0];

  if (!client) return null;

  // 2. Fetch linked items concurrently
  const [businessesRes, projectsRes, websitesRes, quotationsRes, invoicesRes] = await Promise.all([
    dbQuery<ClientBusinessRecord>(
      `SELECT * FROM public.client_businesses
       WHERE client_id = $1
       ORDER BY position, created_at`,
      [id]
    ),
    dbQuery<ProjectRecord>(
      `SELECT pr.*, ${progressSql('pr')} AS progress,
              COALESCE(NULLIF(c.company_name, ''), c.contact_person) AS client_name
       FROM public.projects pr
       JOIN public.project_clients pc ON pc.project_id = pr.id AND pc.client_id = $1
       JOIN public.clients c ON c.id = pc.client_id
       ORDER BY pr.created_at DESC`,
      [id]
    ),
    dbQuery<WebsiteRecord>(
      `SELECT w.*, COALESCE(NULLIF(c.company_name, ''), c.contact_person) AS client_name 
       FROM public.websites w 
       JOIN public.clients c ON w.client_id = c.id 
       WHERE w.client_id = $1 
       ORDER BY w.created_at DESC`,
      [id]
    ),
    dbQuery<QuotationRecord>(
      `SELECT q.*, COALESCE(NULLIF(c.company_name, ''), c.contact_person) AS client_name 
       FROM public.quotations q 
       JOIN public.clients c ON q.client_id = c.id 
       WHERE q.client_id = $1 
       ORDER BY q.created_at DESC`,
      [id]
    ),
    dbQuery<InvoiceRecord>(
      `SELECT inv.*, COALESCE(NULLIF(c.company_name, ''), c.contact_person) AS client_name 
       FROM public.invoices inv 
       JOIN public.clients c ON inv.client_id = c.id 
       WHERE inv.client_id = $1 
       ORDER BY inv.created_at DESC`,
      [id]
    ),
  ]);

  return {
    ...client,
    project_count: Number(client.project_count || 0),
    total_revenue: Number(client.total_revenue || 0),
    businesses: businessesRes.rows,
    business_names: businessesRes.rows.map((b) => b.name),
    projects: projectsRes.rows.map((p) => ({
      ...p,
      budget: Number(p.budget || 0),
      progress: Number(p.progress || 0),
    })),
    websites: websitesRes.rows,
    quotations: quotationsRes.rows.map((q) => ({
      ...q,
      subtotal: Number(q.subtotal || 0),
      discount: Number(q.discount || 0),
      tax: Number(q.tax || 0),
      total: Number(q.total || 0),
    })),
    invoices: invoicesRes.rows.map((inv) => ({
      ...inv,
      subtotal: Number(inv.subtotal || 0),
      discount: Number(inv.discount || 0),
      tax: Number(inv.tax || 0),
      total: Number(inv.total || 0),
      amount_paid: Number(inv.amount_paid || 0),
      amount_due: Number(inv.amount_due || 0),
    })),
  };
});

/**
 * clients.company_name is a label mirrored from the primary business, so it has
 * exactly one writer: this function. Call it after any change to a client's
 * businesses.
 */
async function syncPrimaryBusinessName(clientId: string): Promise<void> {
  await dbQuery(
    `UPDATE public.clients
     SET company_name = (
       SELECT b.name FROM public.client_businesses b
       WHERE b.client_id = $1
       ORDER BY b.position, b.created_at
       LIMIT 1
     ), updated_at = NOW()
     WHERE id = $1`,
    [clientId]
  );
}

export async function listClientBusinesses(clientId: string): Promise<ClientBusinessRecord[]> {
  const res = await dbQuery<ClientBusinessRecord>(
    `SELECT * FROM public.client_businesses WHERE client_id = $1 ORDER BY position, created_at`,
    [clientId]
  );
  return res.rows;
}

export async function createClientBusiness(
  clientId: string,
  data: Partial<ClientBusinessInput>
): Promise<ClientBusinessRecord> {
  const res = await dbQuery<ClientBusinessRecord>(
    `INSERT INTO public.client_businesses (client_id, name, industry, website, address, notes, position)
     VALUES ($1, $2, $3, $4, $5, $6,
       COALESCE((SELECT MAX(position) + 1 FROM public.client_businesses WHERE client_id = $1), 0))
     RETURNING *`,
    [
      clientId,
      data.name,
      data.industry || null,
      data.website || null,
      data.address || null,
      data.notes || null,
    ]
  );

  await syncPrimaryBusinessName(clientId);
  return res.rows[0];
}

export async function updateClientBusiness(
  id: string,
  data: Partial<ClientBusinessInput>
): Promise<ClientBusinessRecord> {
  const fields: string[] = [];
  const params: any[] = [id];
  let paramIndex = 2;

  for (const field of ['name', 'industry', 'website', 'address', 'notes'] as const) {
    if (field in data) {
      fields.push(`${field} = $${paramIndex++}`);
      params.push(data[field] === undefined ? null : data[field]);
    }
  }

  if (fields.length === 0) {
    const res = await dbQuery<ClientBusinessRecord>(
      `SELECT * FROM public.client_businesses WHERE id = $1`,
      [id]
    );
    if (!res.rows[0]) throw new Error(`Business ${id} not found`);
    return res.rows[0];
  }

  fields.push('updated_at = NOW()');

  const res = await dbQuery<ClientBusinessRecord>(
    `UPDATE public.client_businesses SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
    params
  );
  const updated = res.rows[0];
  if (!updated) throw new Error(`Business ${id} not found`);

  await syncPrimaryBusinessName(updated.client_id);
  return updated;
}

export async function deleteClientBusiness(id: string): Promise<boolean> {
  const res = await dbQuery<{ client_id: string }>(
    `DELETE FROM public.client_businesses WHERE id = $1 RETURNING client_id`,
    [id]
  );
  const clientId = res.rows[0]?.client_id;
  if (!clientId) return false;

  await syncPrimaryBusinessName(clientId);
  return true;
}

export async function createClient(
  data: Partial<ClientRecord> & { businesses?: Partial<ClientBusinessInput>[] }
): Promise<ClientRecord> {
  const res = await dbQuery<ClientRecord>(
    `INSERT INTO public.clients (
      company_name,
      contact_person,
      email,
      phone,
      website,
      address,
      industry,
      services,
      status,
      account_manager,
      start_date,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    ) RETURNING *`,
    [
      data.company_name,
      data.contact_person,
      data.email,
      data.phone || null,
      data.website || null,
      data.address || null,
      data.industry || null,
      data.services || [],
      data.status || 'active',
      data.account_manager || null,
      data.start_date || new Date().toISOString().split('T')[0],
      data.notes || null,
    ]
  );

  let client = res.rows[0];

  const businesses = (data.businesses || []).filter((b) => b.name && b.name.trim() !== '');
  for (const business of businesses) {
    await createClientBusiness(client.id, business);
  }

  if (businesses.length > 0) {
    // syncPrimaryBusinessName wrote company_name after the inserts above.
    const refreshed = await dbQuery<ClientRecord>(
      `SELECT * FROM public.clients WHERE id = $1`,
      [client.id]
    );
    client = refreshed.rows[0] || client;
  }

  await logActivity({
    action: 'client.created',
    entityType: 'client',
    entityId: client.id,
    entityTitle: client.contact_person,
    metadata: {
      contactPerson: client.contact_person,
      email: client.email,
      phone: client.phone,
      businesses: businesses.map((b) => b.name),
      status: client.status,
    },
  });

  return client;
}

export async function updateClient(id: string, data: Partial<ClientRecord>): Promise<ClientRecord> {
  const fields: string[] = [];
  const params: any[] = [id];
  let paramIndex = 2;

  const allowedFields: (keyof ClientRecord)[] = [
    'company_name',
    'contact_person',
    'email',
    'phone',
    'website',
    'address',
    'industry',
    'services',
    'status',
    'account_manager',
    'start_date',
    'notes',
  ];

  for (const field of allowedFields) {
    if (field in data) {
      fields.push(`${field} = $${paramIndex++}`);
      params.push(data[field] === undefined ? null : data[field]);
    }
  }

  if (fields.length === 0) {
    const existing = await getClientById(id);
    if (!existing) throw new Error(`Client ${id} not found`);
    return existing;
  }

  fields.push('updated_at = NOW()');

  const query = `
    UPDATE public.clients
    SET ${fields.join(', ')}
    WHERE id = $1
    RETURNING *
  `;

  const res = await dbQuery<ClientRecord>(query, params);
  const updated = res.rows[0];

  await logActivity({
    action: 'client.updated',
    entityType: 'client',
    entityId: id,
    entityTitle: updated.company_name || updated.contact_person,
    metadata: {
      updatedFields: Object.keys(data),
      status: updated.status,
    },
  });

  return updated;
}

export async function deleteClient(id: string): Promise<boolean> {
  const existing = await getClientById(id);
  const res = await dbQuery(`DELETE FROM public.clients WHERE id = $1`, [id]);

  if (existing) {
    await logActivity({
      action: 'client.deleted',
      entityType: 'client',
      entityId: id,
      entityTitle: existing.company_name || existing.contact_person,
      metadata: { contactPerson: existing.contact_person, email: existing.email },
    });
  }

  return (res.rowCount ?? 0) > 0;
}
