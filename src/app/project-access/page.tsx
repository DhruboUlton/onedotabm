import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getPortalSession } from '@/lib/auth/portalAuth';
import { Container } from '@/components/ui/Container';
import { PortalLoginForm } from './PortalLoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Client Project Access',
  description: 'Secure workspace portal for active OneDot ABM clients.',
  robots: { index: false, follow: false },
};

export default async function ProjectAccessPage() {
  if (await getPortalSession()) redirect('/workspace');
  return (
    <section className="py-12 sm:py-20 bg-[#F7F7F5] flex-1">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] mb-3">
              Track Your <span className="text-[#1400FF]">Project</span>
            </h1>
            <p className="text-sm text-[#555555]">Access your project workspace, track deliverables, and view progress.</p>
          </div>
          <PortalLoginForm />
        </div>
      </Container>
    </section>
  );
}
