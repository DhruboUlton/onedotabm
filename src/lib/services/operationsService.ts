import { cache } from 'react';
import { dbQuery } from '@/lib/db';
import {
  ProjectRecord,
  ProjectTaskRecord,
  ProjectMilestoneRecord,
  WebsiteRecord,
  TaskStatus,
  ProjectStatus,
  Priority,
  WebsiteStatus,
} from '@/types/database';
import { logActivity } from '@/lib/services/activityService';

// ============================================================================
// HELPER TYPES & DROPDOWN OPTIONS
// ============================================================================

export interface ClientOption {
  id: string;
  company_name: string;
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
    `SELECT id, company_name FROM public.clients ORDER BY company_name ASC`
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
// 1. PROJECTS
// ============================================================================

export async function getProjects(filter?: {
  status?: string;
  clientId?: string;
  search?: string;
}): Promise<ProjectRecord[]> {
  const statusParam = filter?.status && filter.status !== 'all' ? filter.status : null;
  const clientParam = filter?.clientId && filter.clientId !== 'all' ? filter.clientId : null;
  const searchParam = filter?.search?.trim() ? filter.search.trim() : null;

  const res = await dbQuery<ProjectRecord>(
    `SELECT 
       p.id,
       p.project_name,
       p.client_id,
       p.service_type,
       p.description,
       p.start_date::text,
       p.deadline::text,
       p.budget::float,
       p.currency,
       p.assigned_team,
       p.project_manager,
       p.status,
       p.priority,
       p.progress,
       p.notes,
       p.created_at::text,
       p.updated_at::text,
       c.company_name AS client_name,
       pr.full_name AS project_manager_name,
       COALESCE((SELECT COUNT(*) FROM public.project_tasks pt WHERE pt.project_id = p.id), 0)::int AS tasks_count,
       COALESCE((SELECT COUNT(*) FROM public.project_tasks pt WHERE pt.project_id = p.id AND pt.status = 'completed'), 0)::int AS completed_tasks_count
     FROM public.projects p
     LEFT JOIN public.clients c ON c.id = p.client_id
     LEFT JOIN public.profiles pr ON pr.id = p.project_manager
     WHERE ($1::text IS NULL OR p.status::text = $1)
       AND ($2::uuid IS NULL OR p.client_id = $2::uuid)
       AND ($3::text IS NULL OR (p.project_name ILIKE '%' || $3 || '%' OR c.company_name ILIKE '%' || $3 || '%'))
     ORDER BY p.created_at DESC`,
    [statusParam, clientParam, searchParam]
  );

  return res.rows;
}

// cache(): generateMetadata() and the page component both call this with the
// same id on every detail-page load; without dedup that's 2x the queries
// below (each round trip costly on a cross-region DB) for one page render.
export const getProjectById = cache(async (id: string): Promise<ProjectRecord | null> => {
  const res = await dbQuery<ProjectRecord>(
    `SELECT 
       p.id,
       p.project_name,
       p.client_id,
       p.service_type,
       p.description,
       p.start_date::text,
       p.deadline::text,
       p.budget::float,
       p.currency,
       p.assigned_team,
       p.project_manager,
       p.status,
       p.priority,
       p.progress,
       p.notes,
       p.created_at::text,
       p.updated_at::text,
       c.company_name AS client_name,
       pr.full_name AS project_manager_name,
       COALESCE((SELECT COUNT(*) FROM public.project_tasks pt WHERE pt.project_id = p.id), 0)::int AS tasks_count,
       COALESCE((SELECT COUNT(*) FROM public.project_tasks pt WHERE pt.project_id = p.id AND pt.status = 'completed'), 0)::int AS completed_tasks_count
     FROM public.projects p
     LEFT JOIN public.clients c ON c.id = p.client_id
     LEFT JOIN public.profiles pr ON pr.id = p.project_manager
     WHERE p.id = $1::uuid`,
    [id]
  );

  if (res.rows.length === 0) return null;

  const project = res.rows[0];

  // Tasks and milestones are both keyed only on project_id — independent,
  // so run them concurrently instead of paying two round trips back to back.
  const [tasksRes, milestonesRes] = await Promise.all([
    dbQuery<ProjectTaskRecord & { assigned_to_name?: string }>(
      `SELECT
         pt.id,
         pt.project_id,
         pt.title,
         pt.description,
         pt.assigned_to,
         pt.status,
         pt.priority,
         pt.due_date::text,
         pt.created_at::text,
         pt.updated_at::text,
         pr.full_name AS assigned_to_name
       FROM public.project_tasks pt
       LEFT JOIN public.profiles pr ON pr.id = pt.assigned_to
       WHERE pt.project_id = $1::uuid
       ORDER BY pt.created_at ASC`,
      [id]
    ),
    dbQuery<ProjectMilestoneRecord>(
      `SELECT
         id,
         project_id,
         title,
         description,
         due_date::text,
         status,
         created_at::text,
         updated_at::text
       FROM public.project_milestones
       WHERE project_id = $1::uuid
       ORDER BY due_date ASC NULLS LAST, created_at ASC`,
      [id]
    ),
  ]);

  project.tasks = tasksRes.rows;
  project.milestones = milestonesRes.rows;

  return project;
});

export async function createProject(
  data: {
    project_name: string;
    client_id: string;
    service_type: string;
    description?: string | null;
    start_date?: string | null;
    deadline?: string | null;
    budget?: number;
    currency?: string;
    assigned_team?: string[];
    project_manager?: string | null;
    status?: ProjectStatus;
    priority?: Priority;
    progress?: number;
    notes?: string | null;
  },
  actor?: { id?: string; name?: string }
): Promise<ProjectRecord> {
  const res = await dbQuery<ProjectRecord>(
    `INSERT INTO public.projects (
       project_name,
       client_id,
       service_type,
       description,
       start_date,
       deadline,
       budget,
       currency,
       assigned_team,
       project_manager,
       status,
       priority,
       progress,
       notes
     ) VALUES (
       $1,
       $2::uuid,
       $3,
       $4,
       COALESCE($5::date, CURRENT_DATE),
       $6::date,
       COALESCE($7, 0.00),
       COALESCE($8, 'BDT'),
       COALESCE($9::uuid[], '{}'),
       $10::uuid,
       COALESCE($11::project_status_enum, 'planning'),
       COALESCE($12::priority_enum, 'medium'),
       COALESCE($13, 0),
       $14
     ) RETURNING *`,
    [
      data.project_name,
      data.client_id,
      data.service_type,
      data.description || null,
      data.start_date || null,
      data.deadline || null,
      data.budget ?? 0,
      data.currency || 'BDT',
      data.assigned_team || [],
      data.project_manager || null,
      data.status || 'planning',
      data.priority || 'medium',
      data.progress ?? 0,
      data.notes || null,
    ]
  );

  const created = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_project',
    entityType: 'project',
    entityId: created.id,
    entityTitle: created.project_name,
    metadata: { clientId: created.client_id, budget: created.budget },
  });

  return created;
}

