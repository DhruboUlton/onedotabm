'use server';

import { getCurrentAdmin } from '@/lib/auth/adminAuth';

import { revalidatePath } from 'next/cache';
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '@/lib/services/contentService';
import { PortfolioItemRecord } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createPortfolioItemAction(
  data: Partial<PortfolioItemRecord>
): Promise<ActionResponse<PortfolioItemRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    if (!data.title?.trim() || !data.category) {
      return { success: false, error: 'Title and Category are required.' };
    }

    const created = await createPortfolioItem({
      title: data.title.trim(),
      slug: data.slug,
      client_id: data.client_id || null,
      category: data.category,
      description: data.description || null,
      featured_image: data.featured_image || null,
      gallery: data.gallery || [],
      services: data.services || [],
      technologies: data.technologies || [],
      project_url: data.project_url || null,
      completion_date: data.completion_date || null,
      featured: data.featured ?? false,
      published: data.published ?? true,
      sort_order: data.sort_order ?? 0,
    });

    revalidatePath('/admin/portfolio');
    revalidatePath('/work');
    return { success: true, data: created };
  } catch (error: any) {
    console.error('Error creating portfolio item:', error);
    return { success: false, error: error.message || 'Failed to create portfolio item' };
  }
}

export async function updatePortfolioItemAction(
  id: string,
  data: Partial<PortfolioItemRecord>
): Promise<ActionResponse<PortfolioItemRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updatePortfolioItem(id, data);
    revalidatePath('/admin/portfolio');
    revalidatePath(`/admin/portfolio/${id}`);
    revalidatePath('/work');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating portfolio item:', error);
    return { success: false, error: error.message || 'Failed to update portfolio item' };
  }
}

export async function togglePortfolioPublishedAction(
  id: string,
  published: boolean
): Promise<ActionResponse<PortfolioItemRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updatePortfolioItem(id, { published });
    revalidatePath('/admin/portfolio');
    revalidatePath(`/admin/portfolio/${id}`);
    revalidatePath('/work');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error toggling portfolio status:', error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}

export async function deletePortfolioItemAction(id: string): Promise<ActionResponse<boolean>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deleted = await deletePortfolioItem(id);
    revalidatePath('/admin/portfolio');
    revalidatePath('/work');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting portfolio item:', error);
    return { success: false, error: error.message || 'Failed to delete portfolio item' };
  }
}
