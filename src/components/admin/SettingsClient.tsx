'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Building2,
  DollarSign,
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { CompanySettingsRecord } from '@/types/database';
import { updateCompanySettingsAction } from '@/lib/actions/adminActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SettingsClientProps {
  initialSettings: CompanySettingsRecord;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<CompanySettingsRecord>(initialSettings);
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSavedSuccess(false);
    setErrorMsg(null);

    const res = await updateCompanySettingsAction(settings);

    setSubmitting(false);

    if (res.success && res.data) {
      setSettings(res.data);
      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 4000);
    } else {
      setErrorMsg(res.error || 'Failed to update settings');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
              Company & Agency Settings
            </h1>
            <Badge variant="accent" size="sm">
              Core Config
            </Badge>
          </div>
          <p className="text-xs text-[#555555]">
            Global configuration for OneDot ABM quotations, invoices, tax rules, and email alerts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">Company settings saved and applied successfully.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Business Profile */}
        <Card className="p-6 bg-white border border-[#E5E5E2] space-y-4">
          <div className="border-b border-[#E5E5E2] pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1400FF]" />
            <h3 className="font-bold text-sm text-[#111111]">Business Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111]">Agency Brand Name</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111]">Website URL</label>
              <input
                type="url"
                value={settings.website || ''}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#111111]">Tagline / Proposition</label>
            <input
              type="text"
              value={settings.tagline || ''}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
            />
          </div>
        </Card>

        {/* 2. Contact Details */}
        <Card className="p-6 bg-white border border-[#E5E5E2] space-y-4">
          <div className="border-b border-[#E5E5E2] pb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#1400FF]" />
            <h3 className="font-bold text-sm text-[#111111]">Contact & Invoicing Address</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111]">Official Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111]">Official Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#111111]">Headquarters Address</label>
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
            />
          </div>
        </Card>

        {/* 3. Financial & Billing Preferences */}
        <Card className="p-6 bg-white border border-[#E5E5E2] space-y-4">
          <div className="border-b border-[#E5E5E2] pb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#1400FF]" />
            <h3 className="font-bold text-sm text-[#111111]">Financial Defaults & Prefixes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111]">Default Currency</label>
              <select
                value={settings.default_currency}
                onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
              >
                <option value="BDT">BDT (৳) — Bangladesh Taka</option>
                <option value="USD">USD ($) — US Dollar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111]">Default Tax / VAT (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.tax_rate}
                onChange={(e) =>
                  setSettings({ ...settings, tax_rate: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs font-mono bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111]">Invoice Prefix</label>
              <input
                type="text"
                value={settings.invoice_prefix}
                onChange={(e) => setSettings({ ...settings, invoice_prefix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs font-mono bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111]">Quotation Prefix</label>
              <input
                type="text"
                value={settings.quotation_prefix}
                onChange={(e) => setSettings({ ...settings, quotation_prefix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs font-mono bg-white"
              />
            </div>
          </div>
        </Card>

        {/* 4. Notification Preferences */}
        <Card className="p-6 bg-white border border-[#E5E5E2] space-y-4">
          <div className="border-b border-[#E5E5E2] pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#1400FF]" />
            <h3 className="font-bold text-sm text-[#111111]">Dispatch & Alert Preferences</h3>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#111111]">
              Administrative Alerts Email
            </label>
            <input
              type="email"
              value={settings.notify_email || ''}
              onChange={(e) => setSettings({ ...settings, notify_email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs bg-white"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_lead}
                onChange={(e) => setSettings({ ...settings, notify_on_lead: e.target.checked })}
                className="rounded border-[#E5E5E2] text-[#1400FF] focus:ring-[#1400FF]"
              />
              <span className="text-xs text-[#111111]">
                Send instant notification when a new inquiry or lead submits the project form
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_invoice}
                onChange={(e) =>
                  setSettings({ ...settings, notify_on_invoice: e.target.checked })
                }
                className="rounded border-[#E5E5E2] text-[#1400FF] focus:ring-[#1400FF]"
              />
              <span className="text-xs text-[#111111]">
                Send email receipt when an invoice is issued or updated
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_payment}
                onChange={(e) =>
                  setSettings({ ...settings, notify_on_payment: e.target.checked })
                }
                className="rounded border-[#E5E5E2] text-[#1400FF] focus:ring-[#1400FF]"
              />
              <span className="text-xs text-[#111111]">
                Send real-time alert upon receiving verified payment settlement
              </span>
            </label>
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white text-xs font-semibold shadow-[0_2px_12px_rgba(20,0,255,0.25)] transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
