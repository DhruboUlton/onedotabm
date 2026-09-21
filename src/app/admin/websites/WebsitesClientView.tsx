'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Plus,
  Search,
  ExternalLink,
  Server,
  Calendar,
  Building2,
  Trash2,
  AlertCircle,
  X,
  Code2,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';
import { WebsiteRecord, WebsiteStatus } from '@/types/database';
import { ClientOption, ProjectOption } from '@/lib/services/operationsService';
import { createWebsiteAction, deleteWebsiteAction } from './actions';

interface WebsitesClientViewProps {
  initialWebsites: WebsiteRecord[];
  clients: ClientOption[];
  projects: ProjectOption[];
}

export function WebsitesClientView({
  initialWebsites,
  clients,
  projects,
}: WebsitesClientViewProps) {
  const router = useRouter();
  const [websites, setWebsites] = useState<WebsiteRecord[]>(initialWebsites);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    website_name: '',
    client_id: clients[0]?.id || '',
    project_id: '',
    domain: '',
    technology: 'Next.js',
    website_type: 'Business Website',
    status: 'live' as WebsiteStatus,
    launch_date: new Date().toISOString().split('T')[0],
    hosting: 'AWS / Vercel',
    maintenance_plan: 'Standard Maintenance',
    renewal_date: '',
    repository_url: '',
    deployment_url: '',
    notes: '',
  });

  // Filtered Websites
  const filteredWebsites = websites.filter((w) => {
    const matchesSearch =
      !searchQuery ||
      w.website_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.client_name && w.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.hosting && w.hosting.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalWebsites = websites.length;
  const liveCount = websites.filter((w) => w.status === 'live').length;
  const stagingCount = websites.filter((w) => w.status === 'staging').length;
  const maintenanceCount = websites.filter((w) => w.status === 'maintenance').length;

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.website_name.trim() || !formData.client_id || !formData.domain.trim()) {
      setErrorMessage('Website Name, Client, and Domain are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await createWebsiteAction({
      website_name: formData.website_name,
      client_id: formData.client_id,
      project_id: formData.project_id || null,
      domain: formData.domain.replace(/^https?:\/\//, ''),
      technology: formData.technology,
      website_type: formData.website_type,
      status: formData.status,
      launch_date: formData.launch_date || null,
      hosting: formData.hosting || null,
      maintenance_plan: formData.maintenance_plan || null,
      renewal_date: formData.renewal_date || null,
      repository_url: formData.repository_url || null,
      deployment_url: formData.deployment_url || null,
      notes: formData.notes || null,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      const selectedClient = clients.find((c) => c.id === formData.client_id);
      const newSite = {
        ...res.data,
        client_name: selectedClient?.company_name || 'Client',
      };
      setWebsites([newSite, ...websites]);
      setIsModalOpen(false);
      setFormData({
        website_name: '',
        client_id: clients[0]?.id || '',
        project_id: '',
        domain: '',
        technology: 'Next.js',
        website_type: 'Business Website',
        status: 'live',
        launch_date: new Date().toISOString().split('T')[0],
        hosting: 'AWS / Vercel',
        maintenance_plan: 'Standard Maintenance',
        renewal_date: '',
        repository_url: '',
        deployment_url: '',
        notes: '',
      });
      router.refresh();
    } else {
      setErrorMessage(res.error || 'Failed to register website');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the registry?`)) {
      return;
    }

    const res = await deleteWebsiteAction(id);
    if (res.success) {
      setWebsites(websites.filter((w) => w.id !== id));
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete website');
    }
  };

  const getStatusBadge = (status: WebsiteStatus) => {
    switch (status) {
      case 'live':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'staging':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'development':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'maintenance':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'planning':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Website Registry</h1>
          <p className="text-sm text-[#858585] mt-1">
            Track web infrastructure, technologies, hosting renewals, and live deployment statuses.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register Website</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Total Managed
            </span>
            <Globe className="w-4 h-4 text-[#858585]" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{totalWebsites}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Live Deployments
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{liveCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Staging / Testing
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{stagingCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Under Maintenance
            </span>
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{maintenanceCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-xl border border-[#E5E5E2] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, domain, client, stack, hosting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'live', 'staging', 'development', 'maintenance'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F0F0ED] text-[#666666] hover:bg-[#E5E5E2] hover:text-[#111111]'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Websites Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F7F5] border-b border-[#E5E5E2] text-[11px] font-mono uppercase text-[#858585] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Website & Domain</th>
                <th className="px-6 py-3.5">Client</th>
                <th className="px-6 py-3.5">Technology Stack</th>
                <th className="px-6 py-3.5">Hosting Provider</th>
                <th className="px-6 py-3.5">Renewal Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {filteredWebsites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#858585]">
                    No websites found in the registry.
                  </td>
                </tr>
              ) : (
                filteredWebsites.map((site) => {
                  return (
                    <tr key={site.id} className="hover:bg-[#F9F9F8] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/websites/${site.id}`}
                            className="font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
                          >
                            {site.website_name}
                          </Link>
                          <a
                            href={`https://${site.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#1400FF] hover:underline font-mono mt-0.5"
                          >
                            <span>{site.domain}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#555555]">
                          <Building2 className="w-3.5 h-3.5 text-[#858585]" />
                          <span>{site.client_name || 'Client'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-[#858585]" />
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F0F0ED] text-xs font-mono font-medium text-[#333333]">
                            {site.technology}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#555555]">
                          <Server className="w-3.5 h-3.5 text-[#858585]" />
                          <span>{site.hosting || 'Unspecified'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[#555555]">
                          <Calendar className="w-3.5 h-3.5 text-[#858585]" />
                          <span>{site.renewal_date || 'No renewal date'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                            site.status
                          )}`}
                        >
                          {site.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/websites/${site.id}`}
                            className="p-1.5 text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                            title="Manage Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(site.id, site.website_name)}
                            className="p-1.5 text-[#858585] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Website"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Website Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Register New Website</h3>
                <p className="text-xs text-[#858585]">
                  Add a client website to the central operational registry.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWebsite} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Website Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kanzie Official Store"
                    value={formData.website_name}
                    onChange={(e) => setFormData({ ...formData, website_name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Domain *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. kanzie.shop"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Client *
                  </label>
                  <select
                    required
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Associated Project (Optional)
                  </label>
                  <select
                    value={formData.project_id}
                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    <option value="">None / Standalone</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Technology Stack *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js + PostgreSQL"
                    value={formData.technology}
                    onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Website Type
                  </label>
                  <select
                    value={formData.website_type}
                    onChange={(e) => setFormData({ ...formData, website_type: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    <option value="Business Website">Business Website</option>
                    <option value="E-commerce Platform">E-commerce Platform</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Landing Page">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Deployment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as WebsiteStatus })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    <option value="live">Live</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="planning">Planning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Hosting</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS / Cloudflare"
                    value={formData.hosting}
                    onChange={(e) => setFormData({ ...formData, hosting: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Maintenance Plan
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Care"
                    value={formData.maintenance_plan}
                    onChange={(e) => setFormData({ ...formData, maintenance_plan: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Hosting Renewal Date
                  </label>
                  <input
                    type="date"
                    value={formData.renewal_date}
                    onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Repository URL (Git)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/org/repo"
                    value={formData.repository_url}
                    onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Deployment URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://kanzie.shop"
                    value={formData.deployment_url}
                    onChange={(e) => setFormData({ ...formData, deployment_url: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Operational Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="SSL configuration, CDN info, credentials reference..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#555555] hover:text-[#111111] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Registering...' : 'Register Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
