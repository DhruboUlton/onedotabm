'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plug2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings2,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  ExternalLink,
  Loader2,
  X,
  Lock,
} from 'lucide-react';
import { IntegrationRecord } from '@/types/database';
import {
  toggleIntegrationAction,
  updateIntegrationConfigAction,
} from '@/lib/actions/adminActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface IntegrationsClientProps {
  integrations: IntegrationRecord[];
}

interface ProviderMeta {
  category: string;
  description: string;
  fields: Array<{ key: string; label: string; placeholder: string; secret?: boolean }>;
  docsUrl: string;
}

const PROVIDER_METAS: Record<string, ProviderMeta> = {
  meta: {
    category: 'Ad Platform',
    description: 'Meta Graph API & Conversions API (CAPI) for dynamic ad tracking and lead sync.',
    fields: [
      { key: 'account_id', label: 'Ad Account ID', placeholder: 'act_88291039' },
      { key: 'pixel_id', label: 'Meta Pixel ID', placeholder: '9928172635' },
      { key: 'access_token', label: 'System User Access Token', placeholder: 'EAAOx...', secret: true },
    ],
    docsUrl: 'https://developers.facebook.com/docs/marketing-apis',
  },
  google_ads: {
    category: 'Ad Platform',
    description: 'Google Ads API for automated campaign conversion adjustments and remarketing.',
    fields: [
      { key: 'customer_id', label: 'Customer ID', placeholder: '812-491-0921' },
      { key: 'client_id', label: 'OAuth Client ID', placeholder: 'apps.googleusercontent.com' },
      { key: 'client_secret', label: 'Client Secret', placeholder: '••••••••••••', secret: true },
    ],
    docsUrl: 'https://developers.google.com/google-ads/api',
  },
  ga4: {
    category: 'Analytics',
    description: 'Google Analytics 4 Measurement Protocol for full client journey attribution.',
    fields: [
      { key: 'measurement_id', label: 'Measurement ID', placeholder: 'G-ONEDOTABM' },
      { key: 'stream_id', label: 'Stream ID', placeholder: '98237162' },
      { key: 'api_secret', label: 'Measurement Protocol API Secret', placeholder: '••••••••', secret: true },
    ],
    docsUrl: 'https://analytics.google.com',
  },
  whatsapp: {
    category: 'Messaging CRM',
    description: 'Meta WhatsApp Cloud API for instant lead routing and automated client notifications.',
    fields: [
      { key: 'phone_number', label: 'Business Phone Number', placeholder: '+880 1700-000000' },
      { key: 'phone_number_id', label: 'Phone Number ID', placeholder: '109823481239' },
      { key: 'access_token', label: 'Permanent Token', placeholder: 'EAAB...', secret: true },
    ],
    docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
  },
  bkash: {
    category: 'Payment Gateway',
    description: 'bKash Merchant Checkout API for automated instant BDT payment settlements.',
    fields: [
      { key: 'merchant_id', label: 'Merchant Identifier', placeholder: 'ONEDOT_01' },
      { key: 'app_key', label: 'bKash App Key', placeholder: '5g8p3x...' },
      { key: 'app_secret', label: 'bKash App Secret', placeholder: '••••••••••••', secret: true },
      { key: 'mode', label: 'Environment Mode (live/sandbox)', placeholder: 'live' },
    ],
    docsUrl: 'https://developer.bKash.com',
  },
  stripe: {
    category: 'Payment Gateway',
    description: 'Stripe Payment Element & Invoicing for USD international client transactions.',
    fields: [
      { key: 'publishable_key', label: 'Publishable Key', placeholder: 'pk_live_...' },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'sk_live_...', secret: true },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'whsec_...', secret: true },
    ],
    docsUrl: 'https://stripe.com/docs/api',
  },
};

