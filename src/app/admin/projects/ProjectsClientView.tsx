'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Plus,
  Search,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Trash2,
  X,
  Building2,
  CheckSquare,
} from 'lucide-react';
import { ProjectRecord, ProjectStatus, Priority } from '@/types/database';
import { ClientOption, ProfileOption } from '@/lib/services/operationsService';
import { createProjectAction, deleteProjectAction } from './actions';

interface ProjectsClientViewProps {
  initialProjects: ProjectRecord[];
  clients: ClientOption[];
  profiles: ProfileOption[];
}

export function ProjectsClientView({
  initialProjects,
  clients,
  profiles,
}: ProjectsClientViewProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRecord[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    project_name: '',
    client_id: clients[0]?.id || '',
    service_type: 'Custom Web Application',
    budget: '',
    currency: 'BDT',
    status: 'planning' as ProjectStatus,
    priority: 'medium' as Priority,
    start_date: new Date().toISOString().split('T')[0],
    deadline: '',
    description: '',
    notes: '',
  });

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client_name && p.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.service_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalProjects = projects.length;
  const inProgressCount = projects.filter((p) => p.status === 'in_progress').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_name.trim() || !formData.client_id) {
      setErrorMessage('Project Name and Client are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await createProjectAction({
      project_name: formData.project_name,
      client_id: formData.client_id,
      service_type: formData.service_type,
      budget: formData.budget ? Number(formData.budget) : 0,
      currency: formData.currency,
      status: formData.status,
      priority: formData.priority,
      start_date: formData.start_date || new Date().toISOString().split('T')[0],
      deadline: formData.deadline || null,
      description: formData.description || null,
      notes: formData.notes || null,
      progress: 0,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      const selectedClient = clients.find((c) => c.id === formData.client_id);
      const newProj = {
        ...res.data,
        client_name: selectedClient?.company_name || 'Client',
        tasks_count: 0,
        completed_tasks_count: 0,
      };
      setProjects([newProj, ...projects]);
      setIsModalOpen(false);
      setFormData({
        project_name: '',
        client_id: clients[0]?.id || '',
        service_type: 'Custom Web Application',
        budget: '',
        currency: 'BDT',
        status: 'planning',
        priority: 'medium',
        start_date: new Date().toISOString().split('T')[0],
        deadline: '',
        description: '',
        notes: '',
      });
      router.refresh();
    } else {
      setErrorMessage(res.error || 'Failed to create project');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    const res = await deleteProjectAction(id);
    if (res.success) {
      setProjects(projects.filter((p) => p.id !== id));
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete project');
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'review':
      case 'revision':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'planning':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'on_hold':
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-100 text-rose-800 font-bold';
      case 'high':
        return 'bg-orange-100 text-orange-800 font-medium';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Projects & Delivery</h1>
          <p className="text-sm text-[#858585] mt-1">
            Track client delivery roadmaps, sprints, tasks, and budget execution.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Total Projects
            </span>
            <Layers className="w-4 h-4 text-[#858585]" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{totalProjects}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              In Progress
            </span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{inProgressCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2">{completedCount}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Total Pipeline Value
            </span>
            <DollarSign className="w-4 h-4 text-[#1400FF]" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2 font-mono">
            ৳{totalBudget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-xl border border-[#E5E5E2] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project name, client, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'planning', 'in_progress', 'review', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F0F0ED] text-[#666666] hover:bg-[#E5E5E2] hover:text-[#111111]'
              }`}
            >
              {st === 'all' ? 'All Status' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F7F5] border-b border-[#E5E5E2] text-[11px] font-mono uppercase text-[#858585] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Project Name</th>
                <th className="px-6 py-3.5">Client</th>
                <th className="px-6 py-3.5">Progress</th>
                <th className="px-6 py-3.5">Tasks</th>
                <th className="px-6 py-3.5">Deadline</th>
                <th className="px-6 py-3.5">Budget</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#858585]">
                    No projects found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const tasksCount = project.tasks_count || 0;
                  const completedTasksCount = project.completed_tasks_count || 0;
                  const progressVal = Number(project.progress) || 0;

                  return (
                    <tr key={project.id} className="hover:bg-[#F9F9F8] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
                          >
                            {project.project_name}
                          </Link>
                          <span className="text-xs text-[#858585] mt-0.5">
                            {project.service_type}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#555555]">
                          <Building2 className="w-3.5 h-3.5 text-[#858585]" />
                          <span>{project.client_name || 'Client'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 min-w-[140px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-medium text-[#111111]">
                              {progressVal}%
                            </span>
                          </div>
                          <div className="w-full bg-[#E5E5E2] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                progressVal === 100
                                  ? 'bg-emerald-500'
                                  : progressVal >= 50
                                  ? 'bg-[#1400FF]'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, progressVal))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[#555555]">
                          <CheckSquare className="w-3.5 h-3.5 text-[#858585]" />
                          <span>
                            {completedTasksCount} / {tasksCount}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#555555]">
                          <Calendar className="w-3.5 h-3.5 text-[#858585]" />
                          <span>{project.deadline || 'No deadline'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs font-medium text-[#111111]">
                        {project.currency} {Number(project.budget).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                            project.status
                          )}`}
                        >
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="p-1.5 text-[#555555] hover:text-[#1400FF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                            title="Open Workspace"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id, project.project_name)}
                            className="p-1.5 text-[#858585] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Project"
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

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Create New Project</h3>
                <p className="text-xs text-[#858585]">
                  Initiate a client deliverable with goals, budget, and timeline.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#858585] hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solution Point Acquisition Funnel"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
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
                    Service Type
                  </label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    <option value="Custom Web Application">Custom Web Application</option>
                    <option value="E-Commerce Platform">E-Commerce Platform</option>
                    <option value="ABM Growth Marketing">ABM Growth Marketing</option>
                    <option value="Corporate Website">Corporate Website</option>
                    <option value="Brand Identity & Design">Brand Identity & Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Budget</label>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as ProjectStatus })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Overview of project scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
