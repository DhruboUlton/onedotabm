'use server';

import { revalidatePath } from 'next/cache';
import {
  createQuotation,
  updateQuotationStatus,
  deleteQuotation,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  recordPayment,
} from '@/lib/services/financeService';
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

export async function createQuotationAction(payload: {
  quotation_number?: string;
  client_id: string;
  project_id?: string | null;
  issue_date?: string;
  expiry_date?: string;
  currency?: string;
  discount?: number;
  tax?: number;
  notes?: string | null;
  terms?: string | null;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    total?: number;
  }>;
}) {
  try {
    const quotation = await createQuotation(
      {
        quotation_number: payload.quotation_number,
        client_id: payload.client_id,
        project_id: payload.project_id,
        issue_date: payload.issue_date,
        expiry_date: payload.expiry_date,
        currency: payload.currency,
        discount: payload.discount,
        tax: payload.tax,
        notes: payload.notes,
        terms: payload.terms,
      },
      payload.items
    );

    revalidatePath('/admin/quotations');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/analytics');
    return { success: true, data: quotation };
  } catch (error: any) {
    console.error('createQuotationAction error:', error);
    return { success: false, error: error.message || 'Failed to create quotation' };
  }
}

export async function updateQuotationStatusAction(id: string, status: QuotationStatus) {
  try {
    const quotation = await updateQuotationStatus(id, status);
    revalidatePath('/admin/quotations');
    revalidatePath(`/admin/quotations/${id}`);
    revalidatePath('/admin/dashboard');
    return { success: true, data: quotation };
  } catch (error: any) {
    console.error('updateQuotationStatusAction error:', error);
    return { success: false, error: error.message || 'Failed to update quotation status' };
  }
}

export async function deleteQuotationAction(id: string) {
  try {
    await deleteQuotation(id);
    revalidatePath('/admin/quotations');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('deleteQuotationAction error:', error);
    return { success: false, error: error.message || 'Failed to delete quotation' };
  }
}

export async function createInvoiceAction(payload: {
  invoice_number?: string;
  client_id: string;
  project_id?: string | null;
  quotation_id?: string | null;
  issue_date?: string;
  due_date?: string;
  currency?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  status?: InvoiceStatus;
  payment_method?: string | null;
  notes?: string | null;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    discount?: number;
    total?: number;
  }>;
}) {
  try {
    const invoice = await createInvoice(
      {
        invoice_number: payload.invoice_number,
        client_id: payload.client_id,
        project_id: payload.project_id,
        quotation_id: payload.quotation_id,
        issue_date: payload.issue_date,
        due_date: payload.due_date,
        currency: payload.currency,
        discount: payload.discount,
        tax: payload.tax,
        status: payload.status,
        payment_method: payload.payment_method,
        notes: payload.notes,
      },
      payload.items
    );

    revalidatePath('/admin/billing');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/analytics');
    return { success: true, data: invoice };
  } catch (error: any) {
    console.error('createInvoiceAction error:', error);
    return { success: false, error: error.message || 'Failed to create invoice' };
  }
}

export async function updateInvoiceStatusAction(id: string, status: InvoiceStatus) {
  try {
    const invoice = await updateInvoiceStatus(id, status);
    revalidatePath('/admin/billing');
    revalidatePath(`/admin/billing/${id}`);
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/analytics');
    return { success: true, data: invoice };
  } catch (error: any) {
    console.error('updateInvoiceStatusAction error:', error);
    return { success: false, error: error.message || 'Failed to update invoice status' };
  }
}

export async function deleteInvoiceAction(id: string) {
  try {
    await deleteInvoice(id);
    revalidatePath('/admin/billing');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('deleteInvoiceAction error:', error);
    return { success: false, error: error.message || 'Failed to delete invoice' };
  }
}

export async function recordPaymentAction(payload: {
  invoice_id: string;
  amount: number;
  currency?: string;
  payment_method: string;
  payment_date?: string;
  reference?: string | null;
  notes?: string | null;
}) {
  try {
    const payment = await recordPayment(payload);
    revalidatePath('/admin/billing');
    revalidatePath(`/admin/billing/${payload.invoice_id}`);
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/analytics');
    return { success: true, data: payment };
  } catch (error: any) {
    console.error('recordPaymentAction error:', error);
    return { success: false, error: error.message || 'Failed to record payment' };
  }
}

// ============================================================================
// SYSTEM SERVER ACTIONS
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
