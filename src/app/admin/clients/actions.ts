'use server';

import { getCurrentAdmin } from '@/lib/auth/adminAuth';

import { revalidatePath } from 'next/cache';
import {
  createClient,
  updateClient,
  deleteClient,
} from '@/lib/services/crmService';
import { ClientRecord } from '@/types/database';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createClientAction(
  input: FormData | Partial<ClientRecord>
): Promise<ActionResponse<ClientRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    let payload: Partial<ClientRecord> = {};

    if (input instanceof FormData) {
      const servicesRaw = input.get('services') as string | null;
      payload = {
        company_name: (input.get('company_name') as string) || '',
        contact_person: (input.get('contact_person') as string) || '',
        email: (input.get('email') as string) || '',
        phone: (input.get('phone') as string) || undefined,
        website: (input.get('website') as string) || undefined,
        address: (input.get('address') as string) || undefined,
        industry: (input.get('industry') as string) || undefined,
        services: servicesRaw ? servicesRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
        status: (input.get('status') as string) || 'active',
        start_date: (input.get('start_date') as string) || new Date().toISOString().split('T')[0],
        notes: (input.get('notes') as string) || undefined,
      };
    } else {
      payload = input;
    }

    if (!payload.company_name || !payload.contact_person || !payload.email) {
      return { success: false, error: 'Company Name, Contact Person, and Email are required.' };
    }

    const client = await createClient(payload);
    revalidatePath('/admin/clients');
    return { success: true, data: client };
  } catch (error: any) {
    console.error('Error creating client:', error);
    return { success: false, error: error.message || 'Failed to create client' };
  }
}

export async function updateClientAction(
  id: string,
  data: Partial<ClientRecord>
): Promise<ActionResponse<ClientRecord>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const updated = await updateClient(id, data);
    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${id}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating client:', error);
    return { success: false, error: error.message || 'Failed to update client' };
  }
}

export async function deleteClientAction(id: string): Promise<ActionResponse<boolean>> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const deleted = await deleteClient(id);
    revalidatePath('/admin/clients');
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return { success: false, error: error.message || 'Failed to delete client' };
  }
}
