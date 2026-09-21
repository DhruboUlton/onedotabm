import React from 'react';
import { getTeamMembers } from '@/lib/services/systemService';
import { TeamClient } from '@/components/admin/TeamClient';

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage() {
  const members = await getTeamMembers();

  return <TeamClient members={members} />;
}
