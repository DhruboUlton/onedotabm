'use server';

import { isUuid } from '@/lib/db';
import { adminAction } from '@/lib/actions/guard';
import {
  PROSPECT_STATUSES,
  ProspectPatch,
  importOutreachProspects,
  patchOutreachProspect,
  deleteOutreachProspects,
} from '@/lib/services/outreachService';

const MAX_ROWS = 5000;

export async function importProspectsAction(rows: Record<string, string>[], batch: string) {
  return adminAction(async () => {
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('No rows to import');
    if (rows.length > MAX_ROWS) throw new Error(`Import at most ${MAX_ROWS} rows at a time`);
    return { count: await importOutreachProspects(rows, String(batch ?? '').trim()) };
  }, ['/admin/prospects']);
}

export async function updateProspectAction(id: string, patch: ProspectPatch) {
  return adminAction(() => {
    if (!isUuid(id)) throw new Error('Invalid id');
    if (patch.status !== undefined && !(PROSPECT_STATUSES as readonly string[]).includes(patch.status)) {
      throw new Error('Invalid status');
    }
    return patchOutreachProspect(id, {
      status: patch.status,
      notes: patch.notes === undefined ? undefined : String(patch.notes).slice(0, 5000),
      emailSent: patch.emailSent,
      dmSent: patch.dmSent,
      followUp1: patch.followUp1,
      followUp2: patch.followUp2,
      followUp3: patch.followUp3,
      followUp4: patch.followUp4,
    });
  });
}

export async function deleteProspectsAction(by: { ids?: string[]; batch?: string }) {
  return adminAction(() => {
    if (by.ids && !by.ids.every(isUuid)) throw new Error('Invalid id');
    return deleteOutreachProspects({ ids: by.ids, batch: by.batch });
  }, ['/admin/prospects']);
}
