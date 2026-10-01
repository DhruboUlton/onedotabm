import React from 'react';
import { notFound } from 'next/navigation';
import { getClientsOptions } from '@/lib/services/operationsService';
import { getProjectDetail, getProjectTemplates } from '@/lib/services/projectService';
import { ProjectDetailClientView } from './ProjectDetailClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === 'new') return { title: 'New Project | OneDot ABM' };
  const project = await getProjectDetail(id);
  return { title: project ? `${project.project_name} | Projects` : 'Project Not Found | OneDot ABM' };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  const [project, clients, templates] = await Promise.all([
    isNew ? null : getProjectDetail(id),
    getClientsOptions(),
    getProjectTemplates(),
  ]);

  if (!isNew && !project) notFound();

  return <ProjectDetailClientView key={id} project={project} clients={clients} templates={templates} />;
}
