'use server';

// Public — intentionally not behind requireAdmin(). This is the write path
// for visitors on /contact and /start-a-project; the admin lead actions in
// src/app/admin/leads/actions.ts stay guarded.

import { createLead } from '@/lib/services/crmService';
import { logActivity } from '@/lib/services/activityService';

export interface SubmitInquiryInput {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  existingWebsite: string;
  serviceInterest: string;
  industry: string;
  budgetRange: string;
  timeline: string;
  description: string;
}

export interface SubmitInquiryResult {
  success: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitProjectInquiryAction(
  input: SubmitInquiryInput
): Promise<SubmitInquiryResult> {
  const name = input.name?.trim();
  const businessName = input.businessName?.trim();
  const email = input.email?.trim();
  const phone = input.phone?.trim();
  const description = input.description?.trim();

  if (!name || !businessName || !email || !phone || !description) {
    return { success: false, error: 'Please fill in all required fields.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    const lead = await createLead({
      name,
      company: businessName,
      email,
      phone,
      website: input.existingWebsite?.trim() || undefined,
      service_interested: input.serviceInterest || undefined,
      lead_source: 'website',
      budget: input.budgetRange || undefined,
      message: `Industry: ${input.industry || 'n/a'} | Timeline: ${input.timeline || 'n/a'}\n\n${description}`,
      status: 'new',
      priority: 'medium',
      tags: ['inquiry-form'],
    });

    await logActivity({
      actorName: 'Website Inquiry Form',
      action: 'lead.created',
      entityType: 'lead',
      entityId: lead.id,
      entityTitle: `New inquiry from ${name} (${businessName})`,
      metadata: { source: 'contact-form', email, serviceInterest: input.serviceInterest },
    });

    return { success: true };
  } catch (error) {
    console.error('Project inquiry submission failed:', error);
    return { success: false, error: 'Something went wrong on our end. Please email hello@onedotabm.com directly.' };
  }
}
