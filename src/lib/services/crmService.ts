import { dbQuery } from '@/lib/db';
import { logActivity } from '@/lib/services/activityService';
import {
  LeadRecord,
  LeadStatus,
  Priority,
  ProspectRecord,
  ProspectStage,
  ClientRecord,
  ProjectRecord,
  WebsiteRecord,
  QuotationRecord,
  InvoiceRecord,
} from '@/types/database';

export interface ClientDetailRecord extends ClientRecord {
  account_manager_name?: string | null;
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

export async function getLeadById(id: string): Promise<LeadRecord | null> {
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
}

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

export async function convertLeadToProspect(
  leadId: string,
  dealData: Partial<ProspectRecord> = {}
): Promise<ProspectRecord> {
  const lead = await getLeadById(leadId);
  if (!lead) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }

  // Calculate estimated deal value
  let estimatedValue = dealData.estimated_deal_value;
  if (estimatedValue === undefined || estimatedValue === null) {
    const rawBudget = lead.budget ? lead.budget.replace(/[^0-9.]/g, '') : '0';
    estimatedValue = parseFloat(rawBudget) || 0;
  }

  const company = dealData.company || lead.company || lead.name;
  const contactPerson = dealData.contact_person || lead.name;
  const email = dealData.email || lead.email;
  const phone = dealData.phone || lead.phone || null;
  const services = dealData.services && dealData.services.length > 0
    ? dealData.services
    : lead.service_interested
      ? [lead.service_interested]
      : [];
  const currency = dealData.currency || 'BDT';
  const probability = dealData.probability ?? 60;
  const stage = dealData.stage || 'qualified';
  const expectedCloseDate = dealData.expected_close_date || null;
  const assignedTo = dealData.assigned_to || lead.assigned_to || null;
  const notes = dealData.notes || lead.notes || `Converted from Lead: ${lead.name}`;

  // Insert into prospects
  const prospectRes = await dbQuery<ProspectRecord>(
    `INSERT INTO public.prospects (
      lead_id,
      company,
      contact_person,
      email,
      phone,
      services,
      estimated_deal_value,
      currency,
      probability,
      stage,
      expected_close_date,
      assigned_to,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    ) RETURNING *`,
    [
      leadId,
      company,
      contactPerson,
      email,
      phone,
      services,
      estimatedValue,
      currency,
      probability,
      stage,
      expectedCloseDate,
      assignedTo,
      notes,
    ]
  );

  const prospect = prospectRes.rows[0];

  // Mark lead as qualified/won
  await dbQuery(
    `UPDATE public.leads 
     SET status = 'qualified', updated_at = NOW() 
     WHERE id = $1`,
    [leadId]
  );

  await logActivity({
    action: 'lead.converted_to_prospect',
    entityType: 'prospect',
    entityId: prospect.id,
    entityTitle: prospect.company,
    metadata: {
      leadId,
      leadName: lead.name,
      dealValue: prospect.estimated_deal_value,
      stage: prospect.stage,
    },
  });

  return prospect;
}

// ============================================================================
// 2. PROSPECTS SERVICE
// ============================================================================

export interface GetProspectsOptions {
  stage?: ProspectStage | 'all';
  search?: string;
}

export async function getProspects(options: GetProspectsOptions = {}): Promise<ProspectRecord[]> {
  const { stage, search } = options;

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (stage && stage !== 'all') {
    conditions.push(`pr.stage = $${paramIndex++}`);
    params.push(stage);
  }

  if (search && search.trim() !== '') {
    const s = `%${search.trim()}%`;
    conditions.push(
      `(pr.company ILIKE $${paramIndex} OR pr.contact_person ILIKE $${paramIndex} OR pr.email ILIKE $${paramIndex} OR pr.phone ILIKE $${paramIndex})`
    );
    params.push(s);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      pr.*,
      p.full_name AS assigned_to_name
    FROM public.prospects pr
    LEFT JOIN public.profiles p ON pr.assigned_to = p.id
    ${whereClause}
    ORDER BY pr.created_at DESC
  `;

  const res = await dbQuery<ProspectRecord>(query, params);
  return res.rows;
}

export async function getProspectById(id: string): Promise<ProspectRecord | null> {
  const query = `
    SELECT 
      pr.*,
      p.full_name AS assigned_to_name
    FROM public.prospects pr
    LEFT JOIN public.profiles p ON pr.assigned_to = p.id
    WHERE pr.id = $1
  `;
  const res = await dbQuery<ProspectRecord>(query, [id]);
  return res.rows[0] || null;
}

export async function createProspect(data: Partial<ProspectRecord>): Promise<ProspectRecord> {
  const res = await dbQuery<ProspectRecord>(
    `INSERT INTO public.prospects (
      lead_id,
      company,
      contact_person,
      email,
      phone,
      services,
      estimated_deal_value,
      currency,
      probability,
      stage,
      expected_close_date,
      assigned_to,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    ) RETURNING *`,
    [
      data.lead_id || null,
      data.company,
      data.contact_person,
      data.email,
      data.phone || null,
      data.services || [],
      data.estimated_deal_value || 0,
      data.currency || 'BDT',
      data.probability ?? 50,
      data.stage || 'qualified',
      data.expected_close_date || null,
      data.assigned_to || null,
      data.notes || null,
    ]
  );

  const prospect = res.rows[0];

  await logActivity({
    action: 'prospect.created',
    entityType: 'prospect',
    entityId: prospect.id,
    entityTitle: prospect.company,
    metadata: {
      contactPerson: prospect.contact_person,
      estimatedDealValue: prospect.estimated_deal_value,
      stage: prospect.stage,
    },
  });

  return prospect;
}

export async function updateProspect(id: string, data: Partial<ProspectRecord>): Promise<ProspectRecord> {
  const fields: string[] = [];
  const params: any[] = [id];
  let paramIndex = 2;

  const allowedFields: (keyof ProspectRecord)[] = [
    'company',
    'contact_person',
    'email',
    'phone',
    'services',
    'estimated_deal_value',
    'currency',
    'probability',
    'stage',
    'expected_close_date',
    'assigned_to',
    'notes',
  ];

  for (const field of allowedFields) {
    if (field in data) {
      fields.push(`${field} = $${paramIndex++}`);
      params.push(data[field] === undefined ? null : data[field]);
    }
  }

  if (fields.length === 0) {
    const existing = await getProspectById(id);
    if (!existing) throw new Error(`Prospect ${id} not found`);
    return existing;
  }

  fields.push('updated_at = NOW()');

  const query = `
    UPDATE public.prospects
    SET ${fields.join(', ')}
    WHERE id = $1
    RETURNING *
  `;

  const res = await dbQuery<ProspectRecord>(query, params);
  const updated = res.rows[0];

  await logActivity({
    action: 'prospect.updated',
    entityType: 'prospect',
    entityId: id,
    entityTitle: updated.company,
    metadata: {
      updatedFields: Object.keys(data),
      stage: updated.stage,
      estimatedValue: updated.estimated_deal_value,
    },
  });

  return updated;
}

export async function updateProspectStage(id: string, stage: ProspectStage): Promise<ProspectRecord> {
  const res = await dbQuery<ProspectRecord>(
    `UPDATE public.prospects
     SET stage = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, stage]
  );

  const updated = res.rows[0];
  if (!updated) throw new Error(`Prospect ${id} not found`);

  await logActivity({
    action: 'prospect.stage_changed',
    entityType: 'prospect',
    entityId: id,
    entityTitle: updated.company,
    metadata: { newStage: stage },
  });

  return updated;
}

