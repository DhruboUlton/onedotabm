/**
 * Run: node --experimental-strip-types --test src/lib/caseStudyCsv.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseMetrics, csvToCaseStudyRows, CASE_STUDY_CSV_TEMPLATE } from "./caseStudyCsv.ts";

test("a label before the first number makes a stat", () => {
  assert.deepEqual(parseMetrics("Revenue +239%; ROAS 2.1x to 4.3x; 126 creatives tested"), [
    { label: "Revenue", metric: "+239%" },
    { label: "ROAS", metric: "2.1x to 4.3x" },
    { label: "", metric: "126 creatives tested" },
  ]);
});

test("the downloadable template imports back as one featured row", () => {
  const rows = csvToCaseStudyRows(CASE_STUDY_CSV_TEMPLATE);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].client, "TechStart BD");
  assert.deepEqual(rows[0].services, ["Meta Ads", "Google Ads", "Funnel Strategy"]);
  assert.equal(rows[0].featured, true);
  assert.equal(rows[0].metrics.length, 4);
});

test("rows missing a client or headline are dropped", () => {
  assert.equal(csvToCaseStudyRows("client,headline\nAcme,\n,Won\nAcme,Won").length, 1);
});
