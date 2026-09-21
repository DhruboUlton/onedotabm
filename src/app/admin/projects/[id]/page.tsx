import React from 'react';
import { notFound } from 'next/navigation';
import {
  getProjectById,
  getClientsOptions,
  getProfilesOptions,
} from '@/lib/services/operationsService';
import { ProjectDetailClientView } from './ProjectDetailClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return { title: 'Project Not Found | OneDot ABM' };
  return {
    title: `${project.project_name} | Project Workspace`,
    description: `Workspace details, checklist, and milestones for ${project.project_name}.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, clients, profiles] = await Promise.all([
    getProjectById(id),
    getClientsOptions(),
    getProfilesOptions(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailClientView
      project={project}
      clients={clients}
      profiles={profiles}
    />
  );
}
