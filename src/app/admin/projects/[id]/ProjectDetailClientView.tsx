'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Paperclip,
  Plus,
  Save,
  ScrollText,
  Trash2,
  X,
} from 'lucide-react';
import type {
  ProjectDetail,
  ServiceRecord,
  DeliverableRecord,
  DeliverableFileRecord,
  ProjectClientRecord,
  ProjectTemplateRecord,
} from '@/lib/services/projectService';
import type { ClientOption } from '@/lib/services/operationsService';
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
  ProjectStatus,
  DELIVERABLE_STATUSES,
  DELIVERABLE_STATUS_META,
  deliverableStatusMeta,
  calcProgress,
  countDone,
  getDeadlineState,
  DEADLINE_STATE_META,
} from '@/lib/projectMeta';
import { uploadFile } from '@/lib/upload';
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  addProjectClientAction,
  removeProjectClientAction,
  setProjectClientBusinessAction,
  createServiceAction,
  updateServiceTitleAction,
  deleteServiceAction,
  createDeliverableAction,
  updateDeliverableAction,
  deleteDeliverableAction,
  addDeliverableFileAction,
  deleteDeliverableFileAction,
  applyTemplateAction,
  saveTemplateAction,
} from '../actions';

const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-[#E5E5E2] bg-white text-[#111111] focus:outline-none focus:border-[#1400FF] transition-colors';
const textareaCls = `${inputCls} resize-none`;
const cardCls = 'bg-white rounded-xl border border-[#E5E5E2] shadow-xs p-5';
const headingCls = 'text-[11px] font-mono font-semibold text-[#858585] uppercase tracking-wider mb-4';
const labelCls = 'block text-[10px] font-mono font-semibold text-[#858585] uppercase tracking-wider mb-1.5';

/** Runs `fn` 600ms after the last call, so typing saves once, not per keystroke. */
function useDebounced() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return (fn: () => void) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, 600);
  };
}

function matchClients(clients: ClientOption[], q: string): ClientOption[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return clients
    .filter((c) =>
      [c.contact_person, c.email, c.phone ?? '', ...c.businesses.map((b) => b.name)].some((v) =>
        v.toLowerCase().includes(needle)
      )
    )
    .slice(0, 8);
}

// ─── Client search box ──────────────────────────────────────────────────────

