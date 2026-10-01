import { cache } from 'react';
import { PoolClient } from 'pg';
import { dbQuery, dbTransaction, isUuid } from '@/lib/db';
import { logActivity } from '@/lib/services/activityService';
import { generateAccessCode } from '@/lib/projectMeta';

// ============================================================================
// Types
// ============================================================================

export interface DeliverableFileRecord {
  id: string;
  name: string;
  url: string;
  size: number;
  mime_type: string;
}

export interface DeliverableRecord {
  id: string;
  service_id: string;
  title: string;
  type: string;
  status: string;
  notes: string;
  deadline: string | null;
  completed_at: string | null;
  position: number;
  files: DeliverableFileRecord[];
}

export interface ServiceRecord {
  id: string;
  project_id: string;
  title: string;
  description: string;
  deadline: string | null;
  position: number;
  deliverables: DeliverableRecord[];
}

export interface ProjectClientRecord {
  id: string;
  client_id: string;
  business_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  businesses: { id: string; name: string }[];
}

export interface ProjectSummary {
  id: string;
  project_name: string;
  status: string;
  deadline: string | null;
  completed_at: string | null;
  created_at: string;
  client_name: string | null;
  client_email: string | null;
  business_name: string | null;
  /** Statuses of every deliverable, for the progress bar. */
  deliverable_statuses: string[];
}

export interface ProjectDetail {
  id: string;
  project_name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  deadline: string | null;
  completed_at: string | null;
  invoice_number: string;
  access_code: string | null;
  clients: ProjectClientRecord[];
  services: ServiceRecord[];
}

export interface ProjectTemplateRecord {
  id: string;
  name: string;
  description: string;
  services: { title: string; deliverables: { title: string; type: string }[] }[];
}

type Actor = { id?: string; name?: string };

// ============================================================================
// Queries shared by several functions
// ============================================================================

// Every deliverable, with its files, for the given services, as JSON.
const SERVICES_JSON = `
  COALESCE((
    SELECT json_agg(json_build_object(
      'id', s.id, 'project_id', s.project_id, 'title', s.title, 'description', s.description,
      'deadline', s.deadline::text, 'position', s.position,
      'deliverables', COALESCE((
        SELECT json_agg(json_build_object(
          'id', d.id, 'service_id', d.service_id, 'title', d.title, 'type', d.type,
          'status', d.status, 'notes', d.notes, 'deadline', d.deadline::text,
          'completed_at', d.completed_at::text, 'position', d.position,
          'files', COALESCE((
            SELECT json_agg(json_build_object(
              'id', f.id, 'name', f.name, 'url', f.url, 'size', f.size, 'mime_type', f.mime_type
            ) ORDER BY f.created_at)
            FROM public.deliverable_files f WHERE f.deliverable_id = d.id
          ), '[]'::json)
        ) ORDER BY d.position, d.created_at)
        FROM public.project_deliverables d WHERE d.service_id = s.id
      ), '[]'::json)
    ) ORDER BY s.position, s.created_at)
    FROM public.project_services s WHERE s.project_id = p.id
  ), '[]'::json)`;

const CLIENTS_JSON = `
  COALESCE((
    SELECT json_agg(json_build_object(
      'id', pc.id, 'client_id', c.id, 'business_id', pc.business_id,
      'name', c.contact_person, 'email', c.email, 'phone', c.phone,
      'business_name', b.name,
      'businesses', COALESCE((
        SELECT json_agg(json_build_object('id', cb.id, 'name', cb.name) ORDER BY cb.position, cb.created_at)
        FROM public.client_businesses cb WHERE cb.client_id = c.id
      ), '[]'::json)
    ) ORDER BY pc.position, pc.created_at)
    FROM public.project_clients pc
    JOIN public.clients c ON c.id = pc.client_id
    LEFT JOIN public.client_businesses b ON b.id = pc.business_id
    WHERE pc.project_id = p.id
  ), '[]'::json)`;

type Runner = (text: string, params?: unknown[]) => Promise<{ rowCount: number | null }>;

function runner(client?: PoolClient): Runner {
  return client ? (text, params) => client.query(text, params) : (text, params) => dbQuery(text, params);
}

