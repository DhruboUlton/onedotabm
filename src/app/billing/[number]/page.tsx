import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Download, FileX } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getInvoiceByNumber } from '@/lib/services/invoiceService';
import { getCompanySettings } from '@/lib/services/systemService';
import { getCurrentAdmin } from '@/lib/auth/adminAuth';
import { getLifecycleState } from '@/lib/invoiceMeta';
import { InvoiceDocument } from '@/components/billing/InvoiceDocument';
import { PrintOnLoad } from '@/components/billing/PrintOnLoad';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ print?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return { title: `Invoice ${decodeURIComponent(number).toUpperCase()}`, robots: { index: false, follow: false } };
}

export default async function PublicInvoicePage({ params, searchParams }: Props) {
  const { number } = await params;
  const { print } = await searchParams;
  const [invoice, company, admin] = await Promise.all([
    getInvoiceByNumber(decodeURIComponent(number)),
    getCompanySettings(),
    getCurrentAdmin(),
  ]);
  if (!invoice) notFound();

  // The admin always sees the whole thing; clients get the lifecycle rules.
  const state = admin ? 'active' : getLifecycleState(invoice);
  if (state === 'draft') notFound();
  const wantsPrint = print === '1' && state !== 'expired';

  return (
    <section className="py-10 sm:py-14 bg-[#F7F7F5] flex-1">
      {wantsPrint && <PrintOnLoad />}
      <Container>
        <div className="max-w-4xl mx-auto">
          <div data-print-hide className="flex items-center justify-between gap-3 mb-6">
            <Link href="/billing" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#555555] hover:text-[#1400FF]">
              <ArrowLeft className="w-3.5 h-3.5" /> Find another invoice
            </Link>
            {state !== 'expired' && (
              <a
                href={`/billing/${invoice.invoice_number}?print=1`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1400FF] border border-[#C7D2FE] bg-white rounded-xl hover:bg-[#EEF2FF]"
              >
                <Download className="w-4 h-4" /> PDF
              </a>
            )}
          </div>

          {state === 'expired' ? (
            <div className="max-w-lg mx-auto py-16 text-center">
              <FileX className="w-12 h-12 text-rose-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#111111] mb-2">Invoice Access Expired</h1>
              <p className="text-sm text-[#555555] mb-6">
                This invoice is no longer publicly accessible. Contact {company.company_name} for details.
              </p>
              <p className="text-xs text-[#858585] font-mono">{invoice.invoice_number}</p>
            </div>
          ) : (
            <>
              {state === 'pdf_only' && !wantsPrint && (
                <div data-print-hide className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Full invoice access has expired. PDF download is available for a limited time.
                  </p>
                </div>
              )}
              <InvoiceDocument invoice={invoice} company={company} showFull={state === 'active' || wantsPrint} />
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
