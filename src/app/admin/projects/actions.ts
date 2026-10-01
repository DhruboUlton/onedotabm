'use server';

import { isUuid } from '@/lib/db';
import { adminAction, actorOf } from '@/lib/actions/guard';
import { PROJECT_STATUSES, DELIVERABLE_STATUSES, ProjectStatus, DeliverableStatus } from '@/lib/projectMeta';
import {
  ProjectInput,
  DeliverableChanges,
  createProjectRecord,
  updateProjectRecord,
  deleteProjectRecord,
  duplicateProject,
  addProjectClient,
  removeProjectClient,
  setProjectClientBusiness,
  getProjectClients,
  createService,
  updateServiceTitle,
  deleteService,
  createDeliverable,
  updateDeliverable,
  deleteDeliverable,
  addDeliverableFile,
  deleteDeliverableFile,
  applyTemplate,
  saveProjectAsTemplate,
} from '@/lib/services/projectService';

const LIST = '/admin/projects';
const detail = (id: string) => `/admin/projects/${id}`;

function requireId(id: unknown, what = 'id'): string {
  if (typeof id !== 'string' || !isUuid(id)) throw new Error(`Invalid ${what}`);
  return id;
}

const isDate = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

function cleanProject(data: ProjectInput): ProjectInput {
  if (!PROJECT_STATUSES.includes(data.status as ProjectStatus)) throw new Error('Invalid status');
  return {
    project_name: String(data.project_name ?? '').trim() || 'Untitled Project',
    description: String(data.description ?? ''),
    status: data.status,
    start_date: isDate(data.start_date) ? data.start_date : null,
    deadline: isDate(data.deadline) ? data.deadline : null,
    invoice_number: String(data.invoice_number ?? '').trim().toUpperCase(),
  };
}

// ── Project ─────────────────────────────────────────────────────────────────

export async function createProjectAction(
  data: ProjectInput & { client_id: string | null; business_id: string | null }
) {
  return adminAction(
    (admin) =>
      createProjectRecord(
        {
          ...cleanProject(data),
          client_id: data.client_id ? requireId(data.client_id, 'client') : null,
          business_id: data.business_id ? requireId(data.business_id, 'business') : null,
        },
        actorOf(admin)
      ),
    [LIST]
  );
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  return adminAction((admin) => updateProjectRecord(requireId(id), cleanProject(data), actorOf(admin)), [LIST, detail(id)]);
}

export async function deleteProjectAction(id: string) {
  return adminAction((admin) => deleteProjectRecord(requireId(id), actorOf(admin)), [LIST]);
}

export async function duplicateProjectAction(id: string) {
  return adminAction(() => duplicateProject(requireId(id)), [LIST]);
}

// ── Clients ─────────────────────────────────────────────────────────────────

export async function addProjectClientAction(projectId: string, clientId: string) {
  return adminAction(async () => {
    await addProjectClient(requireId(projectId), requireId(clientId, 'client'));
    return getProjectClients(projectId);
  }, [LIST, detail(projectId)]);
}

export async function removeProjectClientAction(projectId: string, projectClientId: string) {
  return adminAction(async () => {
    await removeProjectClient(requireId(projectClientId));
    return getProjectClients(requireId(projectId));
  }, [LIST, detail(projectId)]);
}

export async function setProjectClientBusinessAction(
  projectId: string,
  projectClientId: string,
  businessId: string | null
) {
  return adminAction(async () => {
    await setProjectClientBusiness(requireId(projectClientId), businessId ? requireId(businessId, 'business') : null);
    return getProjectClients(requireId(projectId));
  }, [LIST, detail(projectId)]);
}

// ── Services & deliverables ─────────────────────────────────────────────────
// Edited inline and autosaved, so these skip revalidation: the client view
// already holds the new state, and re-rendering mid-typing would fight it.

export async function createServiceAction(projectId: string) {
  return adminAction(() => createService(requireId(projectId)));
}

export async function updateServiceTitleAction(serviceId: string, title: string) {
  return adminAction(() => updateServiceTitle(requireId(serviceId), String(title)));
}

export async function deleteServiceAction(serviceId: string) {
  return adminAction(() => deleteService(requireId(serviceId)));
}

export async function createDeliverableAction(serviceId: string, title: string) {
  return adminAction(() => createDeliverable(requireId(serviceId), String(title).trim()));
}

export async function updateDeliverableAction(id: string, changes: DeliverableChanges) {
  return adminAction(() => {
    const clean: DeliverableChanges = {};
    if (changes.title !== undefined) clean.title = String(changes.title);
    if (changes.type !== undefined) clean.type = String(changes.type);
    if (changes.notes !== undefined) clean.notes = String(changes.notes);
    if (changes.deadline !== undefined) clean.deadline = isDate(changes.deadline) ? changes.deadline : null;
    if (changes.completed_at !== undefined)
      clean.completed_at = isDate(changes.completed_at) ? changes.completed_at : null;
    if (changes.status !== undefined) {
      if (!DELIVERABLE_STATUSES.includes(changes.status as DeliverableStatus)) throw new Error('Invalid status');
      clean.status = changes.status;
    }
    return updateDeliverable(requireId(id), clean);
  });
}

export async function deleteDeliverableAction(id: string) {
  return adminAction(() => deleteDeliverable(requireId(id)));
}

export async function addDeliverableFileAction(
  deliverableId: string,
  file: { name: string; url: string; size: number; mime_type: string }
) {
  return adminAction(() => {
    const url = String(file.url ?? '').trim();
    if (!/^https?:\/\//i.test(url)) throw new Error('File URL must start with http:// or https://');
    return addDeliverableFile(requireId(deliverableId), {
      name: String(file.name ?? '').trim() || url.split('/').pop() || 'file',
      url,
      size: Number(file.size) || 0,
      mime_type: String(file.mime_type ?? ''),
    });
  });
}

export async function deleteDeliverableFileAction(fileId: string) {
  return adminAction(() => deleteDeliverableFile(requireId(fileId)));
}

// ── Templates ───────────────────────────────────────────────────────────────

export async function applyTemplateAction(projectId: string, templateId: string) {
  return adminAction(() => applyTemplate(requireId(projectId), requireId(templateId, 'template')), [detail(projectId)]);
}

export async function saveTemplateAction(projectId: string, name: string) {
  return adminAction(() => {
    const clean = String(name ?? '').trim();
    if (!clean) throw new Error('Template name is required');
    return saveProjectAsTemplate(requireId(projectId), clean);
  }, [detail(projectId)]);
}
