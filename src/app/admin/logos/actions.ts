'use server';

import { revalidatePath } from 'next/cache';
import {
  createLogoDb,
  updateLogoDb,
  deleteLogoDb,
} from '@/lib/services/contentService';
import { LogoRecord } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createLogoAction(
  data: Partial<LogoRecord>
): Promise<ActionResponse<LogoRecord>> {
  try {
    if (!data.company_name?.trim() || !data.logo_url?.trim()) {
      return { success: false, error: 'Company Name and Logo URL are required.' };
    }

    const created = await createLogoDb({
      company_name: data.company_name.trim(),
      logo_url: data.logo_url.trim(),
      website: data.website || null,
      category: data.category || 'Client',
      featured: data.featured ?? true,
      display_order: data.display_order ? Number(data.display_order) : 0,
      published: data.published ?? true,
    });

    revalidatePath('/admin/logos');
    revalidatePath('/');
    return { success: true, data: created };
  } catch (error: any) {
    console.error('Error creating logo:', error);
    return { success: false, error: error.message || 'Failed to create logo' };
  }
}

export async function updateLogoAction(
  id: string,
  data: Partial<LogoRecord>
): Promise<ActionResponse<LogoRecord>> {
  try {
    const updated = await updateLogoDb(id, data);
    revalidatePath('/admin/logos');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating logo:', error);
    return { success: false, error: error.message || 'Failed to update logo' };
  }
}

export async function deleteLogoAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    const deleted = await deleteLogoDb(id);
    revalidatePath('/admin/logos');
    revalidatePath('/');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting logo:', error);
    return { success: false, error: error.message || 'Failed to delete logo' };
  }
}
