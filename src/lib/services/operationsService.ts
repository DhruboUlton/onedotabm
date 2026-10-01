import { cache } from 'react';
import { dbQuery, isUuid } from '@/lib/db';
import {
  WebsiteRecord,
  WebsiteStatus,
} from '@/types/database';
import { logActivity } from '@/lib/services/activityService';

// ============================================================================
// HELPER TYPES & DROPDOWN OPTIONS
// ============================================================================

export interface ClientOption {
  id: string;
  /** Null when the client runs no business; fall back to contact_person. */
  company_name: string | null;
  contact_person: string;
  email: string;
  phone: string | null;
  /** Every business this client runs, primary first. */
  businesses: { id: string; name: string }[];
}

export interface ProfileOption {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export interface ProjectOption {
  id: string;
  project_name: string;
  client_id: string;
}

export async function getClientsOptions(): Promise<ClientOption[]> {
  const res = await dbQuery<ClientOption>(
    `SELECT
       c.id,
       c.company_name,
       c.contact_person,
       c.email,
       c.phone,
       COALESCE((
         SELECT json_agg(json_build_object('id', b.id, 'name', b.name) ORDER BY b.position, b.created_at)
         FROM public.client_businesses b WHERE b.client_id = c.id
       ), '[]'::json) AS businesses
     FROM public.clients c
     ORDER BY c.contact_person ASC`
  );
  return res.rows;
}

export async function getProfilesOptions(): Promise<ProfileOption[]> {
  const res = await dbQuery<ProfileOption>(
    `SELECT id, full_name, email, role FROM public.profiles WHERE active = true ORDER BY full_name ASC`
  );
  return res.rows;
}

export async function getProjectsOptions(): Promise<ProjectOption[]> {
  const res = await dbQuery<ProjectOption>(
    `SELECT id, project_name, client_id FROM public.projects ORDER BY project_name ASC`
  );
  return res.rows;
}

// ============================================================================
// 4. WEBSITES
// ============================================================================

export async function getWebsites(filter?: {
  status?: string;
  search?: string;
}): Promise<WebsiteRecord[]> {
  const statusParam = filter?.status && filter.status !== 'all' ? filter.status : null;
  const searchParam = filter?.search?.trim() ? filter.search.trim() : null;

  const res = await dbQuery<WebsiteRecord>(
    `SELECT 
       w.id,
       w.website_name,
       w.client_id,
       w.project_id,
       w.domain,
       w.technology,
       w.website_type,
       w.status,
       w.launch_date::text,
       w.hosting,
       w.maintenance_plan,
       w.renewal_date::text,
       w.repository_url,
       w.deployment_url,
       w.notes,
       w.created_at::text,
       w.updated_at::text,
       COALESCE(NULLIF(c.company_name, ''), c.contact_person) AS client_name,
       p.project_name AS project_name
     FROM public.websites w
     LEFT JOIN public.clients c ON c.id = w.client_id
     LEFT JOIN public.projects p ON p.id = w.project_id
     WHERE ($1::text IS NULL OR w.status::text = $1)
       AND ($2::text IS NULL OR (w.website_name ILIKE '%' || $2 || '%' OR w.domain ILIKE '%' || $2 || '%' OR c.company_name ILIKE '%' || $2 || '%'))
     ORDER BY w.created_at DESC`,
    [statusParam, searchParam]
  );

  return res.rows;
}

// cache(): see getProjectById above — same double-fetch shape.
export const getWebsiteById = cache(async (id: string): Promise<WebsiteRecord | null> => {
  if (!isUuid(id)) return null;

  const res = await dbQuery<WebsiteRecord>(
    `SELECT
       w.id,
       w.website_name,
       w.client_id,
       w.project_id,
       w.domain,
       w.technology,
       w.website_type,
       w.status,
       w.launch_date::text,
       w.hosting,
       w.maintenance_plan,
       w.renewal_date::text,
       w.repository_url,
       w.deployment_url,
       w.notes,
       w.created_at::text,
       w.updated_at::text,
       COALESCE(NULLIF(c.company_name, ''), c.contact_person) AS client_name,
       p.project_name AS project_name
     FROM public.websites w
     LEFT JOIN public.clients c ON c.id = w.client_id
     LEFT JOIN public.projects p ON p.id = w.project_id
     WHERE w.id = $1::uuid`,
    [id]
  );

  return res.rows[0] || null;
});

export async function createWebsite(
  data: {
    website_name: string;
    client_id: string;
    project_id?: string | null;
    domain: string;
    technology: string;
    website_type?: string;
    status?: WebsiteStatus;
    launch_date?: string | null;
    hosting?: string | null;
    maintenance_plan?: string | null;
    renewal_date?: string | null;
    repository_url?: string | null;
    deployment_url?: string | null;
    notes?: string | null;
  },
  actor?: { id?: string; name?: string }
): Promise<WebsiteRecord> {
  const res = await dbQuery<WebsiteRecord>(
    `INSERT INTO public.websites (
       website_name,
       client_id,
       project_id,
       domain,
       technology,
       website_type,
       status,
       launch_date,
       hosting,
       maintenance_plan,
       renewal_date,
       repository_url,
       deployment_url,
       notes
     ) VALUES (
       $1,
       $2::uuid,
       $3::uuid,
       $4,
       $5,
       COALESCE($6, 'Business Website'),
       COALESCE($7::website_status_enum, 'live'),
       $8::date,
       $9,
       $10,
       $11::date,
       $12,
       $13,
       $14
     ) RETURNING *`,
    [
      data.website_name,
      data.client_id,
      data.project_id || null,
      data.domain,
      data.technology,
      data.website_type || 'Business Website',
      data.status || 'live',
      data.launch_date || null,
      data.hosting || null,
      data.maintenance_plan || null,
      data.renewal_date || null,
      data.repository_url || null,
      data.deployment_url || null,
      data.notes || null,
    ]
  );

  const created = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_website',
    entityType: 'website',
    entityId: created.id,
    entityTitle: created.website_name,
    metadata: { domain: created.domain, technology: created.technology },
  });

  return created;
}

