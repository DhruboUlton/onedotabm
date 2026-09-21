'use server';

import { getCurrentAdmin } from '@/lib/auth/adminAuth';

import { revalidatePath } from 'next/cache';
import {
  getSiteBannerDb,
  updateSiteBannerDb,
  createSiteBannerDb,
  deleteSiteBannerDb,
} from '@/lib/services/contentService';
import { SiteBannerRecord } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function saveSiteBannerAction(
  id: string,
  data: Partial<SiteBannerRecord>
): Promise<ActionResponse<SiteBannerRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    if (!data.message?.trim()) {
      return { success: false, error: 'Announcement message cannot be empty.' };
    }

    const updated = await updateSiteBannerDb(id, data);
    revalidatePath('/admin/site-banner');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error saving site banner:', error);
    return { success: false, error: error.message || 'Failed to save site banner' };
  }
}

export async function createSiteBannerAction(
  data: Partial<SiteBannerRecord>
): Promise<ActionResponse<SiteBannerRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    if (!data.message?.trim()) {
      return { success: false, error: 'Announcement message is required.' };
    }

    const created = await createSiteBannerDb({
      message: data.message.trim(),
      link_text: data.link_text || null,
      link_url: data.link_url || null,
      enabled: data.enabled ?? false,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      priority: data.priority ? Number(data.priority) : 1,
    });

    revalidatePath('/admin/site-banner');
    revalidatePath('/');
    return { success: true, data: created };
  } catch (error: any) {
    console.error('Error creating site banner:', error);
    return { success: false, error: error.message || 'Failed to create site banner' };
  }
}

export async function deleteSiteBannerAction(id: string): Promise<ActionResponse<boolean>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deleted = await deleteSiteBannerDb(id);
    revalidatePath('/admin/site-banner');
    revalidatePath('/');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting site banner:', error);
    return { success: false, error: error.message || 'Failed to delete site banner' };
  }
}