export async function deleteProspect(id: string): Promise<boolean> {
  const existing = await getProspectById(id);
  const res = await dbQuery(`DELETE FROM public.prospects WHERE id = $1`, [id]);

  if (existing) {
    await logActivity({
      action: 'prospect.deleted',
      entityType: 'prospect',
      entityId: id,
      entityTitle: existing.company,
      metadata: { contactPerson: existing.contact_person, value: existing.estimated_deal_value },
    });
  }

  return (res.rowCount ?? 0) > 0;
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
      `(c.company_name ILIKE $${paramIndex} OR c.contact_person ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex} OR c.industry ILIKE $${paramIndex})`
    );
    params.push(s);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      c.*,
      p.full_name AS account_manager_name,
      COALESCE((SELECT COUNT(*) FROM public.projects WHERE client_id = c.id), 0)::int AS project_count,
      COALESCE((SELECT SUM(amount_paid) FROM public.invoices WHERE client_id = c.id), 0)::numeric AS total_revenue
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
  }));
}

export async function getClientById(id: string): Promise<ClientDetailRecord | null> {
  // 1. Fetch client info
  const clientQuery = `
    SELECT 
      c.*,
      p.full_name AS account_manager_name,
      COALESCE((SELECT COUNT(*) FROM public.projects WHERE client_id = c.id), 0)::int AS project_count,
      COALESCE((SELECT SUM(amount_paid) FROM public.invoices WHERE client_id = c.id), 0)::numeric AS total_revenue
    FROM public.clients c
    LEFT JOIN public.profiles p ON c.account_manager = p.id
    WHERE c.id = $1
  `;
  const clientRes = await dbQuery<ClientRecord & { account_manager_name?: string }>(clientQuery, [id]);
  const client = clientRes.rows[0];

  if (!client) return null;

  // 2. Fetch linked items concurrently
  const [projectsRes, websitesRes, quotationsRes, invoicesRes] = await Promise.all([
    dbQuery<ProjectRecord>(
      `SELECT pr.*, c.company_name AS client_name 
       FROM public.projects pr 
       JOIN public.clients c ON pr.client_id = c.id 
       WHERE pr.client_id = $1 
       ORDER BY pr.created_at DESC`,
      [id]
    ),
    dbQuery<WebsiteRecord>(
      `SELECT w.*, c.company_name AS client_name 
       FROM public.websites w 
       JOIN public.clients c ON w.client_id = c.id 
       WHERE w.client_id = $1 
       ORDER BY w.created_at DESC`,
      [id]
    ),
    dbQuery<QuotationRecord>(
      `SELECT q.*, c.company_name AS client_name 
       FROM public.quotations q 
       JOIN public.clients c ON q.client_id = c.id 
       WHERE q.client_id = $1 
       ORDER BY q.created_at DESC`,
      [id]
    ),
    dbQuery<InvoiceRecord>(
      `SELECT inv.*, c.company_name AS client_name 
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
}

export async function createClient(data: Partial<ClientRecord>): Promise<ClientRecord> {
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

  const client = res.rows[0];

  await logActivity({
    action: 'client.created',
    entityType: 'client',
    entityId: client.id,
    entityTitle: client.company_name,
    metadata: {
      contactPerson: client.contact_person,
      email: client.email,
      industry: client.industry,
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
    entityTitle: updated.company_name,
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
      entityTitle: existing.company_name,
      metadata: { contactPerson: existing.contact_person, email: existing.email },
    });
  }

  return (res.rowCount ?? 0) > 0;
}
