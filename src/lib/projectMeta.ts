// Labels, colours and the progress / deadline rules for projects and their
// deliverables. Shared by the admin and the client portal so both agree on
// what "done" means.

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

export type DeliverableStatus =
  | 'pending'
  | 'in_progress'
  | 'analyzing'
  | 'designing'
  | 'review'
  | 'revision'
  | 'approved'
  | 'optimizing'
  | 'uploaded'
  | 'delivering'
  | 'completed';

export const PROJECT_STATUSES: ProjectStatus[] = ['active', 'on_hold', 'completed', 'cancelled'];

export const DELIVERABLE_STATUSES: DeliverableStatus[] = [
  'pending', 'in_progress', 'analyzing', 'designing', 'review', 'revision',
  'approved', 'optimizing', 'uploaded', 'delivering', 'completed',
];

type Meta = { label: string; className: string };

export const PROJECT_STATUS_META: Record<ProjectStatus, Meta> = {
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  on_hold: { label: 'On Hold', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', className: 'bg-[#EEF2FF] text-[#1400FF] border-[#C7D2FE]' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export function projectStatusMeta(status: string): Meta {
  // Rows written before the four-state model fall back to Active.
  return PROJECT_STATUS_META[status as ProjectStatus] ?? PROJECT_STATUS_META.active;
}

export const DELIVERABLE_STATUS_META: Record<DeliverableStatus, Meta & { dot: string }> = {
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  in_progress: { label: 'In Progress', className: 'bg-[#EEF2FF] text-[#1400FF] border-[#C7D2FE]', dot: 'bg-[#1400FF]' },
  analyzing: { label: 'Analyzing', className: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  designing: { label: 'Designing', className: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  review: { label: 'Review', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  revision: { label: 'Revision', className: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  optimizing: { label: 'Optimizing', className: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  uploaded: { label: 'Uploaded', className: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  delivering: { label: 'Delivering', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600' },
};

export function deliverableStatusMeta(status: string) {
  return DELIVERABLE_STATUS_META[status as DeliverableStatus] ?? DELIVERABLE_STATUS_META.pending;
}

/** Statuses that count as done for progress. */
const DONE: ReadonlySet<string> = new Set(['completed', 'uploaded', 'approved', 'delivering']);

export function isDeliverableDone(status: string): boolean {
  return DONE.has(status);
}

export function countDone(deliverables: { status: string }[]): number {
  return deliverables.filter((d) => DONE.has(d.status)).length;
}

export function calcProgress(deliverables: { status: string }[]): number {
  if (deliverables.length === 0) return 0;
  return Math.round((countDone(deliverables) / deliverables.length) * 100);
}

export type DeadlineState = 'overdue' | 'due_soon' | 'on_track' | 'completed';

export function getDeadlineState(
  deadline: string | null | undefined,
  completedAt: string | null | undefined
): DeadlineState {
  if (completedAt) return 'completed';
  if (!deadline) return 'on_track';
  const days = (new Date(deadline).getTime() - Date.now()) / 86_400_000;
  if (days < 0) return 'overdue';
  if (days <= 3) return 'due_soon';
  return 'on_track';
}

export const DEADLINE_STATE_META: Record<DeadlineState, Meta> = {
  overdue: { label: 'Overdue', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  due_soon: { label: 'Due Soon', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  on_track: { label: 'On Track', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', className: 'bg-[#EEF2FF] text-[#1400FF] border-[#C7D2FE]' },
};

/** PROJ- plus six characters, skipping the look-alikes 0/O and 1/I. */
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  // The code is half of a client's login, so it comes from a CSPRNG.
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let code = 'PROJ-';
  for (const b of bytes) code += chars[b % chars.length];
  return code;
}
