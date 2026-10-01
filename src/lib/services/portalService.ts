import { dbQuery, isUuid } from '@/lib/db';
import type { PortalSession } from '@/lib/auth/portalAuth';
import { getProjectDetail, ProjectDetail } from '@/lib/services/projectService';
import { InvoiceSummary } from '@/lib/services/invoiceService';

/**
 * Email plus access code. The client code opens every project of that client;
 * a project code opens that one project, for any client attached to it. Both
 * must match the email, and a failure never says which half was wrong.
 */
export async function verifyPortalLogin(email: string, code: string): Promise<PortalSession | null> {
  const e = email.trim().toLowerCase();
  const c = code.trim().toUpperCase();
  if (!e || !c) return null;

  const client = await dbQuery<{ id: string }>(
    `SELECT id FROM public.clients WHERE access_code = $1 AND lower(email) = $2`,
    [c, e]
  );
  if (client.rows[0]) return { kind: 'client', id: client.rows[0].id };

  const project = await dbQuery<{ id: string }>(
    `SELECT p.id FROM public.projects p
      WHERE p.access_code = $1
        AND EXISTS (SELECT 1 FROM public.project_clients pc JOIN public.clients cl ON cl.id = pc.client_id
                     WHERE pc.project_id = p.id AND lower(cl.email) = $2)`,
    [c, e]
  );
  return project.rows[0] ? { kind: 'project', id: project.rows[0].id } : null;
}

export interface PortalProject {
  project: ProjectDetail;
  invoices: InvoiceSummary[];
}

export async function getPortalIdentity(session: PortalSession): Promise<{ name: string } | null> {
  if (session.kind === 'client') {
    const r = await dbQuery<{ name: string }>(`SELECT contact_person AS name FROM public.clients WHERE id = $1`, [session.id]);
    return r.rows[0] ?? null;
  }
  const r = await dbQuery<{ name: string }>(`SELECT project_name AS name FROM public.projects WHERE id = $1`, [session.id]);
  return r.rows[0] ?? null;
}

/** The ids this session may open. */
export async function getPortalProjectIds(session: PortalSession): Promise<string[]> {
  if (session.kind === 'project') return isUuid(session.id) ? [session.id] : [];
  const r = await dbQuery<{ id: string }>(
    `SELECT p.id FROM public.projects p JOIN public.project_clients pc ON pc.project_id = p.id
      WHERE pc.client_id = $1 AND p.status <> 'cancelled' ORDER BY p.created_at DESC`,
    [session.id]
  );
  return r.rows.map((x) => x.id);
}

/** Sent-or-later invoices linked to the project by number or by project id. Drafts never show. */
export async function getPortalInvoices(projectId: string, invoiceNumber: string): Promise<InvoiceSummary[]> {
  const r = await dbQuery<InvoiceSummary>(
    `SELECT i.id, i.invoice_number, i.client_company, i.total::float, i.amount_paid::float, i.status, i.due_date::text, i.currency,
            NULL::text AS client_name, NULL::text AS client_email
       FROM public.invoices i
      WHERE i.status <> 'draft' AND (i.project_id = $1::uuid OR ($2 <> '' AND upper(i.invoice_number) = upper($2)))
      ORDER BY i.created_at DESC`,
    [projectId, invoiceNumber]
  );
  return r.rows;
}

export async function getPortalProject(session: PortalSession, projectId: string): Promise<PortalProject | null> {
  if (!isUuid(projectId)) return null;
  if (!(await getPortalProjectIds(session)).includes(projectId)) return null;
  const project = await getProjectDetail(projectId);
  if (!project) return null;
  return { project, invoices: await getPortalInvoices(projectId, project.invoice_number) };
}
