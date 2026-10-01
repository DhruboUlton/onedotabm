'use server';

import { rateLimit } from '@/lib/rateLimit';
import { searchPublicInvoices, InvoiceSummary } from '@/lib/services/invoiceService';

export async function searchInvoicesAction(
  q: string
): Promise<{ results: InvoiceSummary[]; error?: string }> {
  if (!(await rateLimit('billing-search', 20, 600))) {
    return { results: [], error: 'Too many searches. Wait a few minutes and try again.' };
  }
  try {
    return { results: await searchPublicInvoices(String(q ?? '')) };
  } catch (e) {
    console.error('[billing search] failed', e);
    return { results: [], error: 'Search is unavailable right now. Try again shortly.' };
  }
}
