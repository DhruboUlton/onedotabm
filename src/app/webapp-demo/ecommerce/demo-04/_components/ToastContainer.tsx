'use client';

import React from 'react';
import { useStore } from '../_context/StoreContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-white/95 border-[#1CBBB4]/40 text-[#0F172A]'
              : toast.type === 'error'
              ? 'bg-white/95 border-[#EB1551]/40 text-[#0F172A]'
              : toast.type === 'warning'
              ? 'bg-white/95 border-[#F7941E]/40 text-[#0F172A]'
              : 'bg-white/95 border-[#0A6375]/30 text-[#0F172A]'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#1CBBB4]" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-[#EB1551]" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#F7941E]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#0A6375]" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm leading-tight text-[#0F172A] font-nunito">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-[#6B6B84] mt-0.5 leading-relaxed font-nunito">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 text-[#6B6B84] hover:text-[#0F172A] rounded-lg transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
