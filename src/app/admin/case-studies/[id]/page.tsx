import React from 'react';
import { notFound } from 'next/navigation';
import { getCaseStudyDbById } from '@/lib/services/contentService';
import { getClientsOptions } from '@/lib/services/operationsService';
import { CaseStudyEditorClientView } from './CaseStudyEditorClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await getCaseStudyDbById(id);
  if (!study) return { title: 'Case Study Not Found | OneDot ABM' };
  return {
    title: `Edit ${study.title} | Case Studies CMS`,
    description: `Edit verified metrics, strategy, and results for ${study.client_name}.`,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [study, clients] = await Promise.all([
    getCaseStudyDbById(id),
    getClientsOptions(),
  ]);

  if (!study) {
    notFound();
  }

  return <CaseStudyEditorClientView study={study} clients={clients} />;
}
