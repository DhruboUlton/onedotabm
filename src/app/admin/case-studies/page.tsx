import React from 'react';
import { getCaseStudiesDb } from '@/lib/services/contentService';
import { getClientsOptions } from '@/lib/services/operationsService';
import { CaseStudiesClientView } from './CaseStudiesClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Case Studies CMS | OneDot ABM',
  description: 'Manage client case studies, verified metrics, 4-pillar methodology, and ROI achievements.',
};

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const [studies, clients] = await Promise.all([
    getCaseStudiesDb({
      status: resolvedParams.status,
      search: resolvedParams.search,
    }),
    getClientsOptions(),
  ]);

  return <CaseStudiesClientView initialStudies={studies} clients={clients} />;
}