export function IntegrationsClient({ integrations }: IntegrationsClientProps) {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<IntegrationRecord | null>(null);
  const [drawerConfig, setDrawerConfig] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenConfig = (integ: IntegrationRecord) => {
    setSelectedProvider(integ);
    const existing = (integ.config || {}) as Record<string, any>;
    const stringified: Record<string, string> = {};
    for (const [k, v] of Object.entries(existing)) {
      stringified[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }
    setDrawerConfig(stringified);
    setShowSecrets({});
    setSaveSuccess(false);
  };

  const handleToggle = async (integ: IntegrationRecord) => {
    setLoadingProvider(integ.provider);
    const nextStatus = integ.status === 'connected' ? 'disconnected' : 'connected';
    await toggleIntegrationAction(integ.provider, nextStatus);
    setLoadingProvider(null);
    router.refresh();
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    setSavingConfig(true);
    setSaveSuccess(false);

    // Save config and ensure status is connected if keys provided
    const res = await updateIntegrationConfigAction(selectedProvider.provider, drawerConfig);
    if (res.success && selectedProvider.status === 'disconnected') {
      await toggleIntegrationAction(selectedProvider.provider, 'connected');
    }

    setSavingConfig(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSelectedProvider(null);
        router.refresh();
      }, 700);
    }
  };

  const toggleShowSecret = (fieldKey: string) => {
    setShowSecrets((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Third-Party Marketing & API Integrations
          </h1>
          <Badge variant="accent" size="sm">
            6 Connected Channels
          </Badge>
        </div>
        <p className="text-xs text-[#555555]">
          Manage API keys, Webhook endpoints, and automated marketing pixels for OneDot ABM.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((integ) => {
          const meta = PROVIDER_METAS[integ.provider] || {
            category: 'System Integration',
            description: 'Direct programmatic connector for OneDot ABM services.',
            fields: [],
            docsUrl: '#',
          };

          const isConnected = integ.status === 'connected';
          const isLoading = loadingProvider === integ.provider;

          return (
            <Card
              key={integ.id}
              className="p-5 bg-white border border-[#E5E5E2] flex flex-col justify-between"
              hoverEffect
            >
              <div>
                {/* Header & Status Indicator */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#858585]">
                      {meta.category}
                    </span>
                    <h3 className="text-base font-bold text-[#111111] mt-0.5">{integ.name}</h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                      isConnected
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? 'bg-emerald-500' : 'bg-zinc-400'
                      }`}
                    />
                    <span>{isConnected ? 'Active' : 'Inactive'}</span>
                  </span>
                </div>

                <p className="text-xs text-[#555555] leading-relaxed mb-4">{meta.description}</p>

                {/* Config Snippet */}
                <div className="p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] space-y-1 mb-4 text-[11px] font-mono">
                  {Object.entries(integ.config || {})
                    .slice(0, 2)
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[#555555] truncate">
                        <span className="text-[#858585]">{k}:</span>
                        <span className="font-medium text-[#111111] truncate max-w-[150px]">
                          {typeof v === 'string'
                            ? v
                            : Array.isArray(v)
                            ? v.join(', ')
                            : JSON.stringify(v)}
                        </span>
                      </div>
                    ))}
                  {Object.keys(integ.config || {}).length === 0 && (
                    <span className="text-[#858585] italic">No credentials configured</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E5E5E2] flex items-center justify-between">
                <button
                  onClick={() => handleToggle(integ)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isConnected
                      ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      : 'bg-[#1400FF] hover:bg-[#1000CC] text-white shadow-xs'
                  }`}
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isConnected ? 'Disconnect' : 'Connect'}</span>
                </button>

                <button
                  onClick={() => handleOpenConfig(integ)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#E5E5E2] hover:bg-[#F0F0ED] text-xs font-medium text-[#111111] transition-colors"
                >
                  <Settings2 className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Configure</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* SAFE CONFIGURATION DRAWER / MODAL */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-2xl max-w-lg w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1400FF]/10 text-[#1400FF] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#111111]">
                    {selectedProvider.name}
                  </h3>
                  <p className="text-[11px] text-[#858585]">Safe Credential Vault</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-[#111111] hover:bg-[#F0F0ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Configuration saved and verified successfully.</span>
                </div>
              )}

              <div className="space-y-3">
                {(PROVIDER_METAS[selectedProvider.provider]?.fields || []).map((field) => {
                  const isMasked = field.secret && !showSecrets[field.key];
                  return (
                    <div key={field.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#111111]">
                        <label>{field.label}</label>
                        {field.secret && (
                          <button
                            type="button"
                            onClick={() => toggleShowSecret(field.key)}
                            className="text-[10px] text-[#858585] hover:text-[#1400FF] inline-flex items-center gap-1 font-normal"
                          >
                            {isMasked ? (
                              <>
                                <Eye className="w-3 h-3" /> Show
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" /> Mask
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={isMasked ? 'password' : 'text'}
                          placeholder={field.placeholder}
                          value={drawerConfig[field.key] || ''}
                          onChange={(e) =>
                            setDrawerConfig({ ...drawerConfig, [field.key]: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E5E2] text-xs font-mono bg-white focus:ring-1 focus:ring-[#1400FF]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] text-[11px] text-[#555555] flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Credentials are encrypted and stored in Supabase PostgreSQL schema.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setSelectedProvider(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E2] text-xs font-medium text-[#555555]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1400FF] hover:bg-[#1000CC] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {savingConfig && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Connect</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
