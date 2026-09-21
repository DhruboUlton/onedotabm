import React from 'react';
import {
  getProjects,
  getClientsOptions,
  getProfilesOptions,
} from '@/lib/services/operationsService';
import { ProjectsClientView } from './ProjectsClientView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects & Delivery | OneDot ABM',
  description: 'Manage development projects, sprints, milestones, and client deliverables.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const [projects, clients, profiles] = await Promise.all([
    getProjects({
      status: resolvedParams.status,
      search: resolvedParams.search,
    }),
    getClientsOptions(),
    getProfilesOptions(),
  ]);

  return (
    <ProjectsClientView
      initialProjects={projects}
      clients={clients}
      profiles={profiles}
    />
  );
}
