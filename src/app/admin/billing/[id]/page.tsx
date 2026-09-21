import React from 'react';
import { notFound } from 'next/navigation';
import { getInvoiceById } from '@/lib/services/financeService';
import { InvoiceDetailClient } from '@/components/admin/InvoiceDetailClient';

export const dynamic = 'force-dynamic';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return <InvoiceDetailClient invoice={invoice} />;
}
