/**
 * Run: node --experimental-strip-types --test src/lib/markdown.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { renderMarkdown, readingMinutes } from "./markdown.ts";

test("escapes author HTML instead of rendering it", () => {
  const html = renderMarkdown('<img src=x onerror="alert(1)">');
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;img"));
});

test("renders headings, lists and inline formatting", () => {
  const html = renderMarkdown("## Title\n\n- one\n- **two**\n\n1. first\n\nPlain text.");
  assert.ok(html.includes("<h2>Title</h2>"));
  assert.ok(html.includes("<ul>") && html.includes("<li>one</li>"));
  assert.ok(html.includes("<strong"));
  assert.ok(html.includes("<ol>") && html.includes("<li>first</li>"));
  assert.ok(html.includes("<p>Plain text.</p>"));
});

test("keeps safe links and drops javascript: urls", () => {
  assert.ok(renderMarkdown("[site](https://onedotabm.com)").includes('href="https://onedotabm.com"'));
  assert.ok(renderMarkdown("[x](/contact)").includes('href="/contact"'));
  const injected = renderMarkdown("[click](javascript:alert(1))");
  assert.ok(!injected.includes("href"));
  assert.ok(injected.includes("click"));
});

test("fenced code blocks stay literal", () => {
  const html = renderMarkdown("```\nconst a = 1;\n```");
  assert.ok(html.includes("<pre><code>const a = 1;</code></pre>"));
});

test("reading time is at least one minute", () => {
  assert.equal(readingMinutes("word"), 1);
  assert.equal(readingMinutes("word ".repeat(440)), 2);
});
