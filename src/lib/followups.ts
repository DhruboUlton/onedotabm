// The outreach cadence: a follow-up is due inside its window, counted in days
// from the first outreach (the earlier of the email and the DM).

export type FollowUpKey = 'follow_up_1_at' | 'follow_up_2_at' | 'follow_up_3_at' | 'follow_up_4_at';

export interface FollowUpProspect {
  email_sent_at: string | null;
  dm_sent_at: string | null;
  follow_up_1_at: string | null;
  follow_up_2_at: string | null;
  follow_up_3_at: string | null;
  follow_up_4_at: string | null;
}

export const FOLLOWUP_STAGES: { key: FollowUpKey; label: string; shortLabel: string; startDay: number; endDay: number }[] = [
  { key: 'follow_up_1_at', label: '1st Follow-up', shortLabel: '1st FU', startDay: 3, endDay: 5 },
  { key: 'follow_up_2_at', label: '2nd Follow-up', shortLabel: '2nd FU', startDay: 7, endDay: 9 },
  { key: 'follow_up_3_at', label: '3rd Follow-up', shortLabel: '3rd FU', startDay: 14, endDay: 16 },
  { key: 'follow_up_4_at', label: 'Final Follow-up', shortLabel: 'Final FU', startDay: 21, endDay: 23 },
];

type Stage = (typeof FOLLOWUP_STAGES)[number];

export function getOutreachDate(p: FollowUpProspect): Date | null {
  const times = [p.email_sent_at, p.dm_sent_at].filter((d): d is string => !!d).map((d) => new Date(d).getTime());
  return times.length ? new Date(Math.min(...times)) : null;
}

export function daysSince(date: Date, now = Date.now()): number {
  return Math.floor((now - date.getTime()) / 86_400_000);
}

export type StageStatus = 'done' | 'overdue' | 'due' | 'upcoming' | 'no-outreach';

export function getStageStatus(p: FollowUpProspect, stage: Stage, now = Date.now()): StageStatus {
  if (p[stage.key]) return 'done';
  const outreach = getOutreachDate(p);
  if (!outreach) return 'no-outreach';
  const d = daysSince(outreach, now);
  if (d > stage.endDay) return 'overdue';
  return d >= stage.startDay ? 'due' : 'upcoming';
}

export interface Reminder<T extends FollowUpProspect> {
  p: T;
  stage: Stage;
  status: 'due' | 'overdue';
  days: number;
}

/** The next unfinished follow-up of each prospect that is due or overdue, overdue and oldest first. */
export function computeReminders<T extends FollowUpProspect>(prospects: T[], now = Date.now()): Reminder<T>[] {
  const out: Reminder<T>[] = [];
  for (const p of prospects) {
    const outreach = getOutreachDate(p);
    if (!outreach) continue;
    for (const stage of FOLLOWUP_STAGES) {
      if (p[stage.key]) continue;
      const status = getStageStatus(p, stage, now);
      if (status === 'due' || status === 'overdue') out.push({ p, stage, status, days: daysSince(outreach, now) });
      break; // only the next unfinished stage
    }
  }
  return out.sort((a, b) => (a.status !== b.status ? (a.status === 'overdue' ? -1 : 1) : b.days - a.days));
}
