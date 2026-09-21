import React from 'react';
import {
  getInvoices,
  getClientsForFinance,
  getProjectsForFinance,
} from '@/lib/services/financeService';
import { BillingClient } from '@/components/admin/BillingClient';

export const dynamic = 'force-dynamic';

export default async function AdminBillingPage() {
  const [invoices, clients, projects] = await Promise.all([
    getInvoices(),
    getClientsForFinance(),
    getProjectsForFinance(),
  ]);

  return (
    <BillingClient
      initialInvoices={invoices}
      clients={clients}
      projects={projects}
    />
  );
}