async function uniqueAccessCode(client?: PoolClient): Promise<string> {
  const q = runner(client);
  for (let i = 0; i < 20; i++) {
    const code = generateAccessCode();
    const taken = await q(
      `SELECT 1 FROM public.projects WHERE access_code = $1
       UNION ALL SELECT 1 FROM public.clients WHERE access_code = $1`,
      [code]
    );
    if (taken.rowCount === 0) return code;
  }
  throw new Error('Could not generate a unique access code');
}

export { uniqueAccessCode };

// The first client on a project is mirrored into projects.client_id and
// business_id, which invoices, websites and older queries still read.
async function syncPrimaryClient(projectId: string, client?: PoolClient): Promise<void> {
  const first = `FROM public.project_clients pc WHERE pc.project_id = $1::uuid ORDER BY pc.position, pc.created_at LIMIT 1`;
  await runner(client)(
    `UPDATE public.projects SET
       client_id = (SELECT pc.client_id ${first}),
       business_id = (SELECT pc.business_id ${first}),
       updated_at = NOW()
     WHERE id = $1::uuid`,
    [projectId]
  );
}

// ============================================================================
// Projects
// ============================================================================

export async function getProjectSummaries(filter?: {
  status?: string;
  search?: string;
}): Promise<ProjectSummary[]> {
  const status = filter?.status && filter.status !== 'all' ? filter.status : null;
  const search = filter?.search?.trim() || null;

  const res = await dbQuery<ProjectSummary>(
    `SELECT
       p.id, p.project_name, p.status, p.deadline::text, p.completed_at::text, p.created_at::text,
       c.contact_person AS client_name, c.email AS client_email, b.name AS business_name,
       COALESCE((
         SELECT array_agg(d.status) FROM public.project_deliverables d
         JOIN public.project_services s ON s.id = d.service_id WHERE s.project_id = p.id
       ), '{}') AS deliverable_statuses
     FROM public.projects p
     LEFT JOIN public.clients c ON c.id = p.client_id
     LEFT JOIN public.client_businesses b ON b.id = p.business_id
     WHERE ($1::text IS NULL OR p.status::text = $1)
       AND ($2::text IS NULL OR p.project_name ILIKE '%' || $2 || '%'
            OR EXISTS (
              SELECT 1 FROM public.project_clients pc JOIN public.clients pcc ON pcc.id = pc.client_id
              WHERE pc.project_id = p.id
                AND (pcc.contact_person ILIKE '%' || $2 || '%' OR pcc.email ILIKE '%' || $2 || '%')
            ))
     ORDER BY p.created_at DESC`,
    [status, search]
  );
  return res.rows;
}

export const getProjectDetail = cache(async (id: string): Promise<ProjectDetail | null> => {
  if (!isUuid(id)) return null;
  const res = await dbQuery<ProjectDetail>(
    `SELECT
       p.id, p.project_name, p.description, p.status, p.start_date::text, p.deadline::text,
       p.completed_at::text, p.invoice_number, p.access_code,
       ${CLIENTS_JSON} AS clients,
       ${SERVICES_JSON} AS services
     FROM public.projects p WHERE p.id = $1::uuid`,
    [id]
  );
  return res.rows[0] ?? null;
});

export interface ProjectInput {
  project_name: string;
  description: string;
  status: string;
  start_date: string | null;
  deadline: string | null;
  invoice_number: string;
}

// Status completed stamps completed_at, so the deadline badge can say
// "Completed" instead of "Overdue"; any other status clears it.
const COMPLETED_AT_SQL = `CASE WHEN $3::text = 'completed' THEN COALESCE(completed_at, CURRENT_DATE) ELSE NULL END`;

export async function createProjectRecord(
  data: ProjectInput & { client_id: string | null; business_id: string | null },
  actor?: Actor
): Promise<{ id: string }> {
  const id = await dbTransaction(async (client) => {
    const code = await uniqueAccessCode(client);
    const res = await client.query<{ id: string }>(
      `INSERT INTO public.projects
         (project_name, description, status, start_date, deadline, invoice_number,
          client_id, business_id, access_code, service_type, completed_at)
       VALUES ($1, $2, $3::text::project_status_enum, $4::date, $5::date, $6,
               $7::uuid, $8::uuid, $9, '', CASE WHEN $3::text = 'completed' THEN CURRENT_DATE END)
       RETURNING id`,
      [
        data.project_name || 'Untitled Project',
        data.description,
        data.status,
        data.start_date,
        data.deadline,
        data.invoice_number,
        data.client_id,
        data.business_id,
        code,
      ]
    );
    const projectId = res.rows[0].id;
    if (data.client_id) {
      await client.query(
        `INSERT INTO public.project_clients (project_id, client_id, business_id) VALUES ($1, $2, $3)`,
        [projectId, data.client_id, data.business_id]
      );
    }
    return projectId;
  });

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_project',
    entityType: 'project',
    entityId: id,
    entityTitle: data.project_name,
  });
  return { id };
}

