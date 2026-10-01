import React from 'react';
import { getQuotationList } from '@/lib/services/quotationService';
import { QuotationsListView } from './QuotationsListView';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Quotations | OneDot ABM' };

export default async function AdminQuotationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = 'all', q = '' } = await searchParams;
  const quotations = await getQuotationList({ status, search: q });
  return <QuotationsListView quotations={quotations} status={status} query={q} />;
}