function ClientSearch({
  clients,
  onPick,
  onCancel,
  placeholder = 'Search clients by name or email…',
}: {
  clients: ClientOption[];
  onPick: (c: ClientOption) => void;
  onCancel?: () => void;
  placeholder?: string;
}) {
  const [search, setSearch] = useState('');
  const results = matchClients(clients, search);

  return (
    <div className="relative">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
        autoFocus
      />
      {results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E2] rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={() => {
                onPick(c);
                setSearch('');
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-[#EEF2FF] transition-colors border-b border-[#E5E5E2] last:border-0"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111111]">{c.contact_person}</p>
                  <p className="text-xs text-[#858585] truncate">
                    {c.email}
                    {c.phone ? ` · ${c.phone}` : ''}
                  </p>
                </div>
                {c.businesses.length > 0 && (
                  <span className="text-[10px] text-[#555555] bg-[#F0F0ED] px-2 py-0.5 rounded-full shrink-0">
                    {c.businesses.length}B
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] text-[#858585] mt-2">
        {!search.trim() ? 'Type to search from client list' : results.length === 0 ? 'No clients found' : ''}
      </p>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-1 text-xs text-[#555555] hover:text-[#1400FF] transition-colors"
        >
          ← Cancel
        </button>
      )}
    </div>
  );
}

// ─── Client on a new project ────────────────────────────────────────────────

function NewProjectClient({
  clients,
  client,
  businessId,
  onChange,
}: {
  clients: ClientOption[];
  client: ClientOption | null;
  businessId: string;
  onChange: (client: ClientOption | null, businessId: string) => void;
}) {
  const [picking, setPicking] = useState(!client);

  if (picking || !client) {
    return (
      <ClientSearch
        clients={clients}
        onPick={(c) => {
          onChange(c, '');
          setPicking(false);
        }}
        onCancel={client ? () => setPicking(false) : undefined}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-[#F7F7F5] border border-[#E5E5E2] rounded-lg">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111111] truncate">{client.contact_person}</p>
          <p className="text-xs text-[#555555] truncate">{client.email}</p>
          {client.phone && <p className="text-xs text-[#858585]">{client.phone}</p>}
        </div>
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="text-xs font-medium text-[#1400FF] px-2 py-1 rounded-lg hover:bg-[#EEF2FF]"
        >
          Change
        </button>
        <button
          type="button"
          onClick={() => onChange(null, '')}
          title="Clear"
          className="p-1 text-[#858585] hover:text-rose-600 rounded-lg hover:bg-rose-50"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {client.businesses.length > 0 && (
        <div>
          <label className={labelCls}>Business</label>
          <select value={businessId} onChange={(e) => onChange(client, e.target.value)} className={inputCls}>
            <option value="">No specific business</option>
            {client.businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// ─── Clients on an existing project ─────────────────────────────────────────

function ProjectClientsSection({
  projectId,
  clients,
  initial,
}: {
  projectId: string;
  clients: ClientOption[];
  initial: ProjectClientRecord[];
}) {
  const [list, setList] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  async function run(p: Promise<{ success: boolean; data?: ProjectClientRecord[]; error?: string }>) {
    setSaving(true);
    const res = await p;
    setSaving(false);
    if (res.success && res.data) setList(res.data);
    else alert(res.error || 'Failed to update clients');
  }

  return (
    <div className={cardCls}>
      <h3 className={headingCls}>Clients{list.length > 0 ? ` (${list.length})` : ''}</h3>

      <div className="space-y-2 mb-3">
        {list.map((pc) => (
          <div key={pc.id} className="p-3 bg-[#F7F7F5] border border-[#E5E5E2] rounded-lg">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111111] truncate">{pc.name}</p>
                <p className="text-xs text-[#555555] truncate">{pc.email}</p>
                {pc.phone && <p className="text-xs text-[#858585]">{pc.phone}</p>}
              </div>
              <button
                onClick={() => run(removeProjectClientAction(projectId, pc.id))}
                title="Remove client"
                className="p-1 text-[#858585] hover:text-rose-600 rounded-lg hover:bg-rose-50 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {pc.businesses.length > 0 && (
              <select
                value={pc.business_id ?? ''}
                onChange={(e) => run(setProjectClientBusinessAction(projectId, pc.id, e.target.value || null))}
                className="mt-2 w-full px-2 py-1.5 text-xs rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]"
              >
                <option value="">No specific business</option>
                {pc.businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <ClientSearch
          clients={clients.filter((c) => !list.some((pc) => pc.client_id === c.id))}
          placeholder="Search clients…"
          onPick={(c) => {
            setAdding(false);
            run(addProjectClientAction(projectId, c.id));
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          disabled={saving}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1400FF] hover:text-[#0F00CC]"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Add Client
        </button>
      )}
    </div>
  );
}

// ─── File adder ─────────────────────────────────────────────────────────────

function FileAdder({ deliverableId, onAdded }: { deliverableId: string; onAdded: (f: DeliverableFileRecord) => void }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);

  async function save(file: { name: string; url: string; size: number; mime_type: string }) {
    const res = await addDeliverableFileAction(deliverableId, file);
    if (!res.success || !res.data) {
      alert(res.error || 'Failed to save file');
      return;
    }
    onAdded(res.data);
    setUrl('');
    setName('');
    setOpen(false);
  }

  async function upload(file: File) {
    setUploading(true);
    try {
      await save(await uploadFile(file, 'projects/deliverables'));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed. Try pasting a URL instead.');
    } finally {
      setUploading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-[#858585] hover:text-[#1400FF] transition-colors"
      >
        <Paperclip className="w-3 h-3" /> Add file
      </button>
    );
  }

  return (
    <div className="mt-2 p-3 border border-[#E5E5E2] rounded-lg bg-[#F7F7F5]">
      <label
        className={`flex items-center justify-center gap-2 px-3 py-2 mb-2 border border-dashed border-[#D4D4D0] rounded-lg text-xs text-[#555555] bg-white cursor-pointer hover:border-[#1400FF] hover:text-[#1400FF] transition-colors ${
          uploading ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Paperclip className="w-3 h-3" />}
        {uploading ? 'Uploading…' : 'Choose file'}
        <input
          type="file"
          className="sr-only"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </label>
      <p className="text-[10px] text-[#858585] mb-2 text-center">or paste a URL</p>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={`${inputCls} mb-1.5`} />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="File name (optional)"
        className={`${inputCls} mb-2`}
      />
      <div className="flex gap-2">
        <button
          onClick={() => url.trim() && save({ name: name.trim(), url: url.trim(), size: 0, mime_type: '' })}
          disabled={!url.trim()}
          className="flex-1 px-3 py-1.5 bg-[#1400FF] text-white text-xs font-medium rounded-lg hover:bg-[#0F00CC] disabled:opacity-50"
        >
          Save URL
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setUrl('');
            setName('');
          }}
          className="px-3 py-1.5 border border-[#E5E5E2] bg-white text-xs text-[#555555] rounded-lg hover:bg-[#F0F0ED]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Deliverable row ────────────────────────────────────────────────────────

function DeliverableRow({
  d,
  onChange,
  onDelete,
}: {
  d: DeliverableRecord;
  onChange: (d: DeliverableRecord) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(d);
  const debounce = useDebounced();

  async function persist(changes: Partial<DeliverableRecord>) {
    setSaving(true);
    const res = await updateDeliverableAction(d.id, changes);
    setSaving(false);
    if (res.success && res.data) onChange(res.data);
    else alert(res.error || 'Failed to save deliverable');
  }

  // Text fields wait for a pause in typing; the pending edits are merged so
  // a quick title-then-notes edit still saves both.
  const pending = useRef<Partial<DeliverableRecord>>({});
  function edit(changes: Partial<DeliverableRecord>) {
    setLocal((l) => ({ ...l, ...changes }));
    pending.current = { ...pending.current, ...changes };
    debounce(() => {
      const batch = pending.current;
      pending.current = {};
      persist(batch);
    });
  }

  async function changeStatus(status: string) {
    setLocal((l) => ({ ...l, status }));
    setSaving(true);
    const res = await updateDeliverableAction(d.id, { status });
    setSaving(false);
    if (res.success && res.data) {
      setLocal(res.data);
      onChange(res.data);
    } else alert(res.error || 'Failed to update status');
  }

  function setFiles(files: DeliverableFileRecord[]) {
    setLocal((l) => ({ ...l, files }));
    onChange({ ...local, files });
  }

  const sm = deliverableStatusMeta(local.status);

  return (
    <div className="border border-[#E5E5E2] rounded-lg bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className={`w-2 h-2 rounded-full shrink-0 ${sm.dot}`} />
        <input
          value={local.title}
          onChange={(e) => edit({ title: e.target.value })}
          className="flex-1 min-w-0 text-sm font-medium text-[#111111] bg-transparent outline-none placeholder:text-[#858585]"
          placeholder="Deliverable title"
        />
        <input
          value={local.type}
          onChange={(e) => edit({ type: e.target.value })}
          className="hidden sm:block w-24 text-xs text-[#555555] bg-transparent outline-none placeholder:text-[#C8C8C4] text-right"
          placeholder="type"
        />
        <select
          value={local.status}
          onChange={(e) => changeStatus(e.target.value)}
          className={`text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${sm.className}`}
        >
          {DELIVERABLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {DELIVERABLE_STATUS_META[s].label}
            </option>
          ))}
        </select>
        {saving && <Loader2 className="w-3 h-3 text-[#858585] animate-spin shrink-0" />}
        <button
          onClick={() => setExpanded((v) => !v)}
          title={expanded ? 'Collapse' : 'Details'}
          className="p-1 text-[#858585] hover:text-[#1400FF]"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        <button onClick={() => onDelete(d.id)} title="Remove deliverable" className="p-1 text-[#858585] hover:text-rose-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[#E5E5E2] px-3 py-3 space-y-3 bg-[#FAFAF9]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Due Date</label>
              <input
                type="date"
                value={local.deadline ?? ''}
                onChange={(e) => edit({ deadline: e.target.value || null })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Completed At</label>
              <input
                type="date"
                value={local.completed_at ?? ''}
                onChange={(e) => edit({ completed_at: e.target.value || null })}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              value={local.notes}
              onChange={(e) => edit({ notes: e.target.value })}
              rows={2}
              className={textareaCls}
              placeholder="Notes (visible to the client)…"
            />
          </div>
          <div>
            <label className={labelCls}>Files</label>
            {local.files.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {local.files.map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#858585] shrink-0" />
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-xs text-[#1400FF] hover:underline truncate"
                    >
                      {f.name}
                    </a>
                    <button
                      onClick={async () => {
                        const res = await deleteDeliverableFileAction(f.id);
                        if (res.success) setFiles(local.files.filter((x) => x.id !== f.id));
                        else alert(res.error || 'Failed to remove file');
                      }}
                      title="Remove file"
                      className="p-0.5 text-[#858585] hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <FileAdder deliverableId={d.id} onAdded={(f) => setFiles([...local.files, f])} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Service card ───────────────────────────────────────────────────────────

function ServiceCard({
  s,
  onChange,
  onDelete,
}: {
  s: ServiceRecord;
  onChange: (s: ServiceRecord) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(s.title);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const debounce = useDebounced();

  function editTitle(v: string) {
    setTitle(v);
    debounce(async () => {
      setSaving(true);
      const res = await updateServiceTitleAction(s.id, v);
      setSaving(false);
      if (res.success) onChange({ ...s, title: v });
      else alert(res.error || 'Failed to save service');
    });
  }

  async function addDeliverable() {
    if (!newTitle.trim()) return;
    const res = await createDeliverableAction(s.id, newTitle.trim());
    if (!res.success || !res.data) {
      alert(res.error || 'Failed to add deliverable');
      return;
    }
    onChange({ ...s, deliverables: [...s.deliverables, res.data] });
    setNewTitle('');
    setAdding(false);
  }

  async function deleteDeliverable(id: string) {
    if (!confirm('Remove this deliverable?')) return;
    const res = await deleteDeliverableAction(id);
    if (res.success) onChange({ ...s, deliverables: s.deliverables.filter((d) => d.id !== id) });
    else alert(res.error || 'Failed to remove deliverable');
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E2] shadow-xs overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E5E5E2] bg-[#F7F7F5]">
        <input
          value={title}
          onChange={(e) => editTitle(e.target.value)}
          className="flex-1 min-w-0 text-sm font-semibold text-[#111111] bg-transparent outline-none"
          placeholder="Service name"
        />
        {saving && <Loader2 className="w-3 h-3 text-[#858585] animate-spin" />}
        <button
          onClick={() => onDelete(s.id)}
          title="Remove service"
          className="p-1 text-[#858585] hover:text-rose-600 rounded-lg hover:bg-rose-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-2">
        {s.deliverables.map((d) => (
          <DeliverableRow
            key={d.id}
            d={d}
            onChange={(next) => onChange({ ...s, deliverables: s.deliverables.map((x) => (x.id === next.id ? next : x)) })}
            onDelete={deleteDeliverable}
          />
        ))}

        {adding ? (
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addDeliverable();
                if (e.key === 'Escape') setAdding(false);
              }}
              autoFocus
              placeholder="Deliverable title…"
              className={`${inputCls} flex-1`}
            />
            <button onClick={addDeliverable} className="px-3 py-2 bg-[#1400FF] text-white text-sm rounded-lg hover:bg-[#0F00CC]">
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-2 border border-[#E5E5E2] text-sm text-[#555555] rounded-lg hover:bg-[#F7F7F5]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-xs text-[#858585] hover:text-[#1400FF] transition-colors py-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add deliverable
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function ProjectDetailClientView({
  project,
  clients,
  templates: initialTemplates,
}: {
  project: ProjectDetail | null;
  clients: ClientOption[];
  templates: ProjectTemplateRecord[];
}) {
  const router = useRouter();
  const isNew = !project;

  const [title, setTitle] = useState(project?.project_name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [status, setStatus] = useState<ProjectStatus>(
    PROJECT_STATUSES.includes(project?.status as ProjectStatus) ? (project!.status as ProjectStatus) : 'active'
  );
  const [startDate, setStartDate] = useState(project?.start_date ?? '');
  const [deadline, setDeadline] = useState(project?.deadline ?? '');
  const [invoiceNumber, setInvoiceNumber] = useState(project?.invoice_number ?? '');
  const [services, setServices] = useState<ServiceRecord[]>(project?.services ?? []);
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateName, setTemplateName] = useState<string | null>(null);

  // New project only: the first client and their business.
  const [newClient, setNewClient] = useState<ClientOption | null>(null);
  const [newBusinessId, setNewBusinessId] = useState('');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSave() {
    setSaving(true);
    const body = {
      project_name: title,
      description,
      status,
      start_date: startDate || null,
      deadline: deadline || null,
      invoice_number: invoiceNumber,
    };
    if (isNew) {
      const res = await createProjectAction({
        ...body,
        client_id: newClient?.id ?? null,
        business_id: newBusinessId || null,
      });
      if (res.success && res.data) {
        router.replace(`/admin/projects/${res.data.id}`);
        return;
      }
      alert(res.error || 'Failed to save project.');
    } else {
      const res = await updateProjectAction(project.id, body);
      if (!res.success) alert(res.error || 'Failed to save project.');
      else router.refresh();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!project || !confirm(`Delete project "${title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await deleteProjectAction(project.id);
    if (res.success) router.push('/admin/projects');
    else {
      alert(res.error || 'Failed to delete project.');
      setDeleting(false);
    }
  }

  async function addService() {
    if (!project) return;
    const res = await createServiceAction(project.id);
    if (res.success && res.data) setServices((s) => [...s, res.data!]);
    else alert(res.error || 'Failed to add service.');
  }

  async function deleteService(serviceId: string) {
    if (!confirm('Remove this service and all its deliverables?')) return;
    const res = await deleteServiceAction(serviceId);
    if (res.success) setServices((s) => s.filter((x) => x.id !== serviceId));
    else alert(res.error || 'Failed to remove service.');
  }

  async function applyTemplate() {
    if (!project || !selectedTemplate) return;
    const res = await applyTemplateAction(project.id, selectedTemplate);
    if (res.success && res.data) {
      setServices(res.data);
      setSelectedTemplate('');
    } else alert(res.error || 'Failed to apply template.');
  }

  async function saveAsTemplate() {
    if (!project || !templateName?.trim()) return;
    const res = await saveTemplateAction(project.id, templateName);
    if (res.success && res.data) {
      setTemplates((t) => [...t, res.data!].sort((a, b) => a.name.localeCompare(b.name)));
      setTemplateName(null);
    } else alert(res.error || 'Failed to save template.');
  }

  function copyCode() {
    if (!project?.access_code) return;
    navigator.clipboard.writeText(project.access_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const all = services.flatMap((s) => s.deliverables);
  const progress = calcProgress(all);
  const dl = DEADLINE_STATE_META[getDeadlineState(deadline, status === 'completed' ? project?.completed_at || 'now' : null)];
  const sm = PROJECT_STATUS_META[status];

  return (
    <div className="max-w-6xl space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.push('/admin/projects')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#858585] hover:text-[#1400FF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Projects
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {!isNew && (
            <>
              <button
                type="button"
                onClick={() => router.push(`/admin/quotations/new?projectId=${project.id}`)}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-[#C7D2FE] text-[#1400FF] text-xs font-medium rounded-lg bg-white hover:bg-[#EEF2FF] transition-colors"
              >
                <ScrollText className="w-3.5 h-3.5" /> Create Quotation
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 text-rose-600 text-xs font-medium rounded-lg bg-white hover:bg-rose-50 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#1400FF] text-white text-sm font-medium rounded-lg hover:bg-[#0F00CC] transition-colors disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? 'Create Project' : 'Save Project'}
          </button>
        </div>
      </div>

      {/* Title + status */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          className="text-2xl font-bold text-[#111111] tracking-tight bg-transparent outline-none flex-1 min-w-0"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          className={`text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${sm.className}`}
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {PROJECT_STATUS_META[s].label}
            </option>
          ))}
        </select>
        {!isNew && deadline && (
          <span className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${dl.className}`}>{dl.label}</span>
        )}
      </div>

      {!isNew && all.length > 0 && (
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#555555]">Project Progress</span>
            <span className="text-sm font-bold text-[#111111] font-mono">
              {progress}% · {countDone(all)}/{all.length} deliverables
            </span>
          </div>
          <div className="h-2 bg-[#E5E5E2] rounded-full overflow-hidden">
            <div className="h-full bg-[#1400FF] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {isNew ? (
            <div className={cardCls}>
              <h3 className={headingCls}>Client Info</h3>
              <NewProjectClient
                clients={clients}
                client={newClient}
                businessId={newBusinessId}
                onChange={(c, b) => {
                  setNewClient(c);
                  setNewBusinessId(b);
                }}
              />
            </div>
          ) : (
            <ProjectClientsSection projectId={project.id} clients={clients} initial={project.clients} />
          )}

          <div className={cardCls}>
            <h3 className={headingCls}>Dates</h3>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className={headingCls}>Linked Invoice</h3>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
              className={inputCls}
              placeholder="INV-XXXX"
            />
            {invoiceNumber && (
              <a
                href={`/billing/${encodeURIComponent(invoiceNumber)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-[#1400FF] hover:underline"
              >
                View invoice <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className={cardCls}>
            <h3 className={headingCls}>Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={textareaCls}
              placeholder="Project brief, goals, notes…"
            />
          </div>

          {!isNew && project.access_code && (
            <div className={cardCls}>
              <h3 className={headingCls}>Client Credential</h3>
              <div className="flex items-center gap-2 p-3 bg-[#F7F7F5] border border-[#E5E5E2] rounded-lg">
                <code className="flex-1 text-sm font-mono font-bold text-[#1400FF]">{project.access_code}</code>
                <button onClick={copyCode} title="Copy" className="p-1 text-[#858585] hover:text-[#1400FF]">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-600 mt-1">Copied!</p>}
              <p className="text-xs text-[#858585] mt-2">
                Client signs in at{' '}
                <a href="/project-access" target="_blank" rel="noreferrer" className="text-[#1400FF] hover:underline">
                  /project-access
                </a>
              </p>
              <p className="text-[10px] text-[#858585] mt-1">Email + credential required for access.</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {!isNew && (
            <div className={cardCls}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`${headingCls} mb-0`}>Templates</h3>
                {services.length > 0 && templateName === null && (
                  <button
                    onClick={() => setTemplateName(title)}
                    className="text-xs font-medium text-[#1400FF] hover:underline"
                  >
                    Save as template
                  </button>
                )}
              </div>
              {templateName !== null && (
                <div className="flex gap-2 mb-3">
                  <input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveAsTemplate();
                      if (e.key === 'Escape') setTemplateName(null);
                    }}
                    autoFocus
                    placeholder="Template name"
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    onClick={saveAsTemplate}
                    disabled={!templateName.trim()}
                    className="px-3 py-2 bg-[#1400FF] text-white text-sm rounded-lg hover:bg-[#0F00CC] disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setTemplateName(null)}
                    className="px-3 py-2 border border-[#E5E5E2] text-sm text-[#555555] rounded-lg hover:bg-[#F7F7F5]"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {templates.length > 0 ? (
                <>
                  <div className="flex gap-2">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className={`${inputCls} flex-1`}
                    >
                      <option value="">Select a template…</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={applyTemplate}
                      disabled={!selectedTemplate}
                      className="px-4 py-2 bg-[#1400FF] text-white text-sm font-medium rounded-lg hover:bg-[#0F00CC] disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-[#858585] mt-1.5">Appends template services to existing structure.</p>
                </>
              ) : (
                <p className="text-xs text-[#858585]">
                  No templates yet. Build this project&apos;s services, then save them as a template to reuse.
                </p>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#111111]">Services &amp; Deliverables</h3>
              {!isNew && (
                <button
                  onClick={addService}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#EEF2FF] text-[#1400FF] text-xs font-medium rounded-lg hover:bg-[#E0E7FF] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Service
                </button>
              )}
            </div>

            {isNew ? (
              <div className="text-center py-12 border border-dashed border-[#E5E5E2] rounded-xl text-[#858585] text-sm bg-white">
                Save project first, then add services &amp; deliverables.
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#E5E5E2] rounded-xl bg-white">
                <p className="text-[#858585] text-sm mb-3">No services yet</p>
                <button
                  onClick={addService}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1400FF] text-white text-sm font-medium rounded-lg hover:bg-[#0F00CC]"
                >
                  <Plus className="w-4 h-4" /> Add first service
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((s) => (
                  <ServiceCard
                    key={s.id}
                    s={s}
                    onChange={(next) => setServices((list) => list.map((x) => (x.id === next.id ? next : x)))}
                    onDelete={deleteService}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
