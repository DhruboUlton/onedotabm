/**
 * Run: node --experimental-strip-types --test src/lib/followups.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { computeReminders, getStageStatus, FOLLOWUP_STAGES } from "./followups.ts";

const now = Date.parse("2026-10-30T12:00:00Z");
const ago = (days: number) => new Date(now - days * 86_400_000).toISOString();
const base = { email_sent_at: null, dm_sent_at: null, follow_up_1_at: null, follow_up_2_at: null, follow_up_3_at: null, follow_up_4_at: null };

test("a stage is upcoming, due, then overdue by day count", () => {
  const [fu1] = FOLLOWUP_STAGES;
  assert.equal(getStageStatus({ ...base, email_sent_at: ago(1) }, fu1, now), "upcoming");
  assert.equal(getStageStatus({ ...base, email_sent_at: ago(4) }, fu1, now), "due");
  assert.equal(getStageStatus({ ...base, email_sent_at: ago(6) }, fu1, now), "overdue");
  assert.equal(getStageStatus(base, fu1, now), "no-outreach");
});

test("outreach counts from the earlier of email and DM", () => {
  const p = { ...base, email_sent_at: ago(2), dm_sent_at: ago(10) };
  assert.equal(computeReminders([p], now)[0].days, 10);
});

test("only the next unfinished follow-up is a reminder", () => {
  const p = { ...base, email_sent_at: ago(8) };
  const [r] = computeReminders([p], now);
  assert.equal(r.stage.key, "follow_up_1_at");
  const done = { ...p, follow_up_1_at: ago(3) };
  assert.equal(computeReminders([done], now)[0].stage.key, "follow_up_2_at");
});

test("overdue sorts before due", () => {
  const due = { ...base, email_sent_at: ago(4) };
  const overdue = { ...base, email_sent_at: ago(30) };
  assert.equal(computeReminders([due, overdue], now)[0].p, overdue);
});
