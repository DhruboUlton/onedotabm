import React from 'react';
import { notFound } from 'next/navigation';
import { getPortfolioItemById } from '@/lib/services/contentService';
import { getClientsOptions } from '@/lib/services/operationsService';
import { PortfolioEditorClientView } from './PortfolioEditorClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPortfolioItemById(id);
  if (!item) return { title: 'Item Not Found | OneDot ABM' };
  return {
    title: `Edit ${item.title} | Portfolio CMS`,
    description: `Edit portfolio item specifications and publishing status.`,
  };
}

export default async function PortfolioItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, clients] = await Promise.all([
    getPortfolioItemById(id),
    getClientsOptions(),
  ]);

  if (!item) {
    notFound();
  }

  return <PortfolioEditorClientView item={item} clients={clients} />;
}
