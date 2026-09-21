import React from 'react';
import { notFound } from 'next/navigation';
import {
  getWebsiteById,
  getClientsOptions,
  getProjectsOptions,
} from '@/lib/services/operationsService';
import { WebsiteDetailClientView } from './WebsiteDetailClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await getWebsiteById(id);
  if (!site) return { title: 'Website Not Found | OneDot ABM' };
  return {
    title: `${site.website_name} | Website Registry`,
    description: `Technical specifications, hosting, and status for ${site.domain}.`,
  };
}

export default async function WebsiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [site, clients, projects] = await Promise.all([
    getWebsiteById(id),
    getClientsOptions(),
    getProjectsOptions(),
  ]);

  if (!site) {
    notFound();
  }

  return (
    <WebsiteDetailClientView
      website={site}
      clients={clients}
      projects={projects}
    />
  );
}