export async function updateWebsite(
  id: string,
  data: Partial<WebsiteRecord>,
  actor?: { id?: string; name?: string }
): Promise<WebsiteRecord> {
  const res = await dbQuery<WebsiteRecord>(
    `UPDATE public.websites SET
       website_name = COALESCE($1, website_name),
       client_id = COALESCE($2::uuid, client_id),
       project_id = CASE WHEN $3 IS NOT NULL THEN $3::uuid ELSE project_id END,
       domain = COALESCE($4, domain),
       technology = COALESCE($5, technology),
       website_type = COALESCE($6, website_type),
       status = COALESCE($7::website_status_enum, status),
       launch_date = CASE WHEN $8 IS NOT NULL THEN $8::date ELSE launch_date END,
       hosting = CASE WHEN $9 IS NOT NULL THEN $9 ELSE hosting END,
       maintenance_plan = CASE WHEN $10 IS NOT NULL THEN $10 ELSE maintenance_plan END,
       renewal_date = CASE WHEN $11 IS NOT NULL THEN $11::date ELSE renewal_date END,
       repository_url = CASE WHEN $12 IS NOT NULL THEN $12 ELSE repository_url END,
       deployment_url = CASE WHEN $13 IS NOT NULL THEN $13 ELSE deployment_url END,
       notes = CASE WHEN $14 IS NOT NULL THEN $14 ELSE notes END,
       updated_at = NOW()
     WHERE id = $15::uuid
     RETURNING *`,
    [
      data.website_name ?? null,
      data.client_id ?? null,
      data.project_id !== undefined ? data.project_id : null,
      data.domain ?? null,
      data.technology ?? null,
      data.website_type ?? null,
      data.status ?? null,
      data.launch_date !== undefined ? data.launch_date : null,
      data.hosting !== undefined ? data.hosting : null,
      data.maintenance_plan !== undefined ? data.maintenance_plan : null,
      data.renewal_date !== undefined ? data.renewal_date : null,
      data.repository_url !== undefined ? data.repository_url : null,
      data.deployment_url !== undefined ? data.deployment_url : null,
      data.notes !== undefined ? data.notes : null,
      id,
    ]
  );

  if (res.rows.length === 0) {
    throw new Error(`Website ${id} not found`);
  }

  const updated = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_website',
    entityType: 'website',
    entityId: updated.id,
    entityTitle: updated.website_name,
    metadata: { domain: updated.domain, status: updated.status },
  });

  return updated;
}

export async function deleteWebsite(
  id: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; website_name: string }>(
    `DELETE FROM public.websites WHERE id = $1::uuid RETURNING id, website_name`,
    [id]
  );

  if (res.rows.length > 0) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_website',
      entityType: 'website',
      entityId: id,
      entityTitle: res.rows[0].website_name,
    });
    return true;
  }

  return false;
}
