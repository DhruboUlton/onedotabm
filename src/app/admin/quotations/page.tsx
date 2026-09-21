import React from 'react';
import {
  getQuotations,
  getClientsForFinance,
  getProjectsForFinance,
} from '@/lib/services/financeService';
import { QuotationsClient } from '@/components/admin/QuotationsClient';

export const dynamic = 'force-dynamic';

export default async function AdminQuotationsPage() {
  const [quotations, clients, projects] = await Promise.all([
    getQuotations(),
    getClientsForFinance(),
    getProjectsForFinance(),
  ]);

  return (
    <QuotationsClient
      initialQuotations={quotations}
      clients={clients}
      projects={projects}
    />
  );
}
