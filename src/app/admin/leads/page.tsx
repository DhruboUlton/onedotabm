import React from 'react';
import { getLeads } from '@/lib/services/crmService';
import { LeadStatus, Priority } from '@/types/database';
import { LeadsClientView } from './LeadsClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Leads Management | OneDot ABM CRM',
  description: 'Manage and convert inbound leads and marketing inquiries.',
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: LeadStatus | 'all';
    priority?: Priority | 'all';
  }>;
}) {
  const resolvedParams = await searchParams;
  const leads = await getLeads({
    search: resolvedParams.search,
    status: resolvedParams.status,
    priority: resolvedParams.priority,
    limit: 200,
  });

  return <LeadsClientView initialLeads={leads} />;
}
