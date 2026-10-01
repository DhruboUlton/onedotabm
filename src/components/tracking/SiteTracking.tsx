'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { parseHeadScripts } from '@/lib/trackingScripts';
import { recordPageViewAction } from '@/app/pageViewAction';

interface Item {
  id: string;
  code: string;
  placement: 'head' | 'body_start' | 'body_end';
}

// Admin, the signed-in portal, and per-client documents (whose URLs are private ids) are not counted.
const isPublic = (path: string | null) =>
  !!path && !['/admin', '/workspace', '/billing/', '/quote/'].some((p) => path.startsWith(p));

function inject(code: string, where: 'start' | 'end') {
  const tpl = document.createElement('template');
  tpl.innerHTML = code.trim();
  for (const node of Array.from(tpl.content.childNodes)) {
    let el: Node = node;
    if (node.nodeName === 'SCRIPT') {
      // Scripts parsed from HTML do not run; rebuild them so they do.
      const src = node as HTMLScriptElement;
      const s = document.createElement('script');
      for (const a of Array.from(src.attributes)) s.setAttribute(a.name, a.value);
      s.textContent = src.textContent;
      el = s;
    }
    if (where === 'start') document.body.insertBefore(el, document.body.firstChild);
    else document.body.appendChild(el);
  }
}

/**
 * Loads the admin's tracking scripts once per visit (not per page), and
 * counts one page view per public navigation.
 */
export function SiteTracking() {
  const pathname = usePathname();
  const loaded = useRef(false);
  const lastCounted = useRef<string | null>(null);

  useEffect(() => {
    if (!isPublic(pathname) || loaded.current) return;
    loaded.current = true;
    fetch('/api/tracking-scripts')
      .then((r) => (r.ok ? r.json() : []))
      .then((items: Item[]) => {
        if (!Array.isArray(items)) return;
        for (const i of items.filter((x) => x.placement === 'head')) {
          for (const s of parseHeadScripts(i.code)) {
            const el = document.createElement('script');
            if (s.src) {
              el.src = s.src;
              el.async = !!s.async;
              el.defer = !!s.defer;
            } else el.textContent = s.code ?? '';
            document.head.appendChild(el);
          }
        }
        // Reversed so the first body_start script ends up first.
        for (const i of items.filter((x) => x.placement === 'body_start').reverse()) inject(i.code, 'start');
        for (const i of items.filter((x) => x.placement === 'body_end')) inject(i.code, 'end');
      })
      .catch(() => {});
    // No cleanup: the ref already guarantees one load, and cancelling here would
    // drop the result when React runs this effect twice in development.
  }, [pathname]);

  useEffect(() => {
    if (!isPublic(pathname) || lastCounted.current === pathname) return;
    lastCounted.current = pathname;
    recordPageViewAction(pathname!, document.referrer);
  }, [pathname]);

  return null;
}
