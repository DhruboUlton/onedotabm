import React from 'react';
import { getClients } from '@/lib/services/crmService';
import { ClientsClientView } from './ClientsClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Client Accounts Directory | OneDot ABM CRM',
  description: 'Manage client accounts, contracts, deliverables, and relationship history.',
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const clients = await getClients({
    search: resolvedParams.search,
    status: resolvedParams.status,
  });

  return <ClientsClientView initialClients={clients} />;
}
