'use server';

import { revalidatePath } from 'next/cache';
import {
  createCaseStudyDb,
  updateCaseStudyDb,
  deleteCaseStudyDb,
} from '@/lib/services/contentService';
import { CaseStudyRecord } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createCaseStudyAction(
  data: Partial<CaseStudyRecord>
): Promise<ActionResponse<CaseStudyRecord>> {
  try {
    if (!data.title?.trim() || !data.client_name?.trim() || !data.industry?.trim()) {
      return { success: false, error: 'Title, Client Name, and Industry are required.' };
    }

    const created = await createCaseStudyDb({
      title: data.title.trim(),
      slug: data.slug,
      client_id: data.client_id || null,
      client_name: data.client_name.trim(),
      industry: data.industry.trim(),
      challenge: data.challenge || 'Challenge details pending.',
      strategy: data.strategy || 'Strategy details pending.',
      execution: data.execution || 'Execution details pending.',
      result: data.result || 'Result details pending.',
      services: data.services || [],
      hero_metric_value: data.hero_metric_value || null,
      hero_metric_label: data.hero_metric_label || null,
      metrics: data.metrics || [],
      images: data.images || [],
      testimonial: data.testimonial || null,
      status: data.status || 'published',
      featured: data.featured ?? false,
    });

    revalidatePath('/admin/case-studies');
    revalidatePath('/case-studies');
    return { success: true, data: created };
  } catch (error: any) {
    console.error('Error creating case study:', error);
    return { success: false, error: error.message || 'Failed to create case study' };
  }
}

export async function updateCaseStudyAction(
  id: string,
  data: Partial<CaseStudyRecord>
): Promise<ActionResponse<CaseStudyRecord>> {
  try {
    const updated = await updateCaseStudyDb(id, data);
    revalidatePath('/admin/case-studies');
    revalidatePath(`/admin/case-studies/${id}`);
    revalidatePath('/case-studies');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating case study:', error);
    return { success: false, error: error.message || 'Failed to update case study' };
  }
}

export async function deleteCaseStudyAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    const deleted = await deleteCaseStudyDb(id);
    revalidatePath('/admin/case-studies');
    revalidatePath('/case-studies');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting case study:', error);
    return { success: false, error: error.message || 'Failed to delete case study' };
  }
}
