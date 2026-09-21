'use server';

import { getCurrentAdmin } from '@/lib/auth/adminAuth';

import { revalidatePath } from 'next/cache';
import {
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  convertLeadToProspect,
} from '@/lib/services/crmService';
import { LeadRecord, LeadStatus, Priority, ProspectRecord } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createLeadAction(
  input: FormData | Partial<LeadRecord>
): Promise<ActionResponse<LeadRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    let payload: Partial<LeadRecord> = {};

    if (input instanceof FormData) {
      const tagsRaw = input.get('tags') as string | null;
      payload = {
        name: (input.get('name') as string) || '',
        company: (input.get('company') as string) || undefined,
        email: (input.get('email') as string) || '',
        phone: (input.get('phone') as string) || undefined,
        country: (input.get('country') as string) || 'Bangladesh',
        city: (input.get('city') as string) || undefined,
        website: (input.get('website') as string) || undefined,
        service_interested: (input.get('service_interested') as string) || undefined,
        lead_source: (input.get('lead_source') as string) || 'website',
        budget: (input.get('budget') as string) || undefined,
        message: (input.get('message') as string) || undefined,
        status: ((input.get('status') as LeadStatus) || 'new'),
        priority: ((input.get('priority') as Priority) || 'medium'),
        tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [],
        notes: (input.get('notes') as string) || undefined,
      };
    } else {
      payload = input;
    }

    if (!payload.name || !payload.email) {
      return { success: false, error: 'Name and Email are required.' };
    }

    const lead = await createLead(payload);
    revalidatePath('/admin/leads');
    return { success: true, data: lead };
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return { success: false, error: error.message || 'Failed to create lead' };
  }
}

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus
): Promise<ActionResponse<LeadRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateLeadStatus(id, status);
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return { success: false, error: error.message || 'Failed to update lead status' };
  }
}

export async function updateLeadAction(
  id: string,
  data: Partial<LeadRecord>
): Promise<ActionResponse<LeadRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateLead(id, data);
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return { success: false, error: error.message || 'Failed to update lead' };
  }
}

export async function deleteLeadAction(id: string): Promise<ActionResponse<boolean>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deleted = await deleteLead(id);
    revalidatePath('/admin/leads');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return { success: false, error: error.message || 'Failed to delete lead' };
  }
}

export async function convertLeadAction(
  leadId: string,
  dealData: Partial<ProspectRecord> = {}
): Promise<ActionResponse<ProspectRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const prospect = await convertLeadToProspect(leadId, dealData);
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath('/admin/prospects');
    return { success: true, data: prospect };
  } catch (error: any) {
    console.error('Error converting lead to prospect:', error);
    return { success: false, error: error.message || 'Failed to convert lead to prospect' };
  }
}
