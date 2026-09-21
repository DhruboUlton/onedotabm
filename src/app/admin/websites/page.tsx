import React from 'react';
import {
  getWebsites,
  getClientsOptions,
  getProjectsOptions,
} from '@/lib/services/operationsService';
import { WebsitesClientView } from './WebsitesClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Website Registry | OneDot ABM',
  description: 'Manage client web infrastructure, tech stacks, hosting renewals, and live deployment statuses.',
};

export default async function WebsitesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const [websites, clients, projects] = await Promise.all([
    getWebsites({
      status: resolvedParams.status,
      search: resolvedParams.search,
    }),
    getClientsOptions(),
    getProjectsOptions(),
  ]);

  return (
    <WebsitesClientView
      initialWebsites={websites}
      clients={clients}
      projects={projects}
    />
  );
}
