'use server';

import { revalidatePath } from 'next/cache';
import {
  createWebsite,
  updateWebsite,
  deleteWebsite,
} from '@/lib/services/operationsService';
import { WebsiteRecord } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createWebsiteAction(
  data: Partial<WebsiteRecord>
): Promise<ActionResponse<WebsiteRecord>> {
  try {
    if (!data.website_name || !data.client_id || !data.domain || !data.technology) {
      return {
        success: false,
        error: 'Website name, client, domain, and technology are required.',
      };
    }

    const created = await createWebsite({
      website_name: data.website_name,
      client_id: data.client_id,
      project_id: data.project_id || null,
      domain: data.domain,
      technology: data.technology,
      website_type: data.website_type || 'Business Website',
      status: data.status || 'live',
      launch_date: data.launch_date || null,
      hosting: data.hosting || null,
      maintenance_plan: data.maintenance_plan || null,
      renewal_date: data.renewal_date || null,
      repository_url: data.repository_url || null,
      deployment_url: data.deployment_url || null,
      notes: data.notes || null,
    });

    revalidatePath('/admin/websites');
    return { success: true, data: created };
  } catch (error: any) {
    console.error('Error creating website:', error);
    return { success: false, error: error.message || 'Failed to create website' };
  }
}

export async function updateWebsiteAction(
  id: string,
  data: Partial<WebsiteRecord>
): Promise<ActionResponse<WebsiteRecord>> {
  try {
    const updated = await updateWebsite(id, data);
    revalidatePath('/admin/websites');
    revalidatePath(`/admin/websites/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating website:', error);
    return { success: false, error: error.message || 'Failed to update website' };
  }
}

export async function deleteWebsiteAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    const deleted = await deleteWebsite(id);
    revalidatePath('/admin/websites');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting website:', error);
    return { success: false, error: error.message || 'Failed to delete website' };
  }
}
