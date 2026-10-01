'use server';

import { adminAction } from '@/lib/actions/guard';
import { isUuid } from '@/lib/db';
import {
  toggleIntegration,
  updateIntegrationConfig,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateCompanySettings,
} from '@/lib/services/systemService';
import { UserRole, CompanySettingsRecord } from '@/types/database';

// Every action here runs behind adminAction, so an anonymous POST is refused.
// Managing the team, the company settings and integrations is further limited
// to owners and admins: a manager or editor must not be able to make
// themselves an owner.

function ownerOnly(admin: { role: UserRole }) {
  if (admin.role !== 'owner' && admin.role !== 'admin') throw new Error('Only an owner or admin can do this.');
}

const ROLES: UserRole[] = ['owner', 'admin', 'manager', 'marketing', 'developer', 'finance', 'editor'];

function checkRole(role: unknown) {
  if (role !== undefined && !ROLES.includes(role as UserRole)) throw new Error('Invalid role');
}

export async function toggleIntegrationAction(
  provider: string,
  status: 'connected' | 'disconnected' | 'error',
  config?: Record<string, unknown>
) {
  return adminAction(async (admin) => {
    ownerOnly(admin);
    return toggleIntegration(provider, status, config);
  }, ['/admin/integrations']);
}

export async function updateIntegrationConfigAction(provider: string, config: Record<string, unknown>) {
  return adminAction(async (admin) => {
    ownerOnly(admin);
    return updateIntegrationConfig(provider, config);
  }, ['/admin/integrations']);
}

export async function createTeamMemberAction(data: {
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  active?: boolean;
  password?: string;
}) {
  return adminAction(async (admin) => {
    ownerOnly(admin);
    checkRole(data.role);
    // Only an owner can mint another owner.
    if (data.role === 'owner' && admin.role !== 'owner') throw new Error('Only an owner can create an owner.');
    return createTeamMember(data);
  }, ['/admin/team']);
}

export async function updateTeamMemberAction(
  id: string,
  data: {
    full_name?: string;
    email?: string;
    role?: UserRole;
    phone?: string | null;
    avatar_url?: string | null;
    active?: boolean;
    password?: string;
  }
) {
  return adminAction(async (admin) => {
    ownerOnly(admin);
    if (!isUuid(id)) throw new Error('Invalid id');
    checkRole(data.role);
    if (data.role === 'owner' && admin.role !== 'owner') throw new Error('Only an owner can make someone an owner.');
    return updateTeamMember(id, data);
  }, ['/admin/team']);
}

export async function deleteTeamMemberAction(id: string) {
  return adminAction(async (admin) => {
    ownerOnly(admin);
    if (!isUuid(id)) throw new Error('Invalid id');
    if (id === admin.id) throw new Error('You cannot delete your own account.');
    await deleteTeamMember(id);
  }, ['/admin/team']);
}

export async function updateCompanySettingsAction(data: Partial<CompanySettingsRecord>) {
  return adminAction(async (admin) => {
    ownerOnly(admin);
    return updateCompanySettings(data);
  }, ['/admin/settings']);
}
