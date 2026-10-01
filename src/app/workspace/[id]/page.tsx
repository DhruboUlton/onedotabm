import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Download, ExternalLink, FileText } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getPortalSession } from '@/lib/auth/portalAuth';
import { getPortalProject } from '@/lib/services/portalService';
import {
  calcProgress, countDone, getDeadlineState, DEADLINE_STATE_META, projectStatusMeta, deliverableStatusMeta,
} from '@/lib/projectMeta';
import { formatDate, formatMoney, invoiceStatusMeta } from '@/lib/invoiceMeta';
import { LogoutButton } from '../LogoutButton';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Project Dashboard', robots: { index: false, follow: false } };

export default async function PortalProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getPortalSession();
  if (!session) redirect('/project-access');
  const { id } = await params;
  const data = await getPortalProject(session, id);
  if (!data) notFound();
  const { project, invoices } = data;

  const all = project.services.flatMap((s) => s.deliverables);
  const progress = calcProgress(all);
  const sm = projectStatusMeta(project.status);
  const dl = DEADLINE_STATE_META[getDeadlineState(project.deadline, project.completed_at)];

  return (
    <section className="py-10 sm:py-14 bg-[#F7F7F5] flex-1">
      <Container>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3">
            {session.kind === 'client' ? (
              <Link href="/workspace" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#555555] hover:text-[#1400FF]">
                <ArrowLeft className="w-3.5 h-3.5" /> All projects
              </Link>
            ) : (
              <span />
            )}
            <LogoutButton />
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xs p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sm.className}`}>{sm.label}</span>
              {project.deadline && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${dl.className}`}>{dl.label}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">{project.project_name}</h1>
            {project.description && <p className="text-sm text-[#555555] mt-2 max-w-2xl whitespace-pre-line">{project.description}</p>}

            <div className="flex items-center gap-6 flex-wrap mt-4 text-xs text-[#555555]">
              {project.start_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#858585]" /> Started {formatDate(project.start_date)}
                </span>
              )}
              {project.deadline && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#858585]" /> Deadline {formatDate(project.deadline)}
                </span>
              )}
            </div>

            {all.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#555555]">Overall Progress</span>
                  <span className="text-sm font-bold font-mono text-[#111111]">
                    {progress}% · {countDone(all)}/{all.length} completed
                  </span>
                </div>
                <div className="h-2.5 bg-[#E5E5E2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1400FF] rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {invoices.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xs p-5">
              <h2 className="text-[11px] font-mono font-semibold text-[#858585] uppercase tracking-wider mb-3">Invoices</h2>
              <div className="space-y-2">
                {invoices.map((inv) => {
                  const m = invoiceStatusMeta(inv.status);
                  return (
                    <Link
                      key={inv.id}
                      href={`/billing/${inv.invoice_number}`}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#E5E5E2] hover:border-[#1400FF]/40"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-[#1400FF] shrink-0" />
                        <span className="font-mono text-sm font-semibold text-[#111111]">{inv.invoice_number}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${m.className}`}>{m.label}</span>
                      </span>
                      <span className="flex items-center gap-2 text-sm font-mono text-[#111111] shrink-0">
                        {formatMoney(inv.total, inv.currency)} <ExternalLink className="w-3.5 h-3.5 text-[#858585]" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {project.services.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-[#E5E5E2] rounded-2xl">
              <p className="text-sm text-[#858585]">Project setup in progress. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {project.services.map((svc) => (
                <div key={svc.id} className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xs overflow-hidden">
                  <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#E5E5E2] bg-[#F7F7F5]">
                    <div>
                      <h2 className="font-semibold text-[#111111] text-sm">{svc.title}</h2>
                      {svc.description && <p className="text-xs text-[#555555] mt-0.5">{svc.description}</p>}
                    </div>
                    {svc.deliverables.length > 0 && (
                      <span className="text-xs font-semibold font-mono text-[#555555]">{calcProgress(svc.deliverables)}%</span>
                    )}
                  </div>
                  {svc.deliverables.length === 0 ? (
                    <div className="px-5 py-4 text-xs text-[#858585]">Deliverables being prepared…</div>
                  ) : (
                    <div className="divide-y divide-[#E5E5E2]">
                      {svc.deliverables.map((d) => {
                        const dm = deliverableStatusMeta(d.status);
                        return (
                          <div key={d.id} className="px-5 py-3.5">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${dm.dot}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#111111]">{d.title}</p>
                                {d.type && <p className="text-xs text-[#858585]">{d.type}</p>}
                              </div>
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${dm.className}`}>{dm.label}</span>
                              {d.deadline && <span className="text-[10px] text-[#858585]">{formatDate(d.deadline)}</span>}
                            </div>
                            {d.files.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-2">
                                {d.files.map((f) => (
                                  <a
                                    key={f.id}
                                    href={f.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF2FF] border border-[#C7D2FE] text-[#1400FF] text-xs font-medium rounded-lg hover:bg-[#E0E7FF]"
                                  >
                                    <Download className="w-3 h-3" /> {f.name}
                                  </a>
                                ))}
                              </div>
                            )}
                            {d.notes && <p className="mt-2 text-xs text-[#555555] bg-[#F7F7F5] rounded-lg px-3 py-2 whitespace-pre-line">{d.notes}</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-xs text-[#858585]">
            Questions about your project?{' '}
            <Link href="/contact" className="text-[#1400FF] hover:underline font-medium">
              Contact us
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
