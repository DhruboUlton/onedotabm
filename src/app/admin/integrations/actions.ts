'use server';

import { isUuid } from '@/lib/db';
import { adminAction } from '@/lib/actions/guard';
import { saveTrackingScript, deleteTrackingScript } from '@/lib/services/trackingService';

const PLACEMENTS = ['head', 'body_start', 'body_end'] as const;

export async function saveTrackingScriptAction(
  id: string | null,
  s: { name: string; description: string; code: string; placement: string; enabled: boolean }
) {
  return adminAction(() => {
    if (id !== null && !isUuid(id)) throw new Error('Invalid id');
    const name = String(s.name ?? '').trim();
    const code = String(s.code ?? '').trim();
    if (!name || !code) throw new Error('Name and code are required');
    if (code.length > 50_000) throw new Error('Script is too long');
    const placement = (PLACEMENTS as readonly string[]).includes(s.placement) ? (s.placement as (typeof PLACEMENTS)[number]) : 'head';
    return saveTrackingScript(id, { name, description: String(s.description ?? '').trim(), code, placement, enabled: s.enabled !== false });
  }, ['/admin/integrations']);
}

export async function deleteTrackingScriptAction(id: string) {
  return adminAction(() => {
    if (!isUuid(id)) throw new Error('Invalid id');
    return deleteTrackingScript(id);
  }, ['/admin/integrations']);
}
