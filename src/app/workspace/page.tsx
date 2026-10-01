import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getPortalSession } from '@/lib/auth/portalAuth';
import { getPortalIdentity, getPortalProjectIds } from '@/lib/services/portalService';
import { getProjectDetail } from '@/lib/services/projectService';
import {
  calcProgress, countDone, getDeadlineState, DEADLINE_STATE_META, projectStatusMeta,
} from '@/lib/projectMeta';
import { formatDate } from '@/lib/invoiceMeta';
import { LogoutButton } from './LogoutButton';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Client Workspace', robots: { index: false, follow: false } };

export default async function WorkspacePage() {
  const session = await getPortalSession();
  if (!session) redirect('/project-access');

  const [identity, ids] = await Promise.all([getPortalIdentity(session), getPortalProjectIds(session)]);
  if (!identity) redirect('/project-access');
  if (session.kind === 'project' && ids[0]) redirect(`/workspace/${ids[0]}`);

  const projects = (await Promise.all(ids.map((id) => getProjectDetail(id)))).filter((p) => p !== null);

  return (
    <section className="py-10 sm:py-14 bg-[#F7F7F5] flex-1">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#858585]">Client workspace</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] mt-1">Welcome, {identity.name}</h1>
              <p className="text-sm text-[#555555] mt-1">
                {projects.length} project{projects.length === 1 ? '' : 's'}
              </p>
            </div>
            <LogoutButton />
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E5E5E2]">
              <p className="text-sm text-[#858585]">No projects yet. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => {
                const all = p.services.flatMap((s) => s.deliverables);
                const progress = calcProgress(all);
                const sm = projectStatusMeta(p.status);
                const dl = DEADLINE_STATE_META[getDeadlineState(p.deadline, p.completed_at)];
                return (
                  <Link
                    key={p.id}
                    href={`/workspace/${p.id}`}
                    className="block bg-white rounded-2xl border border-[#E5E5E2] p-5 hover:border-[#1400FF]/40 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-[#111111] truncate">{p.project_name}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sm.className}`}>{sm.label}</span>
                          {p.deadline && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dl.className}`}>{dl.label}</span>
                          )}
                        </div>
                        <p className="text-xs text-[#858585]">
                          {p.deadline ? `Deadline ${formatDate(p.deadline)}` : 'No deadline set'}
                          {all.length > 0 && ` · ${countDone(all)}/${all.length} deliverables done`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {all.length > 0 && <span className="text-sm font-bold font-mono text-[#111111]">{progress}%</span>}
                        <ChevronRight className="w-4 h-4 text-[#858585] group-hover:text-[#1400FF]" />
                      </div>
                    </div>
                    {all.length > 0 && (
                      <div className="mt-3 h-1.5 bg-[#E5E5E2] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1400FF] rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
