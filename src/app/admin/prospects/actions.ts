'use server';

import { getCurrentAdmin } from '@/lib/auth/adminAuth';

import { revalidatePath } from 'next/cache';
import {
  createProspect,
  updateProspect,
  updateProspectStage,
  deleteProspect,
} from '@/lib/services/crmService';
import { ProspectRecord, ProspectStage } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createProspectAction(
  input: FormData | Partial<ProspectRecord>
): Promise<ActionResponse<ProspectRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    let payload: Partial<ProspectRecord> = {};

    if (input instanceof FormData) {
      const servicesRaw = input.get('services') as string | null;
      payload = {
        company: (input.get('company') as string) || '',
        contact_person: (input.get('contact_person') as string) || '',
        email: (input.get('email') as string) || '',
        phone: (input.get('phone') as string) || undefined,
        services: servicesRaw ? servicesRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
        estimated_deal_value: parseFloat((input.get('estimated_deal_value') as string) || '0') || 0,
        currency: (input.get('currency') as string) || 'BDT',
        probability: parseInt((input.get('probability') as string) || '50', 10) || 50,
        stage: ((input.get('stage') as ProspectStage) || 'qualified'),
        expected_close_date: (input.get('expected_close_date') as string) || undefined,
        notes: (input.get('notes') as string) || undefined,
      };
    } else {
      payload = input;
    }

    if (!payload.company || !payload.contact_person || !payload.email) {
      return { success: false, error: 'Company, Contact Person, and Email are required.' };
    }

    const prospect = await createProspect(payload);
    revalidatePath('/admin/prospects');
    return { success: true, data: prospect };
  } catch (error: any) {
    console.error('Error creating prospect:', error);
    return { success: false, error: error.message || 'Failed to create prospect' };
  }
}

export async function updateProspectStageAction(
  id: string,
  stage: ProspectStage
): Promise<ActionResponse<ProspectRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateProspectStage(id, stage);
    revalidatePath('/admin/prospects');
    revalidatePath(`/admin/prospects/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating prospect stage:', error);
    return { success: false, error: error.message || 'Failed to update prospect stage' };
  }
}

export async function updateProspectAction(
  id: string,
  data: Partial<ProspectRecord>
): Promise<ActionResponse<ProspectRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateProspect(id, data);
    revalidatePath('/admin/prospects');
    revalidatePath(`/admin/prospects/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating prospect:', error);
    return { success: false, error: error.message || 'Failed to update prospect' };
  }
}

export async function deleteProspectAction(id: string): Promise<ActionResponse<boolean>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deleted = await deleteProspect(id);
    revalidatePath('/admin/prospects');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting prospect:', error);
    return { success: false, error: error.message || 'Failed to delete prospect' };
  }
}