export async function updateProject(
  id: string,
  data: Partial<ProjectRecord>,
  actor?: { id?: string; name?: string }
): Promise<ProjectRecord> {
  const currentRes = await dbQuery<ProjectRecord>(
    `SELECT * FROM public.projects WHERE id = $1::uuid`,
    [id]
  );
  if (currentRes.rows.length === 0) {
    throw new Error(`Project with ID ${id} not found`);
  }
  const current = currentRes.rows[0];

  const res = await dbQuery<ProjectRecord>(
    `UPDATE public.projects SET
       project_name = COALESCE($1, project_name),
       client_id = COALESCE($2::uuid, client_id),
       service_type = COALESCE($3, service_type),
       description = CASE WHEN $4 IS NOT NULL THEN $4 ELSE description END,
       start_date = CASE WHEN $5 IS NOT NULL THEN $5::date ELSE start_date END,
       deadline = CASE WHEN $6 IS NOT NULL THEN $6::date ELSE deadline END,
       budget = COALESCE($7, budget),
       currency = COALESCE($8, currency),
       assigned_team = COALESCE($9::uuid[], assigned_team),
       project_manager = CASE WHEN $10 IS NOT NULL THEN $10::uuid ELSE project_manager END,
       status = COALESCE($11::project_status_enum, status),
       priority = COALESCE($12::priority_enum, priority),
       progress = COALESCE($13, progress),
       notes = CASE WHEN $14 IS NOT NULL THEN $14 ELSE notes END,
       updated_at = NOW()
     WHERE id = $15::uuid
     RETURNING *`,
    [
      data.project_name ?? null,
      data.client_id ?? null,
      data.service_type ?? null,
      data.description !== undefined ? data.description : null,
      data.start_date !== undefined ? data.start_date : null,
      data.deadline !== undefined ? data.deadline : null,
      data.budget !== undefined ? Number(data.budget) : null,
      data.currency ?? null,
      data.assigned_team ?? null,
      data.project_manager !== undefined ? data.project_manager : null,
      data.status ?? null,
      data.priority ?? null,
      data.progress !== undefined ? Number(data.progress) : null,
      data.notes !== undefined ? data.notes : null,
      id,
    ]
  );

  const updated = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_project',
    entityType: 'project',
    entityId: updated.id,
    entityTitle: updated.project_name,
    metadata: { status: updated.status, progress: updated.progress },
  });

  return updated;
}

