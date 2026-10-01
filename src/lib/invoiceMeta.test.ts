/**
 * Run: node --experimental-strip-types --test src/lib/invoiceMeta.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { computeTotals, resolveInvoiceStatus, getLifecycleState } from "./invoiceMeta.ts";

const items = [{ quantity: 2, unit_price: 1000 }, { quantity: 1, unit_price: 500 }];

test("percent discount comes off before tax", () => {
  assert.deepEqual(computeTotals(items, "percent", 10, 5), {
    subtotal: 2500, discountAmount: 250, taxAmount: 112.5, total: 2362.5,
  });
});

test("fixed discount never exceeds the subtotal", () => {
  assert.equal(computeTotals(items, "fixed", 9999, 0).total, 0);
});

test("status follows payments and the due date", () => {
  const past = "2020-01-01";
  const future = "2999-01-01";
  assert.equal(resolveInvoiceStatus("sent", 100, 0, past), "overdue");
  assert.equal(resolveInvoiceStatus("sent", 100, 0, future), "sent");
  assert.equal(resolveInvoiceStatus("partially_paid", 100, 0, future), "sent");
  assert.equal(resolveInvoiceStatus("paid", 100, 40, future), "partially_paid");
  assert.equal(resolveInvoiceStatus("overdue", 100, 100, past), "paid");
  assert.equal(resolveInvoiceStatus("draft", 100, 100, past), "draft");
  assert.equal(resolveInvoiceStatus("cancelled", 100, 0, past), "cancelled");
});

test("public link: open, then PDF only, then expired", () => {
  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
  const paid = (n: number) => ({ status: "paid", fully_paid_at: daysAgo(n), access_expires_at: null, pdf_expires_at: null });
  assert.equal(getLifecycleState(paid(1)), "active");
  assert.equal(getLifecycleState(paid(5)), "pdf_only");
  assert.equal(getLifecycleState(paid(20)), "expired");
  assert.equal(getLifecycleState({ ...paid(20), access_expires_at: "2999-01-01" }), "active");
  assert.equal(getLifecycleState({ ...paid(20), pdf_expires_at: "2999-01-01" }), "pdf_only");
});
