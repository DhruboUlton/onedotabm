'use client';

import React from 'react';
import { useStore } from '../_context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-[#0A0B0E]/95 text-white border-emerald-500/40'
              : toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-100 border-rose-500/40'
              : 'bg-slate-900/95 text-slate-100 border-slate-700/60'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {toast.title && <h5 className="font-semibold text-xs tracking-wide uppercase mb-0.5">{toast.title}</h5>}
            <p className="text-xs leading-relaxed text-zinc-300">{toast.message}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 text-zinc-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
