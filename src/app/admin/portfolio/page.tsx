import React from 'react';
import { getPortfolioItems } from '@/lib/services/contentService';
import { getClientsOptions } from '@/lib/services/operationsService';
import { PortfolioClientView } from './PortfolioClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portfolio CMS | OneDot ABM',
  description: 'Manage showcase portfolio items, case snapshots, categories, and technology tags.',
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const [items, clients] = await Promise.all([
    getPortfolioItems({
      category: resolvedParams.category,
      search: resolvedParams.search,
    }),
    getClientsOptions(),
  ]);

  return <PortfolioClientView initialItems={items} clients={clients} />;
}
