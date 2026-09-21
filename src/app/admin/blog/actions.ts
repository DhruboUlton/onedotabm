'use server';

import { revalidatePath } from 'next/cache';
import {
  createBlogPostDb,
  updateBlogPostDb,
  deleteBlogPostDb,
} from '@/lib/services/contentService';
import { BlogPostRecord, ContentStatus } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createBlogPostAction(
  data: Partial<BlogPostRecord>
): Promise<ActionResponse<BlogPostRecord>> {
  try {
    if (!data.title?.trim() || !data.content?.trim()) {
      return { success: false, error: 'Title and Content are required.' };
    }

    const created = await createBlogPostDb({
      title: data.title.trim(),
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      featured_image: data.featured_image || null,
      author_id: data.author_id || null,
      category: data.category || 'Marketing',
      tags: data.tags || [],
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      canonical_url: data.canonical_url || null,
      published_at: data.published_at || null,
      status: data.status || 'draft',
    });

    revalidatePath('/admin/blog');
    return { success: true, data: created };
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return { success: false, error: error.message || 'Failed to create blog post' };
  }
}

export async function updateBlogPostAction(
  id: string,
  data: Partial<BlogPostRecord>
): Promise<ActionResponse<BlogPostRecord>> {
  try {
    const updated = await updateBlogPostDb(id, data);
    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return { success: false, error: error.message || 'Failed to update blog post' };
  }
}

export async function deleteBlogPostAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    const deleted = await deleteBlogPostDb(id);
    revalidatePath('/admin/blog');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return { success: false, error: error.message || 'Failed to delete blog post' };
  }
}
