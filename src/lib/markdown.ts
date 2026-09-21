/**
 * Minimal Markdown renderer for admin-authored blog content.
 *
 * Input is escaped FIRST, so no author-supplied HTML (or script) can survive —
 * only the subset of syntax handled below becomes real markup. That makes the
 * output safe to pass to dangerouslySetInnerHTML.
 *
 * Supported: h2/h3/h4, bold, italic, inline code, fenced code, links,
 * unordered + ordered lists, blockquotes, horizontal rules, paragraphs.
 * ponytail: subset renderer, swap for `marked` + sanitizer if authors need tables/images.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Only http(s), mailto and site-relative links become anchors. */
function safeHref(href: string): string | null {
  const value = href.trim();
  if (/^(https?:\/\/|mailto:|\/)/i.test(value)) return value;
  return null;
}

function renderInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="rounded bg-[#F0F0ED] px-1.5 py-0.5 font-mono text-[0.9em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-[#111111]">$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, href: string) => {
      const url = safeHref(href);
      if (!url) return label;
      const external = url.startsWith("http");
      return `<a href="${url}" class="text-[#1400FF] underline underline-offset-2 hover:opacity-80"${
        external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>${label}</a>`;
    });
}

export function renderMarkdown(markdown: string): string {
  const lines = escapeHtml(markdown).replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];

  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    out.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    out.push(`</${listType}>`);
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        out.push(`<pre><code>${codeLines.join("\n")}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushParagraph();
        closeList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (trimmed === "") {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flushParagraph();
      closeList();
      out.push("<hr />");
      continue;
    }

    if (trimmed.startsWith("&gt; ")) {
      flushParagraph();
      closeList();
      out.push(`<blockquote>${renderInline(trimmed.slice(5))}</blockquote>`);
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      flushParagraph();
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${renderInline(bullet[1])}</li>`);
      continue;
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (numbered) {
      flushParagraph();
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${renderInline(numbered[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  if (inCodeBlock && codeLines.length > 0) {
    out.push(`<pre><code>${codeLines.join("\n")}</code></pre>`);
  }
  flushParagraph();
  closeList();

  return out.join("\n");
}

/** Rough reading time, matching the "N min read" label on the blog. */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
