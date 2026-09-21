import React from 'react';
import { notFound } from 'next/navigation';
import { getProspectById } from '@/lib/services/crmService';
import { ProspectDetailClientView } from './ProspectDetailClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prospect = await getProspectById(id);
  return {
    title: prospect ? `${prospect.company} — Deal Detail | OneDot CRM` : 'Prospect Not Found',
  };
}

export default async function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prospect = await getProspectById(id);

  if (!prospect) {
    notFound();
  }

  return <ProspectDetailClientView prospect={prospect} />;
}
