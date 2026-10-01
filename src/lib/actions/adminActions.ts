'use server';

import { revalidatePath } from 'next/cache';
import {
  toggleIntegration,
  updateIntegrationConfig,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateCompanySettings,
} from '@/lib/services/systemService';
import { QuotationStatus, InvoiceStatus, UserRole, CompanySettingsRecord } from '@/types/database';

// ============================================================================
// FINANCE SERVER ACTIONS
// ============================================================================

export async function toggleIntegrationAction(
  provider: string,
  status: 'connected' | 'disconnected' | 'error',
  config?: Record<string, unknown>
) {
  try {
    const integration = await toggleIntegration(provider, status, config);
    revalidatePath('/admin/integrations');
    return { success: true, data: integration };
  } catch (error: any) {
    console.error('toggleIntegrationAction error:', error);
    return { success: false, error: error.message || 'Failed to update integration' };
  }
}

export async function updateIntegrationConfigAction(
  provider: string,
  config: Record<string, unknown>
) {
  try {
    const integration = await updateIntegrationConfig(provider, config);
    revalidatePath('/admin/integrations');
    return { success: true, data: integration };
  } catch (error: any) {
    console.error('updateIntegrationConfigAction error:', error);
    return { success: false, error: error.message || 'Failed to save configuration' };
  }
}

export async function createTeamMemberAction(data: {
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  active?: boolean;
  password?: string;
}) {
  try {
    const member = await createTeamMember(data);
    revalidatePath('/admin/team');
    return { success: true, data: member };
  } catch (error: any) {
    console.error('createTeamMemberAction error:', error);
    return { success: false, error: error.message || 'Failed to create team member' };
  }
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
  try {
    const member = await updateTeamMember(id, data);
    revalidatePath('/admin/team');
    return { success: true, data: member };
  } catch (error: any) {
    console.error('updateTeamMemberAction error:', error);
    return { success: false, error: error.message || 'Failed to update team member' };
  }
}

export async function deleteTeamMemberAction(id: string) {
  try {
    await deleteTeamMember(id);
    revalidatePath('/admin/team');
    return { success: true };
  } catch (error: any) {
    console.error('deleteTeamMemberAction error:', error);
    return { success: false, error: error.message || 'Failed to delete team member' };
  }
}

export async function updateCompanySettingsAction(data: Partial<CompanySettingsRecord>) {
  try {
    const settings = await updateCompanySettings(data);
    revalidatePath('/admin/settings');
    revalidatePath('/admin/layout');
    return { success: true, data: settings };
  } catch (error: any) {
    console.error('updateCompanySettingsAction error:', error);
    return { success: false, error: error.message || 'Failed to update company settings' };
  }
}
