'use client';

import React, { Fragment, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MessageCircle,
  Star,
  Trash2,
  Upload,
  Users2,
} from 'lucide-react';
import type { OutreachProspect } from '@/lib/services/outreachService';
import { csvToProspectRows } from '@/lib/csv';
import { FOLLOWUP_STAGES, computeReminders, getOutreachDate, getStageStatus } from '@/lib/followups';
import {
  importProspectsAction,
  updateProspectAction,
  deleteProspectsAction,
} from './actions';

const STATUSES = ['new', 'contacted', 'replied', 'converted', 'not_interested'] as const;

const STATUS_CLASS: Record<string, string> = {
  new: 'text-sky-700 bg-sky-50 border-sky-200',
  contacted: 'text-amber-700 bg-amber-50 border-amber-200',
  replied: 'text-[#1400FF] bg-[#EEF2FF] border-[#C7D2FE]',
  converted: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  not_interested: 'text-rose-700 bg-rose-50 border-rose-200',
};

const label = (s: string) => s.replace('_', ' ').replace(/^./, (c) => c.toUpperCase());

const pill = (active: boolean) =>
  `text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
    active ? 'bg-[#111111] text-white border-[#111111]' : 'text-[#555555] border-[#E5E5E2] bg-white hover:border-[#111111]'
  }`;

// Which checkbox maps to which patch field.
const FOLLOWUP_PATCH = ['followUp1', 'followUp2', 'followUp3', 'followUp4'] as const;

