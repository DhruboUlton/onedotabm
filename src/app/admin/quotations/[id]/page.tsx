import React from 'react';
import { notFound } from 'next/navigation';
import { getQuotationDetail } from '@/lib/services/quotationService';
import { getBillingClients } from '@/lib/services/invoiceService';
import { getProjectsOptions } from '@/lib/services/operationsService';
import { getCompanySettings } from '@/lib/services/systemService';
import { QuotationEditor } from './QuotationEditor';

export const dynamic = 'force-dynamic';

export default async function QuotationEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { id } = await params;
  const { projectId } = await searchParams;
  const isNew = id === 'new';
  const [quotation, clients, projects, company] = await Promise.all([
    isNew ? null : getQuotationDetail(id),
    getBillingClients(),
    getProjectsOptions(),
    getCompanySettings(),
  ]);
  if (!isNew && !quotation) notFound();

  return (
    <QuotationEditor
      key={id}
      quotation={quotation}
      clients={clients}
      projects={projects}
      initialProjectId={isNew ? projectId ?? '' : ''}
      defaultCurrency={company.default_currency || 'BDT'}
      defaultTaxRate={Number(company.tax_rate) || 0}
    />
  );
}
