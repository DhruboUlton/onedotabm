import React from 'react';
import { notFound } from 'next/navigation';
import { getInvoiceById } from '@/lib/services/financeService';
import { getCompanySettings } from '@/lib/services/systemService';
import { InvoiceDetailClient } from '@/components/admin/InvoiceDetailClient';

export const dynamic = 'force-dynamic';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // The letterhead is whatever is in settings, not a copy hardcoded in the view.
  const [invoice, company] = await Promise.all([getInvoiceById(id), getCompanySettings()]);

  if (!invoice) {
    notFound();
  }

  return <InvoiceDetailClient invoice={invoice} company={company} />;
}
