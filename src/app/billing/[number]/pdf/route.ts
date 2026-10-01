import { getInvoiceByNumber } from '@/lib/services/invoiceService';
import { getCompanySettings } from '@/lib/services/systemService';
import { getCurrentAdmin } from '@/lib/auth/adminAuth';
import { getLifecycleState } from '@/lib/invoiceMeta';
import { renderInvoicePdf, pdfResponse } from '@/lib/pdf/documents';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const [invoice, company, admin] = await Promise.all([
    getInvoiceByNumber(decodeURIComponent(number)),
    getCompanySettings(),
    getCurrentAdmin(),
  ]);
  // Same rules as the public page: the admin sees everything, clients only live invoices.
  if (!invoice) return new Response('Not found', { status: 404 });
  const state = admin ? 'active' : getLifecycleState(invoice);
  if (state === 'draft') return new Response('Not found', { status: 404 });
  if (state === 'expired') return new Response('This invoice is no longer available', { status: 410 });
  return pdfResponse(await renderInvoicePdf(invoice, company), `invoice-${invoice.invoice_number}.pdf`);
}
