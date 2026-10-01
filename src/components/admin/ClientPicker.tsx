'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { BillingClientOption } from '@/lib/services/invoiceService';

const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-[#E5E5E2] bg-white text-[#111111] focus:outline-none focus:border-[#1400FF] transition-colors';
const textareaCls = `${inputCls} resize-none`;

export function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-mono font-semibold text-[#858585] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}


// ─── Client picker ──────────────────────────────────────────────────────────

export function ClientPicker({
  clients,
  clientId,
  businessId,
  company,
  address,
  onClient,
  onBusiness,
  onCompany,
  onAddress,
}: {
  clients: BillingClientOption[];
  clientId: string;
  businessId: string;
  company: string;
  address: string;
  onClient: (c: BillingClientOption | null) => void;
  onBusiness: (id: string, name: string, address: string) => void;
  onCompany: (v: string) => void;
  onAddress: (v: string) => void;
}) {
  const client = clients.find((c) => c.id === clientId) ?? null;
  const [picking, setPicking] = useState(false);
  const [search, setSearch] = useState('');

  const needle = search.trim().toLowerCase();
  const results = needle
    ? clients
        .filter((c) =>
          [c.name, c.email, c.phone ?? '', ...c.businesses.map((b) => b.name)].some((v) => v.toLowerCase().includes(needle))
        )
        .slice(0, 8)
    : [];

  if (picking || !client) {
    return (
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name or email…"
          className={inputCls}
          autoFocus={!client}
        />
        {results.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E2] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {results.map((c) => (
              <button
                key={c.id}
                type="button"
                onMouseDown={() => {
                  onClient(c);
                  setSearch('');
                  setPicking(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-[#EEF2FF] border-b border-[#E5E5E2] last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111111]">{c.name}</p>
                    <p className="text-xs text-[#858585] truncate">
                      {c.email}
                      {c.phone ? ` · ${c.phone}` : ''}
                    </p>
                  </div>
                  {c.businesses.length > 0 && (
                    <span className="text-[10px] text-[#555555] bg-[#F0F0ED] px-2 py-0.5 rounded-full shrink-0">
                      {c.businesses.length}B
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
        <p className="text-[11px] text-[#858585] mt-2">
          {!needle ? 'Type to search from client list' : results.length === 0 ? 'No clients found' : ''}
        </p>
        {client && (
          <button type="button" onClick={() => setPicking(false)} className="mt-1 text-xs text-[#555555] hover:text-[#1400FF]">
            ← Cancel
          </button>
        )}
      </div>
    );
  }

  const bizSelected = !!businessId;
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-[#F7F7F5] border border-[#E5E5E2] rounded-lg">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111111]">{client.name}</p>
          <p className="text-xs text-[#555555]">{client.email}</p>
          {client.phone && <p className="text-xs text-[#858585]">{client.phone}</p>}
        </div>
        <button
          type="button"
          onClick={() => {
            setPicking(true);
            setSearch('');
          }}
          className="text-xs font-medium text-[#1400FF] px-2 py-1 rounded-lg hover:bg-[#EEF2FF]"
        >
          Change
        </button>
        <button
          type="button"
          onClick={() => onClient(null)}
          title="Clear"
          className="p-1 text-[#858585] hover:text-rose-600 rounded-lg hover:bg-rose-50"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {client.businesses.length > 0 && (
        <Field label="Business">
          <select
            value={businessId}
            onChange={(e) => {
              const b = client.businesses.find((x) => x.id === e.target.value);
              onBusiness(b?.id ?? '', b?.name ?? '', b?.address ?? '');
            }}
            className={inputCls}
          >
            <option value="">No specific business</option>
            {client.businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Company">
        <input
          value={company}
          onChange={(e) => onCompany(e.target.value)}
          readOnly={bizSelected}
          className={`${inputCls} ${bizSelected ? 'opacity-60' : ''}`}
          placeholder="Company name"
        />
      </Field>
      <Field label="Address">
        <textarea
          value={address}
          onChange={(e) => onAddress(e.target.value)}
          readOnly={bizSelected}
          rows={2}
          className={`${textareaCls} ${bizSelected ? 'opacity-60' : ''}`}
          placeholder="Street, City, Country"
        />
      </Field>
    </div>
  );
}

