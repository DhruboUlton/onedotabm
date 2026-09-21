'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClientDetailRecord } from '@/lib/services/crmService';
import { ClientRecord } from '@/types/database';
import { updateClientAction, deleteClientAction } from '../actions';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Layers,
  FileText,
  CreditCard,
  MessageSquare,
  TrendingUp,
  ExternalLink,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Loader2,
  Server,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ClientDetailClientViewProps {
  client: ClientDetailRecord;
}

type TabType = 'overview' | 'projects' | 'websites' | 'quotations' | 'invoices' | 'notes';

export function ClientDetailClientView({ client: initialClient }: ClientDetailClientViewProps) {
  const router = useRouter();
  const [client, setClient] = useState<ClientDetailRecord>(initialClient);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [notes, setNotes] = useState(initialClient.notes || '');
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const totalRevenue = Number(client.total_revenue || 0);
  const totalInvoiced = client.invoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);
  const totalAmountDue = client.invoices.reduce((acc, inv) => acc + Number(inv.amount_due || 0), 0);

  const handleSaveNotes = () => {
    startTransition(async () => {
      const res = await updateClientAction(client.id, { notes });
      if (res.success && res.data) {
        setClient((prev) => ({ ...prev, notes }));
        showFeedback('Client notes saved successfully');
      } else {
        alert(res.error || 'Failed to save notes');
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditError(null);
    const formData = new FormData(e.currentTarget);
    const servicesRaw = formData.get('services') as string;

    const payload: Partial<ClientRecord> = {
      company_name: (formData.get('company_name') as string) || client.company_name,
      contact_person: (formData.get('contact_person') as string) || client.contact_person,
      email: (formData.get('email') as string) || client.email,
      phone: (formData.get('phone') as string) || undefined,
      website: (formData.get('website') as string) || undefined,
      industry: (formData.get('industry') as string) || undefined,
      address: (formData.get('address') as string) || undefined,
      status: (formData.get('status') as string) || client.status,
      services: servicesRaw ? servicesRaw.split(',').map((s) => s.trim()).filter(Boolean) : client.services,
    };

    startTransition(async () => {
      const res = await updateClientAction(client.id, payload);
      if (res.success && res.data) {
        setClient((prev) => ({ ...prev, ...res.data }));
        setIsEditModalOpen(false);
        showFeedback('Client profile updated');
      } else {
        setEditError(res.error || 'Failed to update client');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this client record? This action is irreversible.'))
      return;
    startTransition(async () => {
      const res = await deleteClientAction(client.id);
      if (res.success) {
        router.push('/admin/clients');
      } else {
        alert(res.error || 'Failed to delete client');
      }
    });
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Retainer
          </span>
        );
      case 'on-hold':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            On Hold
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            Past Client
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/clients"
            className="p-2 rounded-lg border border-[#E5E5E2] bg-white hover:bg-[#F0F0ED] text-[#555555] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111]">{client.company_name}</h1>
              {getStatusBadge(client.status)}
            </div>
            <p className="text-xs text-[#555555] mt-0.5">
              Account registered on {new Date(client.start_date || client.created_at).toLocaleDateString()}
              {client.industry ? ` • ${client.industry}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-[#E5E5E2] bg-white text-xs font-semibold text-[#111111] hover:bg-[#F0F0ED] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Account</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg border border-[#E5E5E2] bg-white text-rose-600 hover:bg-rose-50 transition-colors shadow-xs"
            title="Delete Client"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success banner */}
      {feedbackMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* High-Level Financial & Deliverable Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858585]">
            Total Paid Revenue
          </span>
          <div className="mt-2 text-xl font-bold text-[#111111]">
            ৳{totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Cleared collections</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858585]">
            Active Projects
          </span>
          <div className="mt-2 text-xl font-bold text-[#111111]">{client.projects.length}</div>
          <p className="text-[11px] text-[#555555] mt-0.5">Custom apps & campaigns</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858585]">
            Managed Websites
          </span>
          <div className="mt-2 text-xl font-bold text-[#111111]">{client.websites.length}</div>
          <p className="text-[11px] text-[#555555] mt-0.5">Live digital assets</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858585]">
            Outstanding Due
          </span>
          <div
            className={`mt-2 text-xl font-bold ${
              totalAmountDue > 0 ? 'text-amber-700' : 'text-emerald-700'
            }`}
          >
            ৳{totalAmountDue.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#555555] mt-0.5">
            {totalAmountDue > 0 ? 'Pending invoice collection' : 'All accounts settled'}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-[#E5E5E2] overflow-x-auto pb-px">
        {[
          { key: 'overview', label: 'Overview', icon: Building2, count: undefined },
          { key: 'projects', label: 'Projects', icon: Layers, count: client.projects.length },
          { key: 'websites', label: 'Websites', icon: Globe, count: client.websites.length },
          { key: 'quotations', label: 'Quotations', icon: FileText, count: client.quotations.length },
          { key: 'invoices', label: 'Invoices & Billing', icon: CreditCard, count: client.invoices.length },
          { key: 'notes', label: 'Notes & Strategy', icon: MessageSquare, count: undefined },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-[#1400FF] text-[#1400FF]'
                  : 'border-transparent text-[#555555] hover:text-[#111111] hover:border-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#1400FF]/10 text-[#1400FF]' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company & Contact Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-[#111111] pb-3 border-b border-[#E5E5E2]">
                Corporate Profile & Point of Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Primary Contact Person</span>
                  <div className="font-semibold text-sm text-[#111111] mt-0.5">
                    {client.contact_person}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Account Manager</span>
                  <div className="font-semibold text-sm text-[#111111] mt-0.5">
                    {client.account_manager_name || 'Dhrubo Duti Biswas'}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Email Address</span>
                  <div className="flex items-center gap-1.5 font-medium text-[#111111] mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-[#1400FF]" />
                    <a href={`mailto:${client.email}`} className="hover:underline">
                      {client.email}
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Phone Number</span>
                  <div className="flex items-center gap-1.5 font-medium text-[#111111] mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {client.phone ? (
                      <a href={`tel:${client.phone}`} className="hover:underline">
                        {client.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Official Website</span>
                  <div className="mt-0.5">
                    {client.website ? (
                      <a
                        href={
                          client.website.startsWith('http')
                            ? client.website
                            : `https://${client.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1400FF] font-medium hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{client.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Industry / Domain</span>
                  <div className="font-medium text-[#111111] mt-0.5">
                    {client.industry || 'General Business'}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-gray-400">Office Address</span>
                  <div className="flex items-start gap-1.5 text-gray-700 font-medium mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{client.address || 'Dhaka, Bangladesh'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscribed Services */}
            <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#111111] pb-3 border-b border-[#E5E5E2]">
                Active Services & Retainers
              </h3>
              <div className="flex flex-wrap gap-2">
                {client.services && client.services.length > 0 ? (
                  client.services.map((svc, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F0F0ED] text-[#111111] border border-[#E5E5E2] flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {svc}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No active services defined yet.</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Account Notes Preview & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
                Account Notes Preview
              </h3>
              <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] text-xs text-gray-700 leading-relaxed min-h-[120px] whitespace-pre-line">
                {client.notes || 'No strategic notes entered yet. Click on the Notes tab to add internal context.'}
              </div>
              <button
                onClick={() => setActiveTab('notes')}
                className="text-xs font-semibold text-[#1400FF] hover:underline flex items-center gap-1"
              >
                <span>Edit account notes</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
                Quick Operations Links
              </h3>
              <div className="space-y-2">
                <Link
                  href="/admin/projects"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E2] hover:bg-[#F0F0ED] text-xs font-medium text-[#111111] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#1400FF]" />
                    Projects Hub
                  </span>
                  <span className="text-gray-400">&rarr;</span>
                </Link>
                <Link
                  href="/admin/quotations"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E2] hover:bg-[#F0F0ED] text-xs font-medium text-[#111111] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    Create Quotation
                  </span>
                  <span className="text-gray-400">&rarr;</span>
                </Link>
                <Link
                  href="/admin/invoices"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E2] hover:bg-[#F0F0ED] text-xs font-medium text-[#111111] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    Billing & Invoices
                  </span>
                  <span className="text-gray-400">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111111]">
              Contract Projects ({client.projects.length})
            </h3>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-[#1400FF] hover:underline"
            >
              Go to Projects Manager &rarr;
            </Link>
          </div>

          {client.projects.length === 0 ? (
            <div className="bg-white border border-[#E5E5E2] rounded-xl p-12 text-center text-gray-500">
              <Layers className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-semibold text-sm text-[#111111]">No linked projects found</p>
              <p className="text-xs text-gray-500 mt-1">
                Create a project in the Operations Hub and assign it to this client.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.projects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#E5E5E2] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#111111]">{p.project_name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{p.service_type}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0F0ED] text-gray-700 capitalize">
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span className="font-semibold text-[#111111]">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1400FF] h-full rounded-full"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F0F0ED] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111111]">
                      {p.currency} {Number(p.budget || 0).toLocaleString()}
                    </span>
                    {p.deadline && (
                      <span className="text-gray-500">
                        Deadline: {new Date(p.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 3. WEBSITES */}
      {activeTab === 'websites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111111]">
              Live Websites & Web Applications ({client.websites.length})
            </h3>
            <Link
              href="/admin/websites"
              className="text-xs font-semibold text-[#1400FF] hover:underline"
            >
              Go to Websites Hub &rarr;
            </Link>
          </div>

          {client.websites.length === 0 ? (
            <div className="bg-white border border-[#E5E5E2] rounded-xl p-12 text-center text-gray-500">
              <Globe className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-semibold text-sm text-[#111111]">No websites logged</p>
              <p className="text-xs text-gray-500 mt-1">
                Websites registered for this client in the Websites Hub will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.websites.map((w) => (
                <div
                  key={w.id}
                  className="bg-white border border-[#E5E5E2] rounded-xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#111111]">{w.website_name}</h4>
                      <a
                        href={w.domain.startsWith('http') ? w.domain : `https://${w.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1400FF] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Globe className="w-3 h-3" />
                        <span>{w.domain}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {w.status}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs text-gray-600">
                    <div className="py-1.5 flex justify-between">
                      <span className="text-gray-400">Tech Stack</span>
                      <span className="font-medium text-[#111111]">{w.technology}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-gray-400">Type</span>
                      <span className="font-medium text-[#111111]">{w.website_type}</span>
                    </div>
                    {w.hosting && (
                      <div className="py-1.5 flex justify-between">
                        <span className="text-gray-400">Hosting</span>
                        <span className="font-medium text-[#111111]">{w.hosting}</span>
                      </div>
                    )}
                    {w.maintenance_plan && (
                      <div className="py-1.5 flex justify-between">
                        <span className="text-gray-400">SLA Plan</span>
                        <span className="font-medium text-[#111111]">{w.maintenance_plan}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 4. QUOTATIONS */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111111]">
              Commercial Proposals & Quotes ({client.quotations.length})
            </h3>
            <Link
              href="/admin/quotations"
              className="text-xs font-semibold text-[#1400FF] hover:underline"
            >
              Quotations Hub &rarr;
            </Link>
          </div>

          {client.quotations.length === 0 ? (
            <div className="bg-white border border-[#E5E5E2] rounded-xl p-12 text-center text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-semibold text-sm text-[#111111]">No quotations issued</p>
              <p className="text-xs text-gray-500 mt-1">Proposals generated will be archived here.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E5E2] rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E5E5E2] bg-[#FAFAF9] text-[11px] font-semibold text-[#858585] uppercase">
                    <th className="py-3 px-4">Quote Number</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Expiry Date</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E2]">
                  {client.quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-[#F9F9F8]">
                      <td className="py-3 px-4 font-bold text-[#111111] font-mono">
                        {q.quotation_number}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(q.issue_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(q.expiry_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#111111]">
                        {q.currency} {q.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-blue-50 text-blue-700">
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 5. INVOICES */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111111]">
              Billing History & Invoices ({client.invoices.length})
            </h3>
            <Link
              href="/admin/invoices"
              className="text-xs font-semibold text-[#1400FF] hover:underline"
            >
              Invoices Hub &rarr;
            </Link>
          </div>

          {client.invoices.length === 0 ? (
            <div className="bg-white border border-[#E5E5E2] rounded-xl p-12 text-center text-gray-500">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="font-semibold text-sm text-[#111111]">No invoices issued</p>
              <p className="text-xs text-gray-500 mt-1">Invoices logged will display here.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E5E2] rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E5E5E2] bg-[#FAFAF9] text-[11px] font-semibold text-[#858585] uppercase">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Paid</th>
                    <th className="py-3 px-4">Due</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E2]">
                  {client.invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F9F9F8]">
                      <td className="py-3 px-4 font-bold text-[#111111] font-mono">
                        {inv.invoice_number}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(inv.issue_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(inv.due_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#111111]">
                        {inv.currency} {inv.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">
                        {inv.currency} {inv.amount_paid.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-rose-700 font-semibold">
                        {inv.currency} {inv.amount_due.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 6. NOTES */}
      {activeTab === 'notes' && (
        <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#1400FF]" />
              <h3 className="text-sm font-bold text-[#111111]">Strategic Account Notes & History</h3>
            </div>
            <button
              onClick={handleSaveNotes}
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Notes</span>
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={10}
            placeholder="Record internal client insights, executive stakeholder relationships, past campaign learnings, pricing agreements..."
            className="w-full p-4 text-xs rounded-xl border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] leading-relaxed"
          />
        </div>
      )}

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Edit Client Account</h3>
                <p className="text-xs text-[#555555]">Update company parameters and contacts.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Company Name *</label>
                  <input
                    type="text"
                    name="company_name"
                    defaultValue={client.company_name}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Primary Contact *</label>
                  <input
                    type="text"
                    name="contact_person"
                    defaultValue={client.contact_person}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={client.email}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={client.phone || ''}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    defaultValue={client.industry || ''}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    defaultValue={client.website || ''}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={client.status}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white"
                  >
                    <option value="active">Active Retainer</option>
                    <option value="on-hold">On Hold</option>
                    <option value="past">Past Client</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Office Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={client.address || ''}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Active Services (comma separated)
                </label>
                <input
                  type="text"
                  name="services"
                  defaultValue={client.services?.join(', ') || ''}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E5E5E2] text-xs text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
