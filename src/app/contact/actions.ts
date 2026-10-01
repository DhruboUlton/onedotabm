'use server';

// Public — intentionally not behind requireAdmin(). This is the write path
// for visitors on /contact and /start-a-project; the admin lead actions in
// src/app/admin/leads/actions.ts stay guarded.

import { createLead } from '@/lib/services/crmService';
import { logActivity } from '@/lib/services/activityService';
import { getCompanySettings } from '@/lib/services/systemService';
import { rateLimit } from '@/lib/rateLimit';
import { sendEmail, esc } from '@/lib/email';

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
  if (!(await rateLimit('inquiry', 10, 3600))) {
    return { success: false, error: 'Too many submissions. Please try again later.' };
  }

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

    // Best effort: the lead is already saved, so a failed email changes nothing for the visitor.
    try {
      const settings = await getCompanySettings();
      if (settings.notify_on_lead && settings.notify_email) {
        await sendEmail({
          to: settings.notify_email,
          subject: `New Lead: ${name.slice(0, 100)} — ${(input.serviceInterest || 'General inquiry').slice(0, 100)}`,
          html: `<h2>New inquiry — OneDot ABM</h2>
            <p><b>Name:</b> ${esc(name)}</p><p><b>Email:</b> ${esc(email)}</p>
            <p><b>Phone:</b> ${esc(phone)}</p><p><b>Business:</b> ${esc(businessName)}</p>
            <p><b>Service:</b> ${esc(input.serviceInterest) || '—'}</p><p><b>Budget:</b> ${esc(input.budgetRange) || '—'}</p>
            <p><b>Timeline:</b> ${esc(input.timeline) || '—'}</p><p><b>Message:</b> ${esc(description)}</p>`,
        });
      }
    } catch (e) {
      console.error('Lead notification failed:', e);
    }

    return { success: true };
  } catch (error) {
    console.error('Project inquiry submission failed:', error);
    return { success: false, error: 'Something went wrong on our end. Please email hello@onedotabm.com directly.' };
  }
}
