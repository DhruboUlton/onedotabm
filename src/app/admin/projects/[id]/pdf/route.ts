import { getCurrentAdmin } from '@/lib/auth/adminAuth';
import { getProjectDetail } from '@/lib/services/projectService';
import { getInvoiceByNumber } from '@/lib/services/invoiceService';
import { getCompanySettings } from '@/lib/services/systemService';
import { renderProjectPdf, pdfResponse } from '@/lib/pdf/documents';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentAdmin())) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const project = await getProjectDetail(id);
  if (!project) return new Response('Not found', { status: 404 });
  const [invoice, company] = await Promise.all([
    project.invoice_number ? getInvoiceByNumber(project.invoice_number) : null,
    getCompanySettings(),
  ]);
  const slug = project.project_name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'project';
  return pdfResponse(await renderProjectPdf(project, invoice, company), `project-${slug}.pdf`);
}
