'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClientRecord } from '@/types/database';
import { createClientAction, deleteClientAction } from './actions';
import {
  Search,
  Plus,
  ArrowRight,
  Building2,
  Mail,
  Phone,
  Globe,
  Layers,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface ClientsClientViewProps {
  initialClients: ClientRecord[];
}

export function ClientsClientView({ initialClients }: ClientsClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter clients
  const filteredClients = initialClients.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        c.company_name.toLowerCase().includes(q) ||
        c.contact_person.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q)) ||
        (c.services && c.services.some((s) => s.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalClients = initialClients.length;
  const activeClients = initialClients.filter((c) => c.status === 'active').length;
  const totalRevenue = initialClients.reduce((acc, c) => acc + Number(c.total_revenue || 0), 0);
  const totalProjects = initialClients.reduce((acc, c) => acc + Number(c.project_count || 0), 0);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteClientAction(id);
      if (res.success) {
        setDeleteConfirmId(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete client');
      }
    });
  };

  const handleCreateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createClientAction(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        router.refresh();
      } else {
        setFormError(res.error || 'Failed to create client');
      }
    });
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
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Client Directory
          </h1>
          <p className="text-sm text-[#555555] mt-1">
            Enterprise customer accounts, historical deliverables, and lifetime billing relationships.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-xs font-semibold hover:bg-[#1000CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Total Accounts
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{totalClients}</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Managed client entities</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Active Clients
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{activeClients}</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Recurring contracts & projects</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Total Lifetime Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">
              ৳{totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Paid invoice aggregate</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Total Projects Delivered
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{totalProjects}</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Active and completed work</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by company, contact..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E5E5E2] bg-white text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#1400FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#555555]">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5E2] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#1400FF]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Retainer</option>
            <option value="on-hold">On Hold</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E2] bg-[#FAFAF9] text-[11px] font-semibold text-[#858585] uppercase tracking-wider">
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Primary Contact</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Active Services</th>
                <th className="py-3 px-4">Lifetime Revenue</th>
                <th className="py-3 px-4">Projects</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2] text-sm">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#F9F9F8] transition-colors group">
                    {/* Company */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="font-bold text-[#111111] hover:text-[#1400FF] transition-colors flex items-center gap-1.5"
                        >
                          <span>{client.company_name}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1400FF]" />
                        </Link>
                        {client.website && (
                          <a
                            href={
                              client.website.startsWith('http')
                                ? client.website
                                : `https://${client.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#858585] hover:text-[#1400FF] flex items-center gap-1 mt-0.5"
                          >
                            <Globe className="w-3 h-3" />
                            <span>{client.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-[#111111]">{client.contact_person}</span>
                        <a
                          href={`mailto:${client.email}`}
                          className="text-gray-500 hover:text-[#1400FF] mt-0.5"
                        >
                          {client.email}
                        </a>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="py-3 px-4 text-xs font-medium text-gray-700">
                      {client.industry || 'General Business'}
                    </td>

                    {/* Services */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {client.services && client.services.length > 0 ? (
                          client.services.map((svc, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] bg-[#F0F0ED] text-[#111111] font-medium"
                            >
                              {svc}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="py-3 px-4 font-bold text-[#111111]">
                      ৳{Number(client.total_revenue || 0).toLocaleString()}
                    </td>

                    {/* Project Count */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {client.project_count || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">{getStatusBadge(client.status)}</td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="px-2.5 py-1 rounded bg-[#1400FF]/10 hover:bg-[#1400FF]/20 text-[#1400FF] text-xs font-semibold transition-colors"
                        >
                          360° Profile
                        </Link>
                        <button
                          onClick={() => setDeleteConfirmId(client.id)}
                          className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Client"
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

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Add New Client Account</h3>
                <p className="text-xs text-[#555555]">Register a corporate client profile.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Company Name *</label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    placeholder="e.g. Acme Corporation"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Primary Contact *</label>
                  <input
                    type="text"
                    name="contact_person"
                    required
                    placeholder="e.g. John Doe"
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
                    required
                    placeholder="john@acme.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+880 1700-000000"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    placeholder="e.g. EdTech, Fashion, Logistics"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    placeholder="https://acme.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue="active"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white focus:outline-none focus:border-[#1400FF]"
                  >
                    <option value="active">Active Retainer</option>
                    <option value="on-hold">On Hold</option>
                    <option value="past">Past Client</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
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
                  placeholder="e.g. Meta Ads, Custom Web Applications, SEO"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Office Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Banani, Dhaka, Bangladesh"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Internal Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Strategic account notes, key stakeholders, billing preferences..."
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
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-semibold hover:bg-[#1000CC] transition-colors flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Client</span>
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
            <h4 className="font-bold text-sm text-[#111111]">Delete Client Record?</h4>
            <p className="text-xs text-gray-500">
              Are you sure? This will delete the client profile and cascade to related records.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-[#E5E5E2] text-xs text-gray-600 hover:bg-gray-100"
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
