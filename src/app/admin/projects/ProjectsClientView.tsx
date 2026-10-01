'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, ChevronRight, Copy, Loader2, Plus, RefreshCw, Search } from 'lucide-react';
import type { ProjectSummary } from '@/lib/services/projectService';
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
  projectStatusMeta,
  calcProgress,
  countDone,
  getDeadlineState,
  DEADLINE_STATE_META,
} from '@/lib/projectMeta';
import { duplicateProjectAction } from './actions';

export function ProjectsClientView({
  projects,
  status,
  query,
}: {
  projects: ProjectSummary[];
  status: string;
  query: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(query);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function load(nextStatus: string, nextQuery: string) {
    const p = new URLSearchParams();
    if (nextStatus !== 'all') p.set('status', nextStatus);
    if (nextQuery.trim()) p.set('q', nextQuery.trim());
    startTransition(() => router.push(`/admin/projects${p.size ? `?${p}` : ''}`));
  }

  async function duplicate(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setDuplicating(id);
    const res = await duplicateProjectAction(id);
    setDuplicating(null);
    if (res.success && res.data) router.push(`/admin/projects/${res.data.id}`);
    else alert(res.error || 'Failed to duplicate project');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Projects</h1>
          <p className="text-sm text-[#858585] mt-1">Client project tracking</p>
        </div>
        <button
          onClick={() => router.push('/admin/projects/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(status, search);
          }}
          className="flex gap-2 flex-1"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, client name, email…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] transition-colors"
            />
          </div>
          <button
            type="submit"
            aria-label="Search"
            className="px-3.5 py-2 rounded-lg bg-[#1400FF] text-white hover:bg-[#0F00CC] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setSearch('');
              load(status, '');
            }}
            className="px-3.5 py-2 rounded-lg border border-[#E5E5E2] bg-white text-[#555555] hover:bg-[#F7F7F5] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', ...PROJECT_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => load(s, search)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                status === s
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F0F0ED] text-[#666666] hover:bg-[#E5E5E2] hover:text-[#111111]'
              }`}
            >
              {s === 'all' ? 'All' : PROJECT_STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#E5E5E2]">
          <Briefcase className="w-10 h-10 text-[#E5E5E2] mx-auto mb-3" />
          <p className="text-sm text-[#858585]">No projects found</p>
          <button
            onClick={() => router.push('/admin/projects/new')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC]"
          >
            <Plus className="w-4 h-4" /> Create first project
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {projects.map((p) => {
            const statuses = p.deliverable_statuses.map((s) => ({ status: s }));
            const progress = calcProgress(statuses);
            const sm = projectStatusMeta(p.status);
            const dl = DEADLINE_STATE_META[getDeadlineState(p.deadline, p.completed_at)];

            return (
              <div
                key={p.id}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/admin/projects/${p.id}`)}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/admin/projects/${p.id}`)}
                className="w-full text-left bg-white rounded-xl border border-[#E5E5E2] p-5 hover:border-[#1400FF]/40 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-[#111111] text-sm truncate">{p.project_name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sm.className}`}>
                        {sm.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#858585] truncate">
                      {[p.client_name, p.business_name, p.client_email].filter(Boolean).join(' · ') || 'No client'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {statuses.length > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#111111] font-mono">{progress}%</div>
                        <div className="text-[10px] text-[#858585] font-mono">
                          {countDone(statuses)}/{statuses.length}
                        </div>
                      </div>
                    )}
                    {p.deadline && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dl.className}`}>
                        {dl.label}
                      </span>
                    )}
                    <button
                      onClick={(e) => duplicate(e, p.id)}
                      title="Duplicate project"
                      className="p-1.5 rounded-lg text-[#858585] hover:text-[#1400FF] hover:bg-[#EEF2FF] transition-colors"
                    >
                      {duplicating === p.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#858585] group-hover:text-[#1400FF] transition-colors" />
                  </div>
                </div>

                {statuses.length > 0 && (
                  <div className="mt-3 h-1.5 bg-[#E5E5E2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1400FF] rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
