import React from 'react';
import { getProspects } from '@/lib/services/crmService';
import { ProspectStage } from '@/types/database';
import { ProspectsClientView } from './ProspectsClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sales Deal Pipeline | OneDot ABM CRM',
  description: 'Manage sales deals, stages, expected revenue, and probabilities.',
};

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    stage?: ProspectStage | 'all';
    search?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const prospects = await getProspects({
    stage: resolvedParams.stage,
    search: resolvedParams.search,
  });

  return <ProspectsClientView initialProspects={prospects} />;
}
