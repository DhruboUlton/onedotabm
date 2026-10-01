import { getQuotationByNumber } from '@/lib/services/quotationService';
import { getCompanySettings } from '@/lib/services/systemService';
import { getCurrentAdmin } from '@/lib/auth/adminAuth';
import { renderQuotationPdf, pdfResponse } from '@/lib/pdf/documents';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const [quotation, company, admin] = await Promise.all([
    getQuotationByNumber(decodeURIComponent(number)),
    getCompanySettings(),
    getCurrentAdmin(),
  ]);
  if (!quotation || (quotation.status === 'draft' && !admin)) return new Response('Not found', { status: 404 });
  return pdfResponse(await renderQuotationPdf(quotation, company), `quotation-${quotation.quotation_number}.pdf`);
}
