// Invoice arithmetic, status and public-link rules, shared by the admin, the
// public invoice page and the client portal.

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
export type DiscountType = 'none' | 'percent' | 'fixed';
export type LifecycleState = 'active' | 'pdf_only' | 'expired' | 'draft';

export const INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled'];
export const CURRENCIES = ['BDT', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'AED'];

export const INVOICE_STATUS_META: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  sent: { label: 'Sent', className: 'bg-[#EEF2FF] text-[#1400FF] border-[#C7D2FE]' },
  partially_paid: { label: 'Partial', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  paid: { label: 'Paid', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  overdue: { label: 'Overdue', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-400 border-gray-200' },
};

export function invoiceStatusMeta(status: string) {
  return INVOICE_STATUS_META[status as InvoiceStatus] ?? INVOICE_STATUS_META.draft;
}

export interface Totals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeTotals(
  items: { quantity: number; unit_price: number }[],
  discountType: string,
  discountValue: number,
  taxRate: number
): Totals {
  const subtotal = round2(items.reduce((s, i) => s + i.quantity * i.unit_price, 0));
  let discountAmount = 0;
  if (discountType === 'percent') discountAmount = round2((subtotal * discountValue) / 100);
  else if (discountType === 'fixed') discountAmount = Math.min(discountValue, subtotal);
  const taxAmount = round2(((subtotal - discountAmount) * taxRate) / 100);
  const total = Math.max(0, round2(subtotal - discountAmount + taxAmount));
  return { subtotal, discountAmount, taxAmount, total };
}

/**
 * The status an invoice is really in. Draft and cancelled are only ever set by
 * hand; everything else follows from what has been paid and the due date, so
 * an unpaid invoice turns overdue on its own once the due date passes, and
 * removing every payment takes it back to sent.
 */
export function resolveInvoiceStatus(
  stored: string,
  total: number,
  paid: number,
  dueDate: string | Date
): InvoiceStatus {
  if (stored === 'draft' || stored === 'cancelled') return stored;
  if (total > 0 && paid >= total - 0.005) return 'paid';
  if (paid > 0) return 'partially_paid';
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);
  if (due < new Date()) return 'overdue';
  return 'sent';
}

/**
 * How much of the public invoice page a client still gets. Full access lasts
 * 3 days after the invoice is paid, then the PDF alone until day 10. The admin
 * can push either window out with access_expires_at / pdf_expires_at.
 */
export function getLifecycleState(inv: {
  status: string;
  fully_paid_at: string | null;
  access_expires_at: string | null;
  pdf_expires_at: string | null;
}): LifecycleState {
  if (inv.status === 'draft') return 'draft';
  if (inv.status === 'cancelled') return 'expired';
  const now = new Date();
  const endOf = (d: string) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };
  if (inv.access_expires_at && endOf(inv.access_expires_at) > now) return 'active';
  if (inv.status !== 'paid' || !inv.fully_paid_at) return 'active';
  const days = (now.getTime() - new Date(inv.fully_paid_at).getTime()) / 86_400_000;
  if (days <= 3) return 'active';
  if (inv.pdf_expires_at && endOf(inv.pdf_expires_at) > now) return 'pdf_only';
  if (days <= 10) return 'pdf_only';
  return 'expired';
}

export function formatMoney(amount: number, currency = 'BDT'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(Number(amount) || 0)
      .replace(/^([A-Z]{3})\s*/, '$1 ');
  } catch {
    return `${currency} ${(Number(amount) || 0).toFixed(2)}`;
  }
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * The invoice number is also the key to its public page, so it is random, not
 * sequential: PREFIX-YY-XXXXXXX from a 32-letter alphabet without 0/O/1/I.
 */
export function generateDocumentNumber(prefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  let rand = '';
  for (const b of bytes) rand += chars[b % chars.length];
  const yy = String(new Date().getFullYear()).slice(-2);
  return `${prefix.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'INV'}-${yy}-${rand}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function plusDaysISO(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}