export async function deleteProject(
  id: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; project_name: string }>(
    `DELETE FROM public.projects WHERE id = $1::uuid RETURNING id, project_name`,
    [id]
  );

  if (res.rows.length > 0) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_project',
      entityType: 'project',
      entityId: id,
      entityTitle: res.rows[0].project_name,
    });
    return true;
  }
  return false;
}

// ============================================================================
// 2. TASKS
// ============================================================================

async function recalculateProjectProgress(projectId: string): Promise<void> {
  await dbQuery(
    `UPDATE public.projects
     SET progress = (
       SELECT CASE 
         WHEN COUNT(*) = 0 THEN 0 
         ELSE ROUND(COUNT(*) FILTER (WHERE status = 'completed')::numeric / COUNT(*) * 100) 
       END
       FROM public.project_tasks
       WHERE project_id = $1::uuid
     ),
     updated_at = NOW()
     WHERE id = $1::uuid`,
    [projectId]
  );
}

export async function getProjectTasks(projectId: string): Promise<ProjectTaskRecord[]> {
  const res = await dbQuery<ProjectTaskRecord & { assigned_to_name?: string }>(
    `SELECT 
       pt.id,
       pt.project_id,
       pt.title,
       pt.description,
       pt.assigned_to,
       pt.status,
       pt.priority,
       pt.due_date::text,
       pt.created_at::text,
       pt.updated_at::text,
       pr.full_name AS assigned_to_name
     FROM public.project_tasks pt
     LEFT JOIN public.profiles pr ON pr.id = pt.assigned_to
     WHERE pt.project_id = $1::uuid
     ORDER BY pt.created_at ASC`,
    [projectId]
  );
  return res.rows;
}

export async function createTask(
  data: {
    project_id: string;
    title: string;
    description?: string | null;
    assigned_to?: string | null;
    status?: TaskStatus;
    priority?: Priority;
    due_date?: string | null;
  },
  actor?: { id?: string; name?: string }
): Promise<ProjectTaskRecord> {
  const res = await dbQuery<ProjectTaskRecord>(
    `INSERT INTO public.project_tasks (
       project_id,
       title,
       description,
       assigned_to,
       status,
       priority,
       due_date
     ) VALUES (
       $1::uuid,
       $2,
       $3,
       $4::uuid,
       COALESCE($5::task_status_enum, 'todo'),
       COALESCE($6::priority_enum, 'medium'),
       $7::date
     ) RETURNING *`,
    [
      data.project_id,
      data.title,
      data.description || null,
      data.assigned_to || null,
      data.status || 'todo',
      data.priority || 'medium',
      data.due_date || null,
    ]
  );

  const created = res.rows[0];
  await recalculateProjectProgress(data.project_id);

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_task',
    entityType: 'project_task',
    entityId: created.id,
    entityTitle: created.title,
    metadata: { projectId: data.project_id, status: created.status },
  });

  return created;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  actor?: { id?: string; name?: string }
): Promise<ProjectTaskRecord> {
  const res = await dbQuery<ProjectTaskRecord>(
    `UPDATE public.project_tasks 
     SET status = $1::task_status_enum, updated_at = NOW() 
     WHERE id = $2::uuid 
     RETURNING *`,
    [status, taskId]
  );

  if (res.rows.length === 0) {
    throw new Error(`Task ${taskId} not found`);
  }

  const updated = res.rows[0];
  await recalculateProjectProgress(updated.project_id);

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_task_status',
    entityType: 'project_task',
    entityId: updated.id,
    entityTitle: updated.title,
    metadata: { projectId: updated.project_id, newStatus: status },
  });

  return updated;
}

