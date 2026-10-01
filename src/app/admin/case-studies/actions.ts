'use server';

import { getCurrentAdmin } from '@/lib/auth/adminAuth';

import { revalidatePath } from 'next/cache';
import {
  createCaseStudyDb,
  updateCaseStudyDb,
  deleteCaseStudyDb,
} from '@/lib/services/contentService';
import { CaseStudyRecord } from '@/types/database';
import { adminAction } from '@/lib/actions/guard';
import { dbQuery } from '@/lib/db';
import { slugify } from '@/lib/services/contentService';
import type { CaseStudyCsvRow } from '@/lib/caseStudyCsv';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createCaseStudyAction(
  data: Partial<CaseStudyRecord>
): Promise<ActionResponse<CaseStudyRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

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
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

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
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

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

const MAX_IMPORT = 500;

/**
 * Imports parsed CSV rows as published case studies. A row whose client and
 * headline already exist is skipped, so uploading the same file twice is safe.
 */
export async function importCaseStudiesAction(rows: CaseStudyCsvRow[]) {
  return adminAction(async (admin) => {
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('No rows to import');
    if (rows.length > MAX_IMPORT) throw new Error(`Import at most ${MAX_IMPORT} rows at a time`);

    const existing = await dbQuery<{ client_name: string; result: string; slug: string }>(
      `SELECT client_name, result, slug FROM public.case_studies`
    );
    const seen = new Set(existing.rows.map((r) => `${r.client_name}\u0000${r.result}`.toLowerCase()));
    const slugs = new Set(existing.rows.map((r) => r.slug));

    let created = 0;
    let skipped = 0;
    let invalid = 0;
    for (const r of rows) {
      const client = String(r.client ?? '').trim().slice(0, 200);
      const headline = String(r.headline ?? '').trim().slice(0, 300);
      if (!client || !headline) {
        invalid++;
        continue;
      }
      const key = `${client}\u0000${headline}`.toLowerCase();
      if (seen.has(key)) {
        skipped++;
        continue;
      }
      seen.add(key);

      const title = `${client}: ${headline}`.slice(0, 200);
      const base = slugify(title).slice(0, 80) || 'case-study';
      let slug = base;
      for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`;
      slugs.add(slug);

      const metrics = (Array.isArray(r.metrics) ? r.metrics : [])
        .slice(0, 4)
        .map((m) => ({ metric: String(m.metric ?? '').slice(0, 120), label: String(m.label ?? '').slice(0, 120) }));
      const hero = metrics.find((m) => m.label) ?? metrics[0];

      await createCaseStudyDb(
        {
          title,
          slug,
          client_name: client,
          industry: String(r.industry ?? '').slice(0, 200) || 'General',
          challenge: String(r.challenge ?? '').slice(0, 2000),
          strategy: String(r.solution ?? '').slice(0, 2000),
          execution: String(r.description ?? '').slice(0, 2000),
          result: headline,
          services: (Array.isArray(r.services) ? r.services : []).map((s) => String(s).slice(0, 100)).slice(0, 12),
          hero_metric_value: hero?.metric ?? null,
          hero_metric_label: hero?.label ?? null,
          metrics,
          testimonial: String(r.testimonial ?? '').slice(0, 2000) || null,
          status: 'published',
          featured: Boolean(r.featured),
        },
        { id: admin.id, name: admin.full_name }
      );
      created++;
    }
    return { created, skipped, invalid };
  }, ['/admin/case-studies']);
}
