'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Server,
  Calendar,
  Building2,
  Code2,
  GitBranch,
  Shield,
  Edit3,
  Save,
  Trash2,
  X,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { WebsiteRecord, WebsiteStatus } from '@/types/database';
import { ClientOption, ProjectOption } from '@/lib/services/operationsService';
import { updateWebsiteAction, deleteWebsiteAction } from '../actions';

interface WebsiteDetailClientViewProps {
  website: WebsiteRecord;
  clients: ClientOption[];
  projects: ProjectOption[];
}

export function WebsiteDetailClientView({
  website: initialWebsite,
  clients,
  projects,
}: WebsiteDetailClientViewProps) {
  const router = useRouter();
  const [website, setWebsite] = useState<WebsiteRecord>(initialWebsite);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    website_name: website.website_name,
    client_id: website.client_id,
    project_id: website.project_id || '',
    domain: website.domain,
    technology: website.technology,
    website_type: website.website_type,
    status: website.status,
    launch_date: website.launch_date ? website.launch_date.split('T')[0] : '',
    hosting: website.hosting || '',
    maintenance_plan: website.maintenance_plan || '',
    renewal_date: website.renewal_date ? website.renewal_date.split('T')[0] : '',
    repository_url: website.repository_url || '',
    deployment_url: website.deployment_url || '',
    notes: website.notes || '',
  });

  const handleStatusChange = async (newStatus: WebsiteStatus) => {
    const res = await updateWebsiteAction(website.id, { status: newStatus });
    if (res.success && res.data) {
      setWebsite({ ...website, status: newStatus });
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateWebsiteAction(website.id, {
      website_name: editForm.website_name,
      client_id: editForm.client_id,
      project_id: editForm.project_id || null,
      domain: editForm.domain.replace(/^https?:\/\//, ''),
      technology: editForm.technology,
      website_type: editForm.website_type,
      status: editForm.status,
      launch_date: editForm.launch_date || null,
      hosting: editForm.hosting || null,
      maintenance_plan: editForm.maintenance_plan || null,
      renewal_date: editForm.renewal_date || null,
      repository_url: editForm.repository_url || null,
      deployment_url: editForm.deployment_url || null,
      notes: editForm.notes || null,
    });

    setIsSaving(false);

    if (res.success && res.data) {
      const selectedClient = clients.find((c) => c.id === editForm.client_id);
      const selectedProj = projects.find((p) => p.id === editForm.project_id);
      setWebsite({
        ...website,
        ...res.data,
        client_name: selectedClient?.company_name || website.client_name,
        project_name: selectedProj?.project_name || website.project_name,
      });
      setIsEditing(false);
      router.refresh();
    } else {
      alert(res.error || 'Failed to update website');
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${website.website_name}" from the registry?`
      )
    ) {
      return;
    }

    const res = await deleteWebsiteAction(website.id);
    if (res.success) {
      router.push('/admin/websites');
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
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/websites"
            className="p-2 rounded-lg bg-white border border-[#E5E5E2] text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
                {website.website_name}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#858585] mt-0.5">
              <span className="flex items-center gap-1 text-[#555555]">
                <Building2 className="w-3.5 h-3.5" />
                {website.client_name || 'Client'}
              </span>
              <span>•</span>
              <a
                href={`https://${website.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1400FF] font-mono hover:underline inline-flex items-center gap-1"
              >
                {website.domain}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Quick Switch */}
          <select
            value={website.status}
            onChange={(e) => handleStatusChange(e.target.value as WebsiteStatus)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#E5E5E2] bg-white text-[#111111] focus:outline-none focus:border-[#1400FF]"
          >
            <option value="live">Live</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
            <option value="maintenance">Maintenance</option>
            <option value="planning">Planning</option>
          </select>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Specs'}</span>
          </button>

          <a
            href={`https://${website.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#1400FF] text-white hover:bg-[#0F00CC] transition-colors"
          >
            <span>Visit Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={handleDelete}
            className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Delete Website"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Form Drawer */}
      {isEditing && (
        <form
          onSubmit={handleSaveDetails}
          className="p-6 rounded-2xl bg-white border border-[#1400FF]/30 shadow-sm space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
            <h3 className="text-sm font-bold text-[#111111]">Edit Website Specifications</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[#858585] hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Website Name
              </label>
              <input
                type="text"
                required
                value={editForm.website_name}
                onChange={(e) => setEditForm({ ...editForm, website_name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Domain</label>
              <input
                type="text"
                required
                value={editForm.domain}
                onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Client</label>
              <select
                value={editForm.client_id}
                onChange={(e) => setEditForm({ ...editForm, client_id: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Technology Stack
              </label>
              <input
                type="text"
                value={editForm.technology}
                onChange={(e) => setEditForm({ ...editForm, technology: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Hosting</label>
              <input
                type="text"
                value={editForm.hosting}
                onChange={(e) => setEditForm({ ...editForm, hosting: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Renewal Date
              </label>
              <input
                type="date"
                value={editForm.renewal_date}
                onChange={(e) => setEditForm({ ...editForm, renewal_date: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Git Repository URL
              </label>
              <input
                type="url"
                value={editForm.repository_url}
                onChange={(e) => setEditForm({ ...editForm, repository_url: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Deployment / Staging URL
              </label>
              <input
                type="url"
                value={editForm.deployment_url}
                onChange={(e) => setEditForm({ ...editForm, deployment_url: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1">
              Operational Notes
            </label>
            <textarea
              rows={2}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-[#555555] hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1400FF] text-white text-xs font-medium hover:bg-[#0F00CC] disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Specifications'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid Specification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Deployment Status
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                website.status
              )}`}
            >
              {website.status}
            </span>
          </div>
          <p className="text-xs text-[#858585] mt-2">Active runtime state</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Technology Stack
            </span>
            <Code2 className="w-4 h-4 text-[#1400FF]" />
          </div>
          <p className="text-base font-bold text-[#111111] mt-2 font-mono truncate">
            {website.technology}
          </p>
          <p className="text-xs text-[#858585] mt-1">{website.website_type}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Hosting Server
            </span>
            <Server className="w-4 h-4 text-[#858585]" />
          </div>
          <p className="text-base font-bold text-[#111111] mt-2">
            {website.hosting || 'Unspecified'}
          </p>
          <p className="text-xs text-[#858585] mt-1">
            {website.maintenance_plan || 'Standard SLA'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Renewal Date
            </span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-base font-bold text-[#111111] mt-2 font-mono">
            {website.renewal_date ? website.renewal_date.split('T')[0] : 'N/A'}
          </p>
          <p className="text-xs text-[#858585] mt-1">Hosting / Domain expiry</p>
        </div>
      </div>

      {/* Deep Specification Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source & Deployments */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#1400FF]" />
            <span>Repository & Infrastructure</span>
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] gap-2">
              <span className="text-xs text-[#858585]">Source Control</span>
              {website.repository_url ? (
                <a
                  href={website.repository_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#1400FF] hover:underline flex items-center gap-1"
                >
                  <span className="truncate max-w-[240px]">{website.repository_url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-[#858585]">No repository link configured</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] gap-2">
              <span className="text-xs text-[#858585]">Deployment URL</span>
              {website.deployment_url ? (
                <a
                  href={website.deployment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#1400FF] hover:underline flex items-center gap-1"
                >
                  <span className="truncate max-w-[240px]">{website.deployment_url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-[#858585]">Production only</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] gap-2">
              <span className="text-xs text-[#858585]">Initial Launch Date</span>
              <span className="font-mono text-xs text-[#111111]">
                {website.launch_date ? website.launch_date.split('T')[0] : 'In Development'}
              </span>
            </div>
          </div>
        </div>

        {/* Operational Notes & Project Association */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#1400FF]" />
            <span>Operational Notes & SLAs</span>
          </h2>

          <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] text-xs text-[#555555] leading-relaxed min-h-[110px]">
            {website.notes ||
              'No special operational instructions or credential references on file for this website.'}
          </div>

          {website.project_name && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
              <div className="flex items-center gap-2 text-blue-900">
                <Layers className="w-4 h-4 text-[#1400FF]" />
                <span>Associated Delivery Project:</span>
                <span className="font-semibold">{website.project_name}</span>
              </div>
              {website.project_id && (
                <Link
                  href={`/admin/projects/${website.project_id}`}
                  className="text-[#1400FF] font-medium hover:underline flex items-center gap-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
