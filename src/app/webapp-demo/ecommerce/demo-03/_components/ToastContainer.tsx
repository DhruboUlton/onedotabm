'use client';

import React from 'react';
import { useStore } from '../_context/StoreContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100 dark:border-emerald-500/40';
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-rose-500/30 bg-rose-950/90 text-rose-100 dark:border-rose-500/40';
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/30 bg-amber-950/90 text-amber-100 dark:border-amber-500/40';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-blue-500/30 bg-slate-900/95 text-blue-100 dark:border-blue-500/40';
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-2 fade-in ${borderClass}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-tight text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-[11px] leading-relaxed text-white/80 mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors shrink-0 p-1 -mr-1 -mt-1 rounded-md"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
