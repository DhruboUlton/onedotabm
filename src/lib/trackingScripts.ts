export type HeadScript = { src?: string; async?: boolean; defer?: boolean; code?: string };

/**
 * Splits a pasted HEAD snippet into the scripts it actually contains.
 *
 * Handles all three shapes admins paste: bare JavaScript (no wrapper), one or
 * more inline `<script>…</script>` blocks, and external `<script src="…">`
 * tags — the last of which used to be dropped entirely, because only the
 * (empty) inner text of the first tag was kept.
 *
 * Non-script markup (a `<noscript>` block, say) can't be injected into <head>
 * this way and is skipped — it belongs in a BODY_START / BODY_END integration.
 */
export function parseHeadScripts(code: string): HeadScript[] {
  const out: HeadScript[] = [];
  const tagRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  let sawTag = false;

  while ((match = tagRe.exec(code)) !== null) {
    sawTag = true;
    const attrs = match[1] ?? "";
    const inner = (match[2] ?? "").trim();
    const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (src) {
      out.push({
        src: src[1],
        async: /\basync\b/i.test(attrs),
        defer: /\bdefer\b/i.test(attrs),
      });
    } else if (inner) {
      out.push({ code: inner });
    }
  }

  if (!sawTag) {
    const bare = code.trim();
    if (bare && !bare.startsWith("<")) out.push({ code: bare });
  }

  return out;
}
