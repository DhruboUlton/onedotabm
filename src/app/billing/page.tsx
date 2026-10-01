import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { BillingSearch } from './BillingSearch';

export const metadata: Metadata = {
  title: 'Track Your Invoice',
  description: 'Track your invoice status and payment history.',
  robots: { index: false, follow: false },
};

export default function BillingPage() {
  return (
    <section className="py-12 sm:py-20 bg-[#F7F7F5] flex-1">
      <Container>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] mb-3">
              Track Your <span className="text-[#1400FF]">Invoice</span>
            </h1>
            <p className="text-sm text-[#555555]">
              Enter your invoice number, email address, or phone number to view your invoice.
            </p>
          </div>
          <BillingSearch />
        </div>
      </Container>
    </section>
  );
}
