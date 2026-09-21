'use server';

import { getCurrentAdmin } from '@/lib/auth/adminAuth';

import { revalidatePath } from 'next/cache';
import {
  createProject,
  updateProject,
  deleteProject,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '@/lib/services/operationsService';
import {
  ProjectRecord,
  ProjectTaskRecord,
  ProjectMilestoneRecord,
  TaskStatus,
} from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createProjectAction(
  data: Partial<ProjectRecord>
): Promise<ActionResponse<ProjectRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    if (!data.project_name || !data.client_id || !data.service_type) {
      return {
        success: false,
        error: 'Project name, client, and service type are required.',
      };
    }

    const created = await createProject({
      project_name: data.project_name,
      client_id: data.client_id,
      service_type: data.service_type,
      description: data.description,
      start_date: data.start_date,
      deadline: data.deadline,
      budget: data.budget ? Number(data.budget) : 0,
      currency: data.currency || 'BDT',
      assigned_team: data.assigned_team || [],
      project_manager: data.project_manager || null,
      status: data.status || 'planning',
      priority: data.priority || 'medium',
      progress: data.progress ? Number(data.progress) : 0,
      notes: data.notes,
    });

    revalidatePath('/admin/projects');
    return { success: true, data: created };
  } catch (error: any) {
    console.error('Error creating project:', error);
    return { success: false, error: error.message || 'Failed to create project' };
  }
}

export async function updateProjectAction(
  id: string,
  data: Partial<ProjectRecord>
): Promise<ActionResponse<ProjectRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateProject(id, data);
    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating project:', error);
    return { success: false, error: error.message || 'Failed to update project' };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResponse<boolean>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deleted = await deleteProject(id);
    revalidatePath('/admin/projects');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return { success: false, error: error.message || 'Failed to delete project' };
  }
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export async function createTaskAction(data: {
  project_id: string;
  title: string;
  description?: string | null;
  assigned_to?: string | null;
  status?: TaskStatus;
  priority?: any;
  due_date?: string | null;
}): Promise<ActionResponse<ProjectTaskRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    if (!data.title?.trim()) {
      return { success: false, error: 'Task title is required.' };
    }

    const task = await createTask(data);
    revalidatePath(`/admin/projects/${data.project_id}`);
    revalidatePath('/admin/projects');
    return { success: true, data: task };
  } catch (error: any) {
    console.error('Error creating task:', error);
    return { success: false, error: error.message || 'Failed to create task' };
  }
}

export async function updateTaskStatusAction(
  taskId: string,
  status: TaskStatus,
  projectId: string
): Promise<ActionResponse<ProjectTaskRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateTaskStatus(taskId, status);
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/admin/projects');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating task status:', error);
    return { success: false, error: error.message || 'Failed to update task status' };
  }
}

export async function updateTaskAction(
  taskId: string,
  data: Partial<ProjectTaskRecord>,
  projectId: string
): Promise<ActionResponse<ProjectTaskRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateTask(taskId, data);
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/admin/projects');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating task:', error);
    return { success: false, error: error.message || 'Failed to update task' };
  }
}

export async function deleteTaskAction(
  taskId: string,
  projectId: string
): Promise<ActionResponse<boolean>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deleted = await deleteTask(taskId);
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/admin/projects');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return { success: false, error: error.message || 'Failed to delete task' };
  }
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export async function createMilestoneAction(data: {
  project_id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  status?: string;
}): Promise<ActionResponse<ProjectMilestoneRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    if (!data.title?.trim()) {
      return { success: false, error: 'Milestone title is required.' };
    }

    const milestone = await createMilestone(data);
    revalidatePath(`/admin/projects/${data.project_id}`);
    return { success: true, data: milestone };
  } catch (error: any) {
    console.error('Error creating milestone:', error);
    return { success: false, error: error.message || 'Failed to create milestone' };
  }
}

export async function updateMilestoneAction(
  id: string,
  data: Partial<ProjectMilestoneRecord>,
  projectId: string
): Promise<ActionResponse<ProjectMilestoneRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateMilestone(id, data);
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating milestone:', error);
    return { success: false, error: error.message || 'Failed to update milestone' };
  }
}

export async function deleteMilestoneAction(
  id: string,
  projectId: string
): Promise<ActionResponse<boolean>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deleted = await deleteMilestone(id);
    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting milestone:', error);
    return { success: false, error: error.message || 'Failed to delete milestone' };
  }
}
