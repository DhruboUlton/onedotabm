import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getQuotationByNumber } from '@/lib/services/quotationService';
import { getCompanySettings } from '@/lib/services/systemService';
import { getCurrentAdmin } from '@/lib/auth/adminAuth';
import { QuotationDocument } from '@/components/billing/QuotationDocument';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ number: string }>;  };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return { title: `Quotation ${decodeURIComponent(number).toUpperCase()}`, robots: { index: false, follow: false } };
}

export default async function PublicQuotationPage({ params }: Props) {
  const { number } = await params;
  const [quotation, company, admin] = await Promise.all([
    getQuotationByNumber(decodeURIComponent(number)),
    getCompanySettings(),
    getCurrentAdmin(),
  ]);
  if (!quotation || (quotation.status === 'draft' && !admin)) notFound();

  return (
    <section className="py-10 sm:py-14 bg-[#F7F7F5] flex-1">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div data-print-hide className="flex justify-end mb-6">
            <a
              href={`/quote/${quotation.quotation_number}/pdf`}
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
