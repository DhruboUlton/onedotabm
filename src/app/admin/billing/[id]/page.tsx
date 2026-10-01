import React from 'react';
import { notFound } from 'next/navigation';
import { getInvoiceDetail, getBillingClients } from '@/lib/services/invoiceService';
import { getCompanySettings } from '@/lib/services/systemService';
import { InvoiceEditor } from './InvoiceEditor';

export const dynamic = 'force-dynamic';

export default async function InvoiceEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const [invoice, clients, company] = await Promise.all([
    isNew ? null : getInvoiceDetail(id),
    getBillingClients(),
    getCompanySettings(),
  ]);
  if (!isNew && !invoice) notFound();

  return (
    <InvoiceEditor
      key={id}
      invoice={invoice}
      clients={clients}
      defaultCurrency={company.default_currency || 'BDT'}
      defaultTaxRate={Number(company.tax_rate) || 0}
    />
  );
}
