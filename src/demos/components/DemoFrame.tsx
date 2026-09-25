import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, LayoutDashboard, Store } from 'lucide-react';

/**
 * The one piece of chrome every demo shares: the "this is a demo" notice, the
 * storefront <-> admin switch, and the way back to the showcase.
 *
 * It provides function, not style — demos keep their own visual language.
 * Server component: no state, so it costs nothing on the client.
 *
 * Demo layouts must leave room for it (pb-20 or similar) since it is fixed.
 */

export interface DemoFrameProps {
  category: string;
  demo: string;
  /** Fictional business name, shown so visitors know which demo they are in. */
  name: string;
  mode: 'storefront' | 'admin';
  hasAdmin?: boolean;
  /** Override the default notice copy if a demo needs different wording. */
  notice?: string;
}

export function DemoFrame({
  category,
  demo,
  name,
  mode,
  hasAdmin = true,
  notice = 'Demo website. No database connected.',
}: DemoFrameProps) {
  const base = `/webapp-demo/${category}/${demo}`;
  const isAdmin = mode === 'admin';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none">
      <div className="mx-auto max-w-4xl pointer-events-auto">
        <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-[#111111]/95 px-3 py-2.5 text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <Info className="hidden sm:block w-4 h-4 shrink-0 text-white/70" aria-hidden="true" />

          <p className="flex-1 min-w-0 text-[11px] sm:text-xs leading-tight">
            <span className="font-medium">{notice}</span>{' '}
            <span className="hidden sm:inline text-white/55">
              {name} is a fictional business built by OneDot ABM.
            </span>
          </p>

          {hasAdmin && (
            <Link
              href={isAdmin ? base : `${base}/admin`}
              className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] sm:text-xs font-medium text-[#111111] transition-colors hover:bg-white/90 active:scale-[0.97] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
            >
              {isAdmin ? (
                <>
                  <Store className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">View Home Page</span>
                  <span className="sm:hidden">Home</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">View Admin Panel</span>
                  <span className="sm:hidden">Admin</span>
                </>
              )}
            </Link>
          )}

          <Link
            href={`/webapp-demo/${category}`}
            aria-label="Exit demo and return to the OneDot ABM showcase"
            className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-white/20 px-2.5 py-1.5 text-[11px] sm:text-xs text-white/80 transition-colors hover:text-white hover:border-white/40 active:scale-[0.97] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Exit demo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
