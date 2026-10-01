'use client';

import React, { useState } from 'react';
import { Code2, Loader2, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { TrackingScript } from '@/lib/services/trackingService';
import { saveTrackingScriptAction, deleteTrackingScriptAction } from './actions';

const PLACEMENT_LABEL = { head: 'Head', body_start: 'Body start', body_end: 'Body end' } as const;
const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]';

type Draft = Omit<TrackingScript, 'id'> & { id: string | null };
const blank: Draft = { id: null, name: '', description: '', code: '', placement: 'head', enabled: true };

export function TrackingScriptsPanel({ initial }: { initial: TrackingScript[] }) {
  const [scripts, setScripts] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(d: Draft) {
    setSaving(true);
    const res = await saveTrackingScriptAction(d.id, d);
    setSaving(false);
    if (!res.success || !res.data) {
      alert(res.error || 'Failed to save script.');
      return false;
    }
    const saved = res.data;
    setScripts((prev) => (d.id ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved]));
    return true;
  }

  async function remove(s: TrackingScript) {
    if (!confirm(`Delete "${s.name}"? It stops loading on the public site.`)) return;
    const res = await deleteTrackingScriptAction(s.id);
    if (res.success) setScripts((prev) => prev.filter((x) => x.id !== s.id));
    else alert(res.error || 'Failed to delete script.');
  }

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">Tracking Scripts</h2>
          <p className="text-xs text-[#555555] mt-0.5">Paste Google Tag Manager, a pixel, or any snippet, and choose where it loads on the public site.</p>
        </div>
        <button
          onClick={() => setDraft({ ...blank })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC]"
        >
          <Plus className="w-4 h-4" /> Add Script
        </button>
      </div>

      {draft && (
        <div className="bg-white border border-[#E5E5E2] rounded-xl p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name (e.g. Google Tag Manager)" className={inputCls} />
            <select value={draft.placement} onChange={(e) => setDraft({ ...draft, placement: e.target.value as Draft['placement'] })} className={inputCls}>
              {Object.entries(PLACEMENT_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Description (optional)" className={inputCls} />
          </div>
          <textarea
            value={draft.code}
            onChange={(e) => setDraft({ ...draft, code: e.target.value })}
            rows={6}
            placeholder="<script>…</script>"
            className={`${inputCls} font-mono text-xs`}
          />
          <p className="text-[11px] text-[#858585]">
            Head accepts script tags or bare JavaScript. Use Body start / Body end for markup such as a GTM &lt;noscript&gt; fallback.
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDraft(null)} className="px-4 py-2 text-sm text-[#555555] border border-[#E5E5E2] rounded-lg">
              Cancel
            </button>
            <button
              onClick={async () => (await save(draft)) && setDraft(null)}
              disabled={saving || !draft.name.trim() || !draft.code.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#1400FF] text-white rounded-lg disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
            </button>
          </div>
        </div>
      )}

      {scripts.length === 0 && !draft ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-[#E5E5E2] text-sm text-[#858585]">
          <Code2 className="w-8 h-8 mx-auto mb-2 opacity-30" /> No tracking scripts yet.
        </div>
      ) : (
        <div className="space-y-2">
          {scripts.map((s) => (
            <div key={s.id} className="bg-white border border-[#E5E5E2] rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[#111111]">{s.name}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#F0F0ED] text-[#555555]">{PLACEMENT_LABEL[s.placement]}</span>
                </div>
                {s.description && <p className="text-xs text-[#555555] mt-0.5">{s.description}</p>}
                <pre className="mt-2 text-[11px] text-[#858585] font-mono whitespace-pre-wrap break-all line-clamp-3">{s.code}</pre>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setDraft({ ...s })}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#E5E5E2] text-[#555555] hover:text-[#1400FF]"
                >
                  Edit
                </button>
                <button
                  onClick={() => save({ ...s, enabled: !s.enabled })}
                  aria-label={s.enabled ? 'Disable' : 'Enable'}
                  title={s.enabled ? 'Enabled — click to disable' : 'Disabled — click to enable'}
                  className="text-[#1400FF]"
                >
                  {s.enabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-[#858585]" />}
                </button>
                <button onClick={() => remove(s)} title="Delete" className="p-1.5 text-[#858585] hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
