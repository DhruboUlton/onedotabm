import React from 'react';
import { notFound } from 'next/navigation';
import { getQuotationById } from '@/lib/services/financeService';
import { QuotationDetailClient } from '@/components/admin/QuotationDetailClient';

export const dynamic = 'force-dynamic';

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quotation = await getQuotationById(id);

  if (!quotation) {
    notFound();
  }

  return <QuotationDetailClient quotation={quotation} />;
}