export async function updateTask(
  taskId: string,
  data: Partial<ProjectTaskRecord>,
  actor?: { id?: string; name?: string }
): Promise<ProjectTaskRecord> {
  const res = await dbQuery<ProjectTaskRecord>(
    `UPDATE public.project_tasks SET
       title = COALESCE($1, title),
       description = CASE WHEN $2 IS NOT NULL THEN $2 ELSE description END,
       assigned_to = CASE WHEN $3 IS NOT NULL THEN $3::uuid ELSE assigned_to END,
       status = COALESCE($4::task_status_enum, status),
       priority = COALESCE($5::priority_enum, priority),
       due_date = CASE WHEN $6 IS NOT NULL THEN $6::date ELSE due_date END,
       updated_at = NOW()
     WHERE id = $7::uuid
     RETURNING *`,
    [
      data.title ?? null,
      data.description !== undefined ? data.description : null,
      data.assigned_to !== undefined ? data.assigned_to : null,
      data.status ?? null,
      data.priority ?? null,
      data.due_date !== undefined ? data.due_date : null,
      taskId,
    ]
  );

  if (res.rows.length === 0) {
    throw new Error(`Task ${taskId} not found`);
  }

  const updated = res.rows[0];
  await recalculateProjectProgress(updated.project_id);

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_task',
    entityType: 'project_task',
    entityId: updated.id,
    entityTitle: updated.title,
    metadata: { projectId: updated.project_id },
  });

  return updated;
}

export async function deleteTask(
  taskId: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; project_id: string; title: string }>(
    `DELETE FROM public.project_tasks WHERE id = $1::uuid RETURNING id, project_id, title`,
    [taskId]
  );

  if (res.rows.length > 0) {
    const deleted = res.rows[0];
    await recalculateProjectProgress(deleted.project_id);

    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_task',
      entityType: 'project_task',
      entityId: taskId,
      entityTitle: deleted.title,
      metadata: { projectId: deleted.project_id },
    });
    return true;
  }

  return false;
}

// ============================================================================
// 3. MILESTONES
// ============================================================================

export async function createMilestone(
  data: {
    project_id: string;
    title: string;
    description?: string | null;
    due_date?: string | null;
    status?: string;
  },
  actor?: { id?: string; name?: string }
): Promise<ProjectMilestoneRecord> {
  const res = await dbQuery<ProjectMilestoneRecord>(
    `INSERT INTO public.project_milestones (
       project_id,
       title,
       description,
       due_date,
       status
     ) VALUES (
       $1::uuid,
       $2,
       $3,
       $4::date,
       COALESCE($5, 'pending')
     ) RETURNING *`,
    [
      data.project_id,
      data.title,
      data.description || null,
      data.due_date || null,
      data.status || 'pending',
    ]
  );

  const created = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'created_milestone',
    entityType: 'project_milestone',
    entityId: created.id,
    entityTitle: created.title,
    metadata: { projectId: data.project_id },
  });

  return created;
}

export async function updateMilestone(
  id: string,
  data: Partial<ProjectMilestoneRecord>,
  actor?: { id?: string; name?: string }
): Promise<ProjectMilestoneRecord> {
  const res = await dbQuery<ProjectMilestoneRecord>(
    `UPDATE public.project_milestones SET
       title = COALESCE($1, title),
       description = CASE WHEN $2 IS NOT NULL THEN $2 ELSE description END,
       due_date = CASE WHEN $3 IS NOT NULL THEN $3::date ELSE due_date END,
       status = COALESCE($4, status),
       updated_at = NOW()
     WHERE id = $5::uuid
     RETURNING *`,
    [
      data.title ?? null,
      data.description !== undefined ? data.description : null,
      data.due_date !== undefined ? data.due_date : null,
      data.status ?? null,
      id,
    ]
  );

  if (res.rows.length === 0) {
    throw new Error(`Milestone ${id} not found`);
  }

  const updated = res.rows[0];

  await logActivity({
    actorId: actor?.id,
    actorName: actor?.name || 'Admin',
    action: 'updated_milestone',
    entityType: 'project_milestone',
    entityId: updated.id,
    entityTitle: updated.title,
    metadata: { status: updated.status },
  });

  return updated;
}

export async function deleteMilestone(
  id: string,
  actor?: { id?: string; name?: string }
): Promise<boolean> {
  const res = await dbQuery<{ id: string; project_id: string; title: string }>(
    `DELETE FROM public.project_milestones WHERE id = $1::uuid RETURNING id, project_id, title`,
    [id]
  );

  if (res.rows.length > 0) {
    await logActivity({
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      action: 'deleted_milestone',
      entityType: 'project_milestone',
      entityId: id,
      entityTitle: res.rows[0].title,
      metadata: { projectId: res.rows[0].project_id },
    });
    return true;
  }
  return false;
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
       c.company_name AS client_name,
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
       c.company_name AS client_name,
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
