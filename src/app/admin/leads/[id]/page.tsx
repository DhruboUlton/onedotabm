import React from 'react';
import { notFound } from 'next/navigation';
import { getLeadById } from '@/lib/services/crmService';
import { LeadDetailClientView } from './LeadDetailClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);
  return {
    title: lead ? `${lead.name} — Lead 360° | OneDot CRM` : 'Lead Not Found',
  };
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return <LeadDetailClientView lead={lead} />;
}