export function ProspectsView({ initial }: { initial: OutreachProspect[] }) {
  const [prospects, setProspects] = useState(initial);
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [noEmailOnly, setNoEmailOnly] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [pendingRows, setPendingRows] = useState<Record<string, string>[] | null>(null);
  const [pendingBatch, setPendingBatch] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingRows(csvToProspectRows(String(reader.result || '')));
      setPendingBatch(file.name.replace(/\.csv$/i, '').slice(0, 100));
      setImportError(null);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function confirmImport() {
    if (!pendingRows?.length) return;
    setImporting(true);
    setImportError(null);
    const res = await importProspectsAction(pendingRows, pendingBatch);
    setImporting(false);
    if (!res.success) {
      setImportError(res.error || 'Import failed');
      return;
    }
    setPendingRows(null);
    setPendingBatch('');
    window.location.reload(); // new rows arrive with server-made ids and timestamps
  }

  // Optimistic: the row updates now and rolls back if the server refuses.
  async function patch(id: string, local: Partial<OutreachProspect>, remote: Parameters<typeof updateProspectAction>[1]) {
    const before = prospects;
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, ...local } : p)));
    const res = await updateProspectAction(id, remote);
    if (!res.success) {
      setProspects(before);
      alert(res.error || 'Failed to update prospect.');
    }
  }

  const stamp = (on: boolean) => (on ? new Date().toISOString() : null);

  async function remove(by: { ids?: string[]; batch?: string }, confirmText: string) {
    if (!confirm(confirmText)) return;
    const before = prospects;
    const beforeSel = selected;
    setProspects((prev) => prev.filter((p) => !(by.batch ? p.batch === by.batch : by.ids?.includes(p.id))));
    setSelected(new Set());
    if (by.batch && batchFilter === by.batch) setBatchFilter('ALL');
    const res = await deleteProspectsAction(by);
    if (!res.success) {
      setProspects(before);
      setSelected(beforeSel);
      alert(res.error || 'Failed to delete.');
    }
  }

  const batches = useMemo(() => Array.from(new Set(prospects.map((p) => p.batch).filter(Boolean))).sort(), [prospects]);
  const visible = prospects.filter(
    (p) =>
      (batchFilter === 'ALL' || p.batch === batchFilter) &&
      (statusFilter === 'ALL' || p.status === statusFilter) &&
      (!noEmailOnly || p.email.trim() === '')
  );
  const noEmailCount = prospects.filter((p) => p.email.trim() === '').length;
  const reminders = useMemo(() => computeReminders(prospects), [prospects]);
  const allVisibleSelected = visible.length > 0 && visible.every((p) => selected.has(p.id));

  function toggleAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const p of visible) {
        if (allVisibleSelected) next.delete(p.id);
        else next.add(p.id);
      }
      return next;
    });
  }

  const social = (p: OutreachProspect) =>
    [
      ['Facebook', p.facebook], ['Instagram', p.instagram], ['LinkedIn', p.linkedin],
      ['YouTube', p.youtube], ['X/Twitter', p.twitter], ['TikTok', p.tiktok],
    ].filter(([, url]) => url);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Prospects</h1>
          <p className="text-sm text-[#858585] mt-1">
            {prospects.length} total · {prospects.filter((p) => p.email_sent_at).length} emailed ·{' '}
            {prospects.filter((p) => p.dm_sent_at).length} DM&apos;d · {prospects.filter((p) => p.status === 'converted').length} converted
          </p>
        </div>
        <div>
          <input ref={fileInput} type="file" accept=".csv" onChange={onFile} className="hidden" />
          <button
            onClick={() => fileInput.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] shadow-sm"
          >
            <Upload className="w-4 h-4" /> Upload CSV
          </button>
        </div>
      </div>

      {pendingRows && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E2] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-[#111111] mb-1">Import {pendingRows.length} prospects</h2>
            <p className="text-xs text-[#858585] mb-4">Give this batch a label so you can filter and manage it later.</p>
            <label className="text-[11px] font-mono font-semibold text-[#858585] uppercase tracking-wider">Batch Label</label>
            <input
              value={pendingBatch}
              onChange={(e) => setPendingBatch(e.target.value)}
              placeholder="e.g. salon_boston"
              className="w-full mt-1.5 mb-5 px-3 py-2 text-sm border border-[#E5E5E2] rounded-lg bg-[#F7F7F5] focus:outline-none focus:border-[#1400FF]"
            />
            {importError && <div className="mb-4 px-3 py-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">{importError}</div>}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setPendingRows(null);
                  setPendingBatch('');
                  setImportError(null);
                }}
                className="px-4 py-2 text-sm text-[#555555] hover:text-[#111111] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                disabled={importing || pendingRows.length === 0}
                className="px-4 py-2 text-sm bg-[#1400FF] hover:bg-[#0F00CC] text-white rounded-lg font-medium disabled:opacity-50"
              >
                {importing ? 'Importing…' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#E5E5E2] rounded-xl shadow-xs p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-[#1400FF]" />
          <h2 className="text-sm font-bold text-[#111111]">Follow-Up Reminders &amp; Tracking</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          <div className="bg-[#F7F7F5] rounded-xl px-3 py-2.5 text-center">
            <div className="text-lg font-bold text-[#111111]">{prospects.filter((p) => getOutreachDate(p)).length}</div>
            <div className="text-[10px] text-[#858585] uppercase tracking-wide">Outreached</div>
          </div>
          {FOLLOWUP_STAGES.map((stage) => (
            <div key={stage.key} className="bg-[#F7F7F5] rounded-xl px-3 py-2.5 text-center">
              <div className="text-lg font-bold text-[#111111]">{prospects.filter((p) => p[stage.key]).length}</div>
              <div className="text-[10px] text-[#858585] uppercase tracking-wide">{stage.shortLabel} Done</div>
            </div>
          ))}
        </div>

        {reminders.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-[#858585] py-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All caught up — no follow-ups due right now.
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
            {reminders.map(({ p, stage, status, days }) => (
              <div
                key={`${p.id}-${stage.key}`}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border ${
                  status === 'overdue' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {status === 'overdue' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                  <span className="text-sm text-[#111111] font-medium truncate">{p.business_name}</span>
                  <span className="text-xs text-[#555555] shrink-0">
                    {stage.label} · day {days}
                    {status === 'overdue' ? ` (${days - stage.endDay}d overdue)` : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const i = FOLLOWUP_STAGES.indexOf(stage);
                    patch(p.id, { [stage.key]: stamp(true) }, { [FOLLOWUP_PATCH[i]]: true });
                  }}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#1400FF] hover:bg-[#0F00CC] text-white shrink-0"
                >
                  Mark Done
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setBatchFilter('ALL')} className={pill(batchFilter === 'ALL')}>
            All Batches
          </button>
          {batches.map((b) => (
            <button key={b} onClick={() => setBatchFilter(b)} className={pill(batchFilter === b)}>
              {b} ({prospects.filter((p) => p.batch === b).length})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {['ALL', ...STATUSES].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={pill(statusFilter === s)}>
                {s === 'ALL' ? 'All' : label(s)}
                {s !== 'ALL' && ` (${prospects.filter((p) => p.status === s).length})`}
              </button>
            ))}
            <button
              onClick={() => setNoEmailOnly((v) => !v)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                noEmailOnly ? 'bg-rose-600 text-white border-rose-600' : 'text-rose-600 border-rose-200 bg-white hover:border-rose-600'
              }`}
            >
              No Email ({noEmailCount})
            </button>
          </div>
          {batchFilter !== 'ALL' && (
            <button
              onClick={() =>
                remove({ batch: batchFilter }, `Delete all ${prospects.filter((p) => p.batch === batchFilter).length} prospects in batch "${batchFilter}"?`)
              }
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete batch &quot;{batchFilter}&quot;
            </button>
          )}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center justify-between gap-3 px-5 py-3 rounded-xl bg-rose-50 border border-rose-200">
          <span className="text-sm text-[#111111] font-medium">{selected.size} selected</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(new Set())} className="text-xs text-[#555555] hover:text-[#111111]">
              Clear
            </button>
            <button
              onClick={() => remove({ ids: [...selected] }, `Delete ${selected.size} selected prospect${selected.size !== 1 ? 's' : ''}?`)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="border border-[#E5E5E2] rounded-xl overflow-x-auto bg-white shadow-xs">
        {visible.length === 0 ? (
          <div className="py-20 text-center">
            <Users2 className="w-8 h-8 text-[#D4D4D0] mx-auto mb-3" />
            <p className="text-sm text-[#858585]">No prospects yet.</p>
            <p className="text-xs text-[#858585] mt-1">Upload a CSV to start tracking outreach.</p>
          </div>
        ) : (
          <table className="w-full min-w-[920px] text-left">
            <thead>
              <tr className="border-b border-[#E5E5E2] bg-[#F7F7F5] text-[11px] font-mono uppercase text-[#858585] tracking-wider">
                <th className="px-5 py-3 w-10">
                  <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} aria-label="Select all" className="accent-[#1400FF]" />
                </th>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Outreach</th>
                <th className="px-3 py-3 text-center">Outreached</th>
                {FOLLOWUP_STAGES.map((s) => (
                  <th key={s.key} className="px-3 py-3 text-center whitespace-nowrap">
                    {s.shortLabel}
                  </th>
                ))}
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const outreach = getOutreachDate(p);
                return (
                  <Fragment key={p.id}>
                    <tr
                      className="border-b border-[#F0F0ED] hover:bg-[#F9F9F8] cursor-pointer"
                      onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    >
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() =>
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (!next.delete(p.id)) next.add(p.id);
                              return next;
                            })
                          }
                          aria-label={`Select ${p.business_name}`}
                          className="accent-[#1400FF]"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-[#111111]">{p.business_name}</div>
                        <div className="text-xs text-[#858585]">
                          {p.city}
                          {p.category && ` · ${p.category}`}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#555555]">
                        {p.google_rating ? (
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {p.google_rating}
                            <span className="text-xs text-[#858585]">({p.google_review_count})</span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-1.5 text-xs text-[#555555] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!p.email_sent_at}
                              onChange={(e) => patch(p.id, { email_sent_at: stamp(e.target.checked) }, { emailSent: e.target.checked })}
                              className="accent-[#1400FF]"
                            />
                            <Mail className="w-3.5 h-3.5" /> Email
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-[#555555] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!p.dm_sent_at}
                              onChange={(e) => patch(p.id, { dm_sent_at: stamp(e.target.checked) }, { dmSent: e.target.checked })}
                              className="accent-[#1400FF]"
                            />
                            <MessageCircle className="w-3.5 h-3.5" /> DM
                          </label>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        {outreach ? (
                          <span title={outreach.toLocaleDateString()}>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                          </span>
                        ) : (
                          <span className="text-xs text-[#858585]">—</span>
                        )}
                      </td>
                      {FOLLOWUP_STAGES.map((stage, i) => {
                        const st = getStageStatus(p, stage);
                        const ring = st === 'overdue' ? 'ring-1 ring-rose-300 rounded-lg' : st === 'due' ? 'ring-1 ring-amber-300 rounded-lg' : '';
                        return (
                          <td key={stage.key} className="px-3 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <span className={`inline-flex p-1 ${ring}`} title={`${stage.label} (day ${stage.startDay}-${stage.endDay})`}>
                              <input
                                type="checkbox"
                                checked={!!p[stage.key]}
                                disabled={st === 'no-outreach'}
                                onChange={(e) => patch(p.id, { [stage.key]: stamp(e.target.checked) }, { [FOLLOWUP_PATCH[i]]: e.target.checked })}
                                aria-label={stage.label}
                                className="accent-[#1400FF] disabled:opacity-30 disabled:cursor-not-allowed"
                              />
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={p.status}
                          onChange={(e) => patch(p.id, { status: e.target.value }, { status: e.target.value })}
                          className={`text-xs font-medium px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${STATUS_CLASS[p.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {label(s)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => remove({ ids: [p.id] }, 'Delete this prospect?')}
                          title="Delete prospect"
                          className="text-[#858585] hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {expanded === p.id && (
                      <tr className="bg-[#F7F7F5] border-b border-[#E5E5E2]">
                        <td colSpan={11} className="px-5 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-[10px] text-[#858585] uppercase tracking-wide mb-1">Contact</p>
                              <div className="flex flex-col gap-1">
                                {p.email && (
                                  <a href={`mailto:${p.email}`} className="text-[#1400FF] hover:underline flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" /> {p.email}
                                  </a>
                                )}
                                {p.phone && (
                                  <a href={`tel:${p.phone}`} className="text-[#555555]">
                                    {p.phone}
                                  </a>
                                )}
                                {p.website && /^https?:\/\//i.test(p.website) && (
                                  <a href={p.website} target="_blank" rel="noreferrer" className="text-[#555555] hover:text-[#1400FF] flex items-center gap-1.5">
                                    <ExternalLink className="w-3.5 h-3.5" /> Website
                                  </a>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] text-[#858585] uppercase tracking-wide mb-1">Social</p>
                              <div className="flex items-center gap-3 flex-wrap">
                                {social(p).map(([name, url]) =>
                                  /^https?:\/\//i.test(url) ? (
                                    <a key={name} href={url} target="_blank" rel="noreferrer" className="text-xs text-[#555555] hover:text-[#1400FF] flex items-center gap-1">
                                      <ExternalLink className="w-3 h-3" /> {name}
                                    </a>
                                  ) : null
                                )}
                                {social(p).length === 0 && <span className="text-xs text-[#858585]">—</span>}
                              </div>
                            </div>
                            {p.owner_name && (
                              <div>
                                <p className="text-[10px] text-[#858585] uppercase tracking-wide mb-0.5">Owner</p>
                                <p className="text-[#111111]">{p.owner_name}</p>
                              </div>
                            )}
                          </div>
                          <label className="text-[10px] text-[#858585] uppercase tracking-wide mb-1 block">Notes</label>
                          <textarea
                            defaultValue={p.notes}
                            onBlur={(e) => {
                              if (e.target.value !== p.notes) patch(p.id, { notes: e.target.value }, { notes: e.target.value });
                            }}
                            placeholder="Add outreach notes…"
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-[#E5E5E2] rounded-lg bg-white focus:outline-none focus:border-[#1400FF] resize-none"
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
