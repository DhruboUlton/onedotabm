'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LeadRecord,
  LeadStatus,
  Priority,
} from '@/types/database';
import {
  createLeadAction,
  updateLeadStatusAction,
  deleteLeadAction,
  convertLeadAction,
} from './actions';
import {
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Inbox,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  Building,
  UserCheck,
  AlertCircle,
  X,
  Loader2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface LeadsClientViewProps {
  initialLeads: LeadRecord[];
}

const STATUS_TABS: { label: string; value: LeadStatus | 'all' }[] = [
  { label: 'All Leads', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
];

export function LeadsClientView({ initialLeads }: LeadsClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = (searchParams.get('status') as LeadStatus | 'all') || 'all';
  const currentSearch = searchParams.get('search') || '';

  // Local state for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [convertModalLead, setConvertModalLead] = useState<LeadRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [formError, setFormError] = useState<string | null>(null);

  // Compute metrics
  const totalLeads = initialLeads.length;
  const newLeads = initialLeads.filter((l) => l.status === 'new').length;
  const qualifiedLeads = initialLeads.filter((l) => l.status === 'qualified').length;
  const wonLeads = initialLeads.filter((l) => l.status === 'won').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads + qualifiedLeads) / totalLeads) * 100 : 0;

  // Filter leads based on current search and status
  const filteredLeads = initialLeads.filter((lead) => {
    if (currentStatus !== 'all' && lead.status !== currentStatus) return false;
    if (currentSearch.trim() !== '') {
      const q = currentSearch.toLowerCase();
      const match =
        lead.name.toLowerCase().includes(q) ||
        (lead.company && lead.company.toLowerCase().includes(q)) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.phone && lead.phone.toLowerCase().includes(q)) ||
        (lead.service_interested && lead.service_interested.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleStatusFilter = (status: LeadStatus | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/admin/leads?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch.trim()) {
      params.set('search', localSearch.trim());
    } else {
      params.delete('search');
    }
    router.push(`/admin/leads?${params.toString()}`);
  };

  const handleQuickStatus = (id: string, newStatus: LeadStatus) => {
    startTransition(async () => {
      const res = await updateLeadStatusAction(id, newStatus);
      if (!res.success) {
        alert(res.error || 'Failed to update status');
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteLeadAction(id);
      if (res.success) {
        setDeleteConfirmId(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete lead');
      }
    });
  };

  const handleCreateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createLeadAction(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        router.refresh();
      } else {
        setFormError(res.error || 'Failed to create lead');
      }
    });
  };

  const handleConvertLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!convertModalLead) return;
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    const dealData = {
      company: (formData.get('company') as string) || convertModalLead.company || convertModalLead.name,
      contact_person: (formData.get('contact_person') as string) || convertModalLead.name,
      email: (formData.get('email') as string) || convertModalLead.email,
      phone: (formData.get('phone') as string) || convertModalLead.phone || undefined,
      estimated_deal_value: parseFloat((formData.get('estimated_deal_value') as string) || '0') || 0,
      currency: (formData.get('currency') as string) || 'BDT',
      probability: parseInt((formData.get('probability') as string) || '60', 10) || 60,
      stage: (formData.get('stage') as any) || 'qualified',
      expected_close_date: (formData.get('expected_close_date') as string) || undefined,
      notes: (formData.get('notes') as string) || `Converted from Lead ${convertModalLead.name}`,
    };

    startTransition(async () => {
      const res = await convertLeadAction(convertModalLead.id, dealData);
      if (res.success) {
        setConvertModalLead(null);
        router.push('/admin/prospects');
      } else {
        setFormError(res.error || 'Failed to convert lead');
      }
    });
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">Low</span>;
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">New Inquiry</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Contacted</span>;
      case 'qualified':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Qualified</span>;
      case 'proposal':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Proposal</span>;
      case 'negotiation':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Negotiation</span>;
      case 'won':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">Won</span>;
      case 'lost':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Lost</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">Leads Ingestion</h1>
          <p className="text-sm text-[#555555] mt-1">
            Capture, qualify, and convert marketing inquiries into revenue opportunities.
          </p>
        </div>
        <button
          onClick={() => {
            setFormError(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#1000CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">Total Leads</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{totalLeads}</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">All captured opportunities</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">New Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{newLeads}</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Awaiting first response</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">Qualified</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{qualifiedLeads}</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">High purchase intent</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">Qualification Rate</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{conversionRate.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Qualified or closed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {STATUS_TABS.map((tab) => {
            const isActive = currentStatus === tab.value;
            const count =
              tab.value === 'all'
                ? initialLeads.length
                : initialLeads.filter((l) => l.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => handleStatusFilter(tab.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#555555] hover:bg-[#F0F0ED] border border-[#E5E5E2]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search leads by name, email..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E5E5E2] bg-white text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#1400FF]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E2] text-xs font-medium text-[#111111] hover:bg-[#F0F0ED]"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E2] bg-[#FAFAF9] text-[11px] font-semibold text-[#858585] uppercase tracking-wider">
                <th className="py-3 px-4">Lead Name / Company</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Interested Service</th>
                <th className="py-3 px-4">Budget / Source</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2] text-sm">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium text-sm text-[#111111]">No leads found</p>
                    <p className="text-xs text-gray-500 mt-0.5">Try adjusting your filters or add a new lead.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F9F9F8] transition-colors group">
                    {/* Name & Company */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-semibold text-[#111111] hover:text-[#1400FF] transition-colors flex items-center gap-1.5"
                        >
                          <span>{lead.name}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1400FF]" />
                        </Link>
                        {lead.company && (
                          <span className="text-xs text-[#555555] flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-gray-400" />
                            {lead.company}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-xs text-[#555555] space-y-0.5">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <a href={`mailto:${lead.email}`} className="hover:text-[#1400FF]">
                            {lead.email}
                          </a>
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <a href={`tel:${lead.phone}`} className="hover:text-[#1400FF]">
                              {lead.phone}
                            </a>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-[#111111]">
                        {lead.service_interested || 'General Inquiry'}
                      </span>
                    </td>

                    {/* Budget & Source */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-emerald-700">{lead.budget || 'Not specified'}</span>
                        <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                          via {lead.lead_source}
                        </span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4">{getPriorityBadge(lead.priority)}</td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4">
                      <div className="relative inline-block">
                        <select
                          value={lead.status}
                          disabled={isPending}
                          onChange={(e) => handleQuickStatus(lead.id, e.target.value as LeadStatus)}
                          className="text-xs font-medium bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none"
                        >
                          <option value="new">New Inquiry</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="px-2 py-1 rounded bg-[#F0F0ED] hover:bg-gray-200 text-xs font-medium text-[#111111] transition-colors"
                          title="View 360° Profile"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => {
                            setFormError(null);
                            setConvertModalLead(lead);
                          }}
                          className="px-2 py-1 rounded bg-[#1400FF]/10 hover:bg-[#1400FF]/20 text-[#1400FF] text-xs font-medium transition-colors flex items-center gap-1"
                          title="Convert to Prospect Deal"
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span>Convert</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(lead.id)}
                          className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Create New Lead</h3>
                <p className="text-xs text-[#555555]">Record an inbound marketing inquiry or prospect lead.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Nexa Logistics Ltd."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tanvir@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+880 1712-000000"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    defaultValue="Bangladesh"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Dhaka"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Service Interested
                  </label>
                  <select
                    name="service_interested"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]"
                  >
                    <option value="Performance Marketing">Performance Marketing (Meta & Google Ads)</option>
                    <option value="Custom Web Application">Custom Web Application</option>
                    <option value="E-commerce Store">E-commerce Store / ERP</option>
                    <option value="Corporate Website">Corporate Website</option>
                    <option value="Account-Based Marketing">Account-Based Marketing (ABM)</option>
                    <option value="SEO & Growth">SEO & Growth Strategy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    placeholder="e.g. ৳150,000 - ৳250,000"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Lead Source</label>
                  <select
                    name="lead_source"
                    defaultValue="website"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]"
                  >
                    <option value="website">Website Form</option>
                    <option value="meta_ads">Meta Ads</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="referral">Referral / Network</option>
                    <option value="outbound">Outbound / Cold Reach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Priority</label>
                  <select
                    name="priority"
                    defaultValue="medium"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue="new"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="e.g. High Budget, Urgent, E-commerce"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Initial Notes / Message</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Client's core requirements, timeline expectations, background..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E5E5E2] text-xs font-medium text-[#555555] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-medium hover:bg-[#1000CC] transition-colors flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert to Prospect Modal */}
      {convertModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] w-full max-w-lg overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#1400FF]" />
                  <h3 className="text-lg font-bold text-[#111111]">Convert to Deal Pipeline</h3>
                </div>
                <p className="text-xs text-[#555555] mt-1">
                  Promote &quot;{convertModalLead.name}&quot; into an active sales prospect.
                </p>
              </div>
              <button
                onClick={() => setConvertModalLead(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertLead} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Company *</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={convertModalLead.company || convertModalLead.name}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Contact Person *</label>
                  <input
                    type="text"
                    name="contact_person"
                    defaultValue={convertModalLead.name}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={convertModalLead.email}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={convertModalLead.phone || ''}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Estimated Deal Value *
                  </label>
                  <input
                    type="number"
                    name="estimated_deal_value"
                    defaultValue={
                      parseFloat(convertModalLead.budget?.replace(/[^0-9.]/g, '') || '0') || 250000
                    }
                    step="1000"
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Currency</label>
                  <select
                    name="currency"
                    defaultValue="BDT"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Pipeline Stage</label>
                  <select
                    name="stage"
                    defaultValue="qualified"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]"
                  >
                    <option value="qualified">Qualified</option>
                    <option value="discovery">Discovery</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Probability (%)</label>
                  <input
                    type="number"
                    name="probability"
                    defaultValue={60}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  name="expected_close_date"
                  defaultValue={
                    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConvertModalLead(null)}
                  className="px-4 py-2 rounded-lg border border-[#E5E5E2] text-xs font-medium text-[#555555] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-medium hover:bg-[#1000CC] transition-colors flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Conversion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-[#E5E5E2] p-6 max-w-sm w-full shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-[#111111]">Delete Lead?</h4>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this lead? This action is permanent and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-[#E5E5E2] text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
