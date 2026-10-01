import React from 'react';
import { getInvoiceList } from '@/lib/services/invoiceService';
import { BillingListView } from './BillingListView';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Billing | OneDot ABM' };

export default async function AdminBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = 'all', q = '' } = await searchParams;
  const invoices = await getInvoiceList({ status, search: q });
  return <BillingListView invoices={invoices} status={status} query={q} />;
}
