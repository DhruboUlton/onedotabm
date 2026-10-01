'use server';

import { rateLimit } from '@/lib/rateLimit';
import { recordPageView } from '@/lib/services/trackingService';

export async function recordPageViewAction(path: string, referrer: string): Promise<void> {
  if (typeof path !== 'string' || !path.startsWith('/')) return;
  if (!(await rateLimit('pageview', 300, 3600))) return;
  try {
    await recordPageView(path, typeof referrer === 'string' ? referrer : '');
  } catch {
    // Analytics must never break a page.
  }
}
