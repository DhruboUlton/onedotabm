import React from 'react';
import { getProjectSummaries } from '@/lib/services/projectService';
import { ProjectsClientView } from './ProjectsClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects | OneDot ABM',
  description: 'Client project tracking.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = 'all', q = '' } = await searchParams;
  const projects = await getProjectSummaries({ status, search: q });
  return <ProjectsClientView projects={projects} status={status} query={q} />;
}
