'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, KeyRound, Loader2, Mail } from 'lucide-react';
import { portalLoginAction } from './actions';

const inputCls =
  'w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-[#E5E5E2] bg-white text-[#111111] focus:outline-none focus:border-[#1400FF]';

// Two steps for the feel of it, but nothing is looked up until the second:
// telling a stranger whether an email belongs to a client would leak the client list.
export function PortalLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'credential'>('email');
  const [email, setEmail] = useState('');
  const [credential, setCredential] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 'email') {
      if (email.trim()) setStep('credential');
      return;
    }
    setLoading(true);
    setError('');
    const res = await portalLoginAction(email, credential);
    if (res.ok) {
      router.push('/workspace');
      router.refresh();
      return;
    }
    setError(res.error ?? 'Something went wrong. Please try again.');
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xs p-7">
      <div className="flex items-center gap-2 mb-6">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 'email' ? 'bg-[#1400FF] text-white' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {step === 'credential' ? <CheckCircle2 className="w-4 h-4" /> : '1'}
        </div>
        <div className={`flex-1 h-px ${step === 'credential' ? 'bg-[#1400FF]/40' : 'bg-[#E5E5E2]'}`} />
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'credential' ? 'bg-[#1400FF] text-white' : 'bg-[#F0F0ED] text-[#555555]'}`}>
          2
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {step === 'email' ? (
          <div>
            <label className="block text-[11px] font-semibold text-[#555555] uppercase tracking-wide mb-2">Your Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className={inputCls} autoFocus required />
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl text-xs text-[#555555]">
              Signing in as <span className="font-semibold text-[#111111]">{email}</span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#555555] uppercase tracking-wide mb-2">Credential</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
                <input
                  value={credential}
                  onChange={(e) => setCredential(e.target.value.toUpperCase())}
                  placeholder="PROJ-XXXXXX"
                  className={`${inputCls} font-mono tracking-wider`}
                  autoFocus
                  required
                />
              </div>
              <p className="text-xs text-[#858585] mt-1.5">Your credential was sent with your project welcome message.</p>
            </div>
          </>
        )}

        {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{error}</p>}

        <button
          type="submit"
          disabled={loading || (step === 'email' ? !email.trim() : !credential.trim())}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1400FF] text-white text-sm font-semibold rounded-xl hover:bg-[#0F00CC] disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          {step === 'email' ? 'Continue' : loading ? 'Verifying…' : 'Access Project'}
        </button>
        {step === 'credential' && (
          <button
            type="button"
            onClick={() => {
              setStep('email');
              setCredential('');
              setError('');
            }}
            className="w-full text-center text-xs text-[#858585] hover:text-[#111111] py-1"
          >
            Use a different email
          </button>
        )}
      </form>
    </div>
  );
}
