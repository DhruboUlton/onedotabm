import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getQuotationByNumber } from '@/lib/services/quotationService';
import { getCompanySettings } from '@/lib/services/systemService';
import { getCurrentAdmin } from '@/lib/auth/adminAuth';
import { QuotationDocument } from '@/components/billing/QuotationDocument';
import { PrintOnLoad } from '@/components/billing/PrintOnLoad';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ number: string }>; searchParams: Promise<{ print?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return { title: `Quotation ${decodeURIComponent(number).toUpperCase()}`, robots: { index: false, follow: false } };
}

export default async function PublicQuotationPage({ params, searchParams }: Props) {
  const { number } = await params;
  const { print } = await searchParams;
  const [quotation, company, admin] = await Promise.all([
    getQuotationByNumber(decodeURIComponent(number)),
    getCompanySettings(),
    getCurrentAdmin(),
  ]);
  if (!quotation || (quotation.status === 'draft' && !admin)) notFound();

  return (
    <section className="py-10 sm:py-14 bg-[#F7F7F5] flex-1">
      {print === '1' && <PrintOnLoad />}
      <Container>
        <div className="max-w-4xl mx-auto">
          <div data-print-hide className="flex justify-end mb-6">
            <a
              href={`/quote/${quotation.quotation_number}?print=1`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1400FF] border border-[#C7D2FE] bg-white rounded-xl hover:bg-[#EEF2FF]"
            >
              <Download className="w-4 h-4" /> PDF
            </a>
          </div>
          <QuotationDocument quotation={quotation} company={company} />
        </div>
      </Container>
    </section>
  );
}
