export type QuotationStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'cancelled' | 'converted';

/** The states offered in the editor. viewed and cancelled exist in the database but are not used. */
export const QUOTATION_STATUSES: QuotationStatus[] = ['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'];

export const QUOTATION_STATUS_META: Record<QuotationStatus, { label: string; desc: string; className: string }> = {
  draft: { label: 'Draft', desc: 'Internal draft, not yet sent to client', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  sent: { label: 'Sent', desc: 'Sent and awaiting client acceptance', className: 'bg-[#EEF2FF] text-[#1400FF] border-[#C7D2FE]' },
  viewed: { label: 'Viewed', desc: 'Client has opened the quotation', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  accepted: { label: 'Accepted', desc: 'Client approved the quotation', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Declined', desc: 'Client declined or asked for revisions', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  expired: { label: 'Expired', desc: 'Validity period has elapsed', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  cancelled: { label: 'Cancelled', desc: 'Withdrawn', className: 'bg-gray-100 text-gray-400 border-gray-200' },
  converted: { label: 'Converted', desc: 'Turned into an invoice', className: 'bg-violet-50 text-violet-700 border-violet-200' },
};

export function quotationStatusMeta(status: string) {
  return QUOTATION_STATUS_META[status as QuotationStatus] ?? QUOTATION_STATUS_META.draft;
}

/** A sent quotation past its valid-until date reads Expired without anyone saving. */
export function resolveQuotationStatus(status: string, validUntil: string | Date | null): QuotationStatus {
  if (status === 'sent' && validUntil) {
    const end = new Date(validUntil);
    end.setHours(23, 59, 59, 999);
    if (!isNaN(end.getTime()) && end < new Date()) return 'expired';
  }
  return (status as QuotationStatus) || 'draft';
}

export const PRESET_SERVICES = [
  {
    title: 'Custom Web Application',
    deliverables: 'Custom Next.js build, responsive UI, database design, API integrations, admin panel, deployment.',
    quantity: 1,
    unit_price: 60000,
  },
  {
    title: 'Performance Marketing Sprint',
    deliverables: 'Campaign strategy, audience and account targeting, ad creatives and copy, funnel setup, conversion tracking and reporting.',
    quantity: 1,
    unit_price: 30000,
  },
  {
    title: 'UI/UX Design & Prototype',
    deliverables: 'Wireframes, high-fidelity responsive design system, clickable prototype, design handoff.',
    quantity: 1,
    unit_price: 20000,
  },
  {
    title: 'Technical & CRO Audit',
    deliverables: 'Speed and Core Web Vitals audit, funnel analysis, event tracking review, prioritised roadmap.',
    quantity: 1,
    unit_price: 12000,
  },
];

export const DEFAULT_PAYMENT_TERMS = '50% upfront to start, 50% on final delivery and sign-off.';
export const DEFAULT_TERMS =
  '1. This quotation is valid until the date shown.\n2. Up to 2 revisions are included per deliverable.\n3. Third-party fees (hosting, domains, ad spend) are billed directly to the client.';
