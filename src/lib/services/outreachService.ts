import { dbQuery } from '@/lib/db';

export interface OutreachProspect {
  id: string;
  business_name: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  category: string;
  contact_type: string;
  google_rating: string;
  google_review_count: string;
  owner_name: string;
  major_services: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  tiktok: string;
  youtube: string;
  pinterest: string;
  batch: string;
  status: string;
  email_sent_at: string | null;
  dm_sent_at: string | null;
  follow_up_1_at: string | null;
  follow_up_2_at: string | null;
  follow_up_3_at: string | null;
  follow_up_4_at: string | null;
  notes: string;
  created_at: string;
}

export const PROSPECT_STATUSES = ['new', 'contacted', 'replied', 'converted', 'not_interested'] as const;

export async function getOutreachProspects(): Promise<OutreachProspect[]> {
  const res = await dbQuery<OutreachProspect>(
    `SELECT *, email_sent_at::text, dm_sent_at::text, follow_up_1_at::text, follow_up_2_at::text,
            follow_up_3_at::text, follow_up_4_at::text, created_at::text
       FROM public.outreach_prospects ORDER BY outreach_prospects.created_at DESC, business_name`
  );
  return res.rows;
}

// Column order matters: it is the order of the values in each row below.
const IMPORT_COLUMNS = [
  ['businessName', 'business_name', 300], ['phone', 'phone', 100], ['email', 'email', 300], ['website', 'website', 500],
  ['city', 'city', 200], ['category', 'category', 200], ['contactType', 'contact_type', 200],
  ['googleRating', 'google_rating', 20], ['googleReviewCount', 'google_review_count', 20],
  ['ownerName', 'owner_name', 200], ['majorServices', 'major_services', 500],
  ['facebook', 'facebook', 500], ['instagram', 'instagram', 500], ['linkedin', 'linkedin', 500],
  ['twitter', 'twitter', 500], ['tiktok', 'tiktok', 500], ['youtube', 'youtube', 500], ['pinterest', 'pinterest', 500],
] as const;

/** Inserts the rows in one statement; rows without a business name are skipped. */
export async function importOutreachProspects(rows: Record<string, string>[], batch: string): Promise<number> {
  const clean = rows.filter((r) => r.businessName?.trim());
  if (clean.length === 0) return 0;
  const width = IMPORT_COLUMNS.length + 1;
  const params: string[] = [];
  const tuples = clean.map((r, i) => {
    for (const [key, , max] of IMPORT_COLUMNS) params.push(String(r[key] ?? '').trim().slice(0, max));
    params.push(batch.slice(0, 200));
    return `(${Array.from({ length: width }, (_, j) => `$${i * width + j + 1}`).join(',')})`;
  });
  const res = await dbQuery(
    `INSERT INTO public.outreach_prospects (${IMPORT_COLUMNS.map((c) => c[1]).join(',')}, batch) VALUES ${tuples.join(',')}`,
    params
  );
  return res.rowCount ?? 0;
}

export interface ProspectPatch {
  status?: string;
  notes?: string;
  emailSent?: boolean;
  dmSent?: boolean;
  followUp1?: boolean;
  followUp2?: boolean;
  followUp3?: boolean;
  followUp4?: boolean;
}

/** A checkbox stamps the time when ticked and clears it when unticked. */
export async function patchOutreachProspect(id: string, patch: ProspectPatch): Promise<void> {
  const sets: string[] = [];
  const params: unknown[] = [id];
  const add = (sql: string, v?: unknown) => {
    if (v !== undefined) params.push(v);
    sets.push(sql.replace('?', `$${params.length}`));
  };
  if (patch.status !== undefined) add('status = ?', patch.status);
  if (patch.notes !== undefined) add('notes = ?', patch.notes);
  const stamp = (col: string, on?: boolean) => on !== undefined && add(`${col} = ${on ? 'NOW()' : 'NULL'}`);
  stamp('email_sent_at', patch.emailSent);
  stamp('dm_sent_at', patch.dmSent);
  stamp('follow_up_1_at', patch.followUp1);
  stamp('follow_up_2_at', patch.followUp2);
  stamp('follow_up_3_at', patch.followUp3);
  stamp('follow_up_4_at', patch.followUp4);
  if (sets.length === 0) return;
  await dbQuery(`UPDATE public.outreach_prospects SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $1::uuid`, params);
}

export async function deleteOutreachProspects(by: { ids?: string[]; batch?: string }): Promise<number> {
  if (by.batch) return (await dbQuery(`DELETE FROM public.outreach_prospects WHERE batch = $1`, [by.batch])).rowCount ?? 0;
  if (by.ids?.length) return (await dbQuery(`DELETE FROM public.outreach_prospects WHERE id = ANY($1::uuid[])`, [by.ids])).rowCount ?? 0;
  return 0;
}