export async function updateProjectRecord(id: string, data: ProjectInput, actor?: Actor): Promise<void> {
  await dbQuery(
    `UPDATE public.projects SET
       project_name = $2, description = $6, status = $3::text::project_status_enum,
       start_date = $4::date, deadline = $5::date, invoice_number = $7,
       completed_at = ${COMPLETED_AT_SQL},
       updated_at = NOW()
     WHERE id = $1::uuid`,
    [id, data.project_name, data.status, data.start_date, data.deadline, data.description, data.invoice_number]
  );
  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_project',
    entityType: 'project',
    entityId: id,
    entityTitle: data.project_name,
    metadata: { status: data.status },
  });
}

export async function deleteProjectRecord(id: string, actor?: Actor): Promise<void> {
  const res = await dbQuery<{ project_name: string }>(
    `DELETE FROM public.projects WHERE id = $1::uuid RETURNING project_name`,
    [id]
  );
  if (res.rows[0]) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_project',
      entityType: 'project',
      entityId: id,
      entityTitle: res.rows[0].project_name,
    });
  }
}

/** Copies title, clients and the service/deliverable structure. Statuses reset. */
export async function duplicateProject(id: string): Promise<{ id: string }> {
  return dbTransaction(async (client) => {
    const code = await uniqueAccessCode(client);
    const res = await client.query<{ id: string }>(
      `INSERT INTO public.projects
         (project_name, description, status, start_date, client_id, business_id,
          service_type, budget, currency, access_code)
       SELECT project_name || ' (Copy)', description, 'active', CURRENT_DATE, client_id, business_id,
              service_type, budget, currency, $2
       FROM public.projects WHERE id = $1::uuid
       RETURNING id`,
      [id, code]
    );
    if (!res.rows[0]) throw new Error('Project not found');
    const copyId = res.rows[0].id;

    await client.query(
      `INSERT INTO public.project_clients (project_id, client_id, business_id, position)
       SELECT $2, client_id, business_id, position FROM public.project_clients WHERE project_id = $1`,
      [id, copyId]
    );

    const services = await client.query<{ id: string; title: string; description: string; position: number }>(
      `SELECT id, title, description, position FROM public.project_services
       WHERE project_id = $1 ORDER BY position, created_at`,
      [id]
    );
    for (const s of services.rows) {
      const created = await client.query<{ id: string }>(
        `INSERT INTO public.project_services (project_id, title, description, position)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [copyId, s.title, s.description, s.position]
      );
      await client.query(
        `INSERT INTO public.project_deliverables (service_id, title, type, notes, position)
         SELECT $2, title, type, notes, position FROM public.project_deliverables WHERE service_id = $1`,
        [s.id, created.rows[0].id]
      );
    }
    return { id: copyId };
  });
}

// ============================================================================
// Clients on a project
// ============================================================================

export async function addProjectClient(projectId: string, clientId: string): Promise<void> {
  await dbTransaction(async (client) => {
    await client.query(
      `INSERT INTO public.project_clients (project_id, client_id, position)
       VALUES ($1, $2, (SELECT COUNT(*) FROM public.project_clients WHERE project_id = $1))
       ON CONFLICT (project_id, client_id) DO NOTHING`,
      [projectId, clientId]
    );
    await syncPrimaryClient(projectId, client);
  });
}

export async function removeProjectClient(projectClientId: string): Promise<void> {
  await dbTransaction(async (client) => {
    const res = await client.query<{ project_id: string }>(
      `DELETE FROM public.project_clients WHERE id = $1 RETURNING project_id`,
      [projectClientId]
    );
    if (res.rows[0]) await syncPrimaryClient(res.rows[0].project_id, client);
  });
}

export async function setProjectClientBusiness(projectClientId: string, businessId: string | null): Promise<void> {
  await dbTransaction(async (client) => {
    // The business must belong to that client, or the project would point at
    // someone else's company.
    const res = await client.query<{ project_id: string }>(
      `UPDATE public.project_clients pc SET business_id = $2::uuid
       WHERE pc.id = $1
         AND ($2::uuid IS NULL OR EXISTS (
           SELECT 1 FROM public.client_businesses b WHERE b.id = $2::uuid AND b.client_id = pc.client_id
         ))
       RETURNING project_id`,
      [projectClientId, businessId]
    );
    if (!res.rows[0]) throw new Error('That business does not belong to this client.');
    await syncPrimaryClient(res.rows[0].project_id, client);
  });
}

// ============================================================================
// Services
// ============================================================================

export async function createService(projectId: string, title = 'New Service'): Promise<ServiceRecord> {
  const res = await dbQuery<ServiceRecord>(
    `INSERT INTO public.project_services (project_id, title, position)
     VALUES ($1, $2, (SELECT COUNT(*) FROM public.project_services WHERE project_id = $1))
     RETURNING id, project_id, title, description, deadline::text, position`,
    [projectId, title]
  );
  return { ...res.rows[0], deliverables: [] };
}

export async function updateServiceTitle(serviceId: string, title: string): Promise<void> {
  await dbQuery(`UPDATE public.project_services SET title = $2, updated_at = NOW() WHERE id = $1`, [
    serviceId,
    title,
  ]);
}

export async function updateServiceDescription(serviceId: string, description: string): Promise<void> {
  await dbQuery(`UPDATE public.project_services SET description = $2, updated_at = NOW() WHERE id = $1`, [
    serviceId,
    description,
  ]);
}

export async function deleteService(serviceId: string): Promise<void> {
  await dbQuery(`DELETE FROM public.project_services WHERE id = $1`, [serviceId]);
}

// ============================================================================
// Deliverables
// ============================================================================

const DELIVERABLE_COLUMNS = `id, service_id, title, type, status, notes, deadline::text, completed_at::text, position`;

// A deliverable's description is its notes column; the client sees it.
export async function createDeliverable(serviceId: string, title: string, description = ''): Promise<DeliverableRecord> {
  const res = await dbQuery<DeliverableRecord>(
    `INSERT INTO public.project_deliverables (service_id, title, notes, position)
     VALUES ($1, $2, $3, (SELECT COUNT(*) FROM public.project_deliverables WHERE service_id = $1))
     RETURNING ${DELIVERABLE_COLUMNS}`,
    [serviceId, title || 'New Deliverable', description]
  );
  return { ...res.rows[0], files: [] };
}

export interface DeliverableChanges {
  title?: string;
  type?: string;
  status?: string;
  notes?: string;
  deadline?: string | null;
  completed_at?: string | null;
}

/**
 * Only the fields present are written. Moving to completed or uploaded stamps
 * completed_at with today unless one is given; any other status clears it.
 */
export async function updateDeliverable(id: string, changes: DeliverableChanges): Promise<DeliverableRecord> {
  const sets: string[] = [];
  const params: unknown[] = [id];
  const set = (sql: string, value: unknown) => {
    params.push(value);
    sets.push(sql.replace('?', `$${params.length}`));
  };

  if (changes.title !== undefined) set('title = ?', changes.title);
  if (changes.type !== undefined) set('type = ?', changes.type);
  if (changes.notes !== undefined) set('notes = ?', changes.notes);
  if (changes.deadline !== undefined) set('deadline = ?::date', changes.deadline || null);
  if (changes.status !== undefined) {
    set('status = ?', changes.status);
    const stamps = changes.status === 'completed' || changes.status === 'uploaded';
    set('completed_at = ?::date', changes.completed_at || (stamps ? new Date().toISOString().slice(0, 10) : null));
  } else if (changes.completed_at !== undefined) {
    set('completed_at = ?::date', changes.completed_at || null);
  }

  const res = await dbQuery<DeliverableRecord>(
    `UPDATE public.project_deliverables SET ${[...sets, 'updated_at = NOW()'].join(', ')}
     WHERE id = $1 RETURNING ${DELIVERABLE_COLUMNS}`,
    params
  );
  if (!res.rows[0]) throw new Error('Deliverable not found');
  const files = await dbQuery<DeliverableFileRecord>(
    `SELECT id, name, url, size, mime_type FROM public.deliverable_files WHERE deliverable_id = $1 ORDER BY created_at`,
    [id]
  );
  return { ...res.rows[0], files: files.rows };
}

export async function deleteDeliverable(id: string): Promise<void> {
  await dbQuery(`DELETE FROM public.project_deliverables WHERE id = $1`, [id]);
}

export async function addDeliverableFile(
  deliverableId: string,
  file: { name: string; url: string; size: number; mime_type: string }
): Promise<DeliverableFileRecord> {
  const res = await dbQuery<DeliverableFileRecord>(
    `INSERT INTO public.deliverable_files (deliverable_id, name, url, size, mime_type)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, url, size, mime_type`,
    [deliverableId, file.name || 'file', file.url, file.size || 0, file.mime_type || '']
  );
  return res.rows[0];
}

export async function deleteDeliverableFile(fileId: string): Promise<void> {
  await dbQuery(`DELETE FROM public.deliverable_files WHERE id = $1`, [fileId]);
}

// ============================================================================
// Templates
// ============================================================================

export async function getProjectTemplates(): Promise<ProjectTemplateRecord[]> {
  const res = await dbQuery<ProjectTemplateRecord>(
    `SELECT id, name, description, services FROM public.project_templates ORDER BY name`
  );
  return res.rows;
}

/** Appends the template's services after the project's existing ones. */
export async function applyTemplate(projectId: string, templateId: string): Promise<ServiceRecord[]> {
  await dbTransaction(async (client) => {
    const t = await client.query<ProjectTemplateRecord>(
      `SELECT services FROM public.project_templates WHERE id = $1`,
      [templateId]
    );
    if (!t.rows[0]) throw new Error('Template not found');
    const start = await client.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM public.project_services WHERE project_id = $1`,
      [projectId]
    );
    let position = start.rows[0].n;
    for (const svc of t.rows[0].services) {
      const created = await client.query<{ id: string }>(
        `INSERT INTO public.project_services (project_id, title, position) VALUES ($1, $2, $3) RETURNING id`,
        [projectId, svc.title, position++]
      );
      for (const [i, d] of (svc.deliverables ?? []).entries()) {
        await client.query(
          `INSERT INTO public.project_deliverables (service_id, title, type, position) VALUES ($1, $2, $3, $4)`,
          [created.rows[0].id, d.title, d.type ?? '', i]
        );
      }
    }
  });
  const project = await getProjectDetailUncached(projectId);
  return project?.services ?? [];
}

/** Saves the project's current services and deliverables as a reusable template. */
export async function saveProjectAsTemplate(projectId: string, name: string): Promise<ProjectTemplateRecord> {
  const project = await getProjectDetailUncached(projectId);
  if (!project) throw new Error('Project not found');
  const services = project.services.map((s) => ({
    title: s.title,
    deliverables: s.deliverables.map((d) => ({ title: d.title, type: d.type })),
  }));
  const res = await dbQuery<ProjectTemplateRecord>(
    `INSERT INTO public.project_templates (name, services) VALUES ($1, $2::jsonb)
     RETURNING id, name, description, services`,
    [name, JSON.stringify(services)]
  );
  return res.rows[0];
}

export async function deleteProjectTemplate(id: string): Promise<void> {
  await dbQuery(`DELETE FROM public.project_templates WHERE id = $1`, [id]);
}

// getProjectDetail is cache()d per request; writes in the same request need a fresh read.
async function getProjectDetailUncached(id: string): Promise<ProjectDetail | null> {
  const res = await dbQuery<ProjectDetail>(
    `SELECT p.id, ${SERVICES_JSON} AS services FROM public.projects p WHERE p.id = $1::uuid`,
    [id]
  );
  return res.rows[0] ?? null;
}

export async function getProjectClients(projectId: string): Promise<ProjectClientRecord[]> {
  const res = await dbQuery<{ clients: ProjectClientRecord[] }>(
    `SELECT ${CLIENTS_JSON} AS clients FROM public.projects p WHERE p.id = $1::uuid`,
    [projectId]
  );
  return res.rows[0]?.clients ?? [];
}

/** SQL for a project's progress (0–100) from its deliverables; `alias` is the projects table alias. */
export function progressSql(alias: string): string {
  return `COALESCE((
    SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE d.status IN ('completed', 'uploaded', 'approved', 'delivering')) / NULLIF(COUNT(*), 0))
    FROM public.project_deliverables d JOIN public.project_services s ON s.id = d.service_id
    WHERE s.project_id = ${alias}.id
  ), 0)::int`;
}
