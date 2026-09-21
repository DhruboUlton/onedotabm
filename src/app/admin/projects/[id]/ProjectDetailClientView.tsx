'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Building2,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Milestone as MilestoneIcon,
  Edit3,
  Save,
  X,
  Flag,
} from 'lucide-react';
import {
  ProjectRecord,
  ProjectTaskRecord,
  ProjectMilestoneRecord,
  TaskStatus,
  ProjectStatus,
  Priority,
} from '@/types/database';
import { ClientOption, ProfileOption } from '@/lib/services/operationsService';
import {
  updateProjectAction,
  deleteProjectAction,
  createTaskAction,
  updateTaskStatusAction,
  deleteTaskAction,
  createMilestoneAction,
  updateMilestoneAction,
  deleteMilestoneAction,
} from '../actions';

interface ProjectDetailClientViewProps {
  project: ProjectRecord;
  clients: ClientOption[];
  profiles: ProfileOption[];
}

export function ProjectDetailClientView({
  project: initialProject,
  clients,
  profiles,
}: ProjectDetailClientViewProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectRecord>(initialProject);
  const [tasks, setTasks] = useState<ProjectTaskRecord[]>(initialProject.tasks || []);
  const [milestones, setMilestones] = useState<ProjectMilestoneRecord[]>(
    initialProject.milestones || []
  );

  // Quick Task Creation
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Quick Milestone Creation
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  // Task Filter
  const [taskFilter, setTaskFilter] = useState<'all' | TaskStatus>('all');

  // Edit Project Mode
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editForm, setEditForm] = useState({
    project_name: project.project_name,
    client_id: project.client_id,
    service_type: project.service_type,
    budget: project.budget,
    currency: project.currency,
    status: project.status,
    priority: project.priority,
    start_date: project.start_date ? project.start_date.split('T')[0] : '',
    deadline: project.deadline ? project.deadline.split('T')[0] : '',
    description: project.description || '',
    notes: project.notes || '',
  });

  // Calculate live progress %
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const liveProgress =
    totalTasks === 0 ? Number(project.progress) || 0 : Math.round((completedTasks / totalTasks) * 100);

  // Handle Project Status Change
  const handleStatusChange = async (newStatus: ProjectStatus) => {
    const res = await updateProjectAction(project.id, { status: newStatus });
    if (res.success && res.data) {
      setProject({ ...project, status: newStatus });
    }
  };

  // Handle Save Project Details
  const handleSaveProjectDetails = async () => {
    const res = await updateProjectAction(project.id, {
      project_name: editForm.project_name,
      client_id: editForm.client_id,
      service_type: editForm.service_type,
      budget: Number(editForm.budget),
      currency: editForm.currency,
      status: editForm.status,
      priority: editForm.priority,
      start_date: editForm.start_date || undefined,
      deadline: editForm.deadline || undefined,
      description: editForm.description || null,
      notes: editForm.notes || null,
    });

    if (res.success && res.data) {
      const selectedClient = clients.find((c) => c.id === editForm.client_id);
      setProject({
        ...project,
        ...res.data,
        client_name: selectedClient?.company_name || project.client_name,
      });
      setIsEditingProject(false);
      router.refresh();
    } else {
      alert(res.error || 'Failed to update project');
    }
  };

  // Task Actions
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAddingTask(true);
    const res = await createTaskAction({
      project_id: project.id,
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      due_date: newTaskDueDate || null,
      status: 'todo',
    });
    setIsAddingTask(false);

    if (res.success && res.data) {
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
    } else {
      alert(res.error || 'Failed to add task');
    }
  };

  const handleToggleTaskStatus = async (task: ProjectTaskRecord) => {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'review',
      review: 'completed',
      completed: 'todo',
    };
    const nextStatus = nextStatusMap[task.status];

    // Optimistic UI update
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));

    const res = await updateTaskStatusAction(task.id, nextStatus, project.id);
    if (!res.success) {
      // Revert if error
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
      alert(res.error || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const res = await deleteTaskAction(taskId, project.id);
    if (res.success) {
      setTasks(tasks.filter((t) => t.id !== taskId));
    } else {
      alert(res.error || 'Failed to delete task');
    }
  };

  // Milestone Actions
  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    setIsAddingMilestone(true);
    const res = await createMilestoneAction({
      project_id: project.id,
      title: newMilestoneTitle.trim(),
      due_date: newMilestoneDueDate || null,
      status: 'pending',
    });
    setIsAddingMilestone(false);

    if (res.success && res.data) {
      setMilestones([...milestones, res.data]);
      setNewMilestoneTitle('');
      setNewMilestoneDueDate('');
    } else {
      alert(res.error || 'Failed to add milestone');
    }
  };

  const handleToggleMilestone = async (milestone: ProjectMilestoneRecord) => {
    const nextStatus = milestone.status === 'achieved' ? 'pending' : 'achieved';
    setMilestones(
      milestones.map((m) => (m.id === milestone.id ? { ...m, status: nextStatus } : m))
    );

    const res = await updateMilestoneAction(
      milestone.id,
      { status: nextStatus },
      project.id
    );
    if (!res.success) {
      setMilestones(
        milestones.map((m) => (m.id === milestone.id ? { ...m, status: milestone.status } : m))
      );
      alert(res.error || 'Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    const res = await deleteMilestoneAction(id, project.id);
    if (res.success) {
      setMilestones(milestones.filter((m) => m.id !== id));
    } else {
      alert(res.error || 'Failed to delete milestone');
    }
  };

  const handleDeleteProject = async () => {
    if (
      !confirm(`Are you sure you want to delete "${project.project_name}" and all associated data?`)
    ) {
      return;
    }
    const res = await deleteProjectAction(project.id);
    if (res.success) {
      router.push('/admin/projects');
    } else {
      alert(res.error || 'Failed to delete project');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'all') return true;
    return t.status === taskFilter;
  });

  return (
    <div className="space-y-8">
      {/* Back Link & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg bg-white border border-[#E5E5E2] text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
                {project.project_name}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#858585] mt-0.5">
              <span className="flex items-center gap-1 text-[#555555]">
                <Building2 className="w-3.5 h-3.5" />
                {project.client_name || 'Client'}
              </span>
              <span>•</span>
              <span>{project.service_type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Select */}
          <select
            value={project.status}
            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#E5E5E2] bg-white text-[#111111] focus:outline-none focus:border-[#1400FF]"
          >
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="revision">In Revision</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => setIsEditingProject(!isEditingProject)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingProject ? 'Cancel Edit' : 'Edit Project'}</span>
          </button>

          <button
            onClick={handleDeleteProject}
            className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Project Drawer/Form */}
      {isEditingProject && (
        <div className="p-6 rounded-2xl bg-white border border-[#1400FF]/30 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
            <h3 className="text-sm font-bold text-[#111111]">Edit Project Specifications</h3>
            <button
              onClick={() => setIsEditingProject(false)}
              className="text-[#858585] hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={editForm.project_name}
                onChange={(e) => setEditForm({ ...editForm, project_name: e.target.value })}
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

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Service Type
              </label>
              <input
                type="text"
                value={editForm.service_type}
                onChange={(e) => setEditForm({ ...editForm, service_type: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Budget</label>
              <input
                type="number"
                value={editForm.budget}
                onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Currency</label>
              <input
                type="text"
                value={editForm.currency}
                onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Start Date</label>
              <input
                type="date"
                value={editForm.start_date}
                onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={editForm.deadline}
                onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditingProject(false)}
              className="px-3 py-1.5 text-xs text-[#555555] hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProjectDetails}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1400FF] text-white text-xs font-medium hover:bg-[#0F00CC]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Specifications</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Sprint Execution
            </span>
            <span className="font-mono text-xs font-bold text-[#1400FF]">{liveProgress}%</span>
          </div>
          <div className="w-full bg-[#E5E5E2] h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-300 ${
                liveProgress === 100
                  ? 'bg-emerald-500'
                  : liveProgress >= 50
                  ? 'bg-[#1400FF]'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, liveProgress))}%` }}
            />
          </div>
          <p className="text-xs text-[#858585] mt-2">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        {/* Budget Card */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Project Budget
            </span>
            <DollarSign className="w-4 h-4 text-[#1400FF]" />
          </div>
          <p className="text-2xl font-bold text-[#111111] mt-2 font-mono">
            {project.currency} {Number(project.budget).toLocaleString()}
          </p>
          <p className="text-xs text-[#858585] mt-1">Contract value</p>
        </div>

        {/* Start Date */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Start Date
            </span>
            <Calendar className="w-4 h-4 text-[#858585]" />
          </div>
          <p className="text-lg font-bold text-[#111111] mt-2">
            {project.start_date ? project.start_date.split('T')[0] : 'N/A'}
          </p>
          <p className="text-xs text-[#858585] mt-1">Kickoff milestone</p>
        </div>

        {/* Target Deadline */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Target Deadline
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-bold text-[#111111] mt-2">
            {project.deadline ? project.deadline.split('T')[0] : 'Open timeline'}
          </p>
          <p className="text-xs text-[#858585] mt-1">Deliverable due date</p>
        </div>
      </div>

      {/* Main Grid: Tasks Checklist (2/3) + Milestones & Notes (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Task Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E2]">
              <div>
                <h2 className="text-lg font-bold text-[#111111] tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#1400FF]" />
                  <span>Tasks & Sprint Checklist</span>
                </h2>
                <p className="text-xs text-[#858585] mt-0.5">
                  Click a task checkbox or badge to cycle its status.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#F7F7F5] p-1 rounded-lg border border-[#E5E5E2]">
                {(['all', 'todo', 'in_progress', 'review', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                      taskFilter === filter
                        ? 'bg-white text-[#111111] shadow-xs font-semibold'
                        : 'text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add Task Form */}
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="Add a new deliverable task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white transition-colors"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="px-3 py-2 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
              <button
                type="submit"
                disabled={isAddingTask || !newTaskTitle.trim()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-medium hover:bg-[#0F00CC] disabled:opacity-50 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </form>

            {/* Task List */}
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#858585] border border-dashed border-[#E5E5E2] rounded-xl">
                  No tasks matching the selected filter.
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`group p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-[#FAFAFA] border-[#E5E5E2] opacity-80'
                          : 'bg-white border-[#E5E5E2] hover:border-[#111111]/30 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleTaskStatus(task)}
                          className="shrink-0 text-[#858585] hover:text-[#1400FF] transition-colors"
                          title="Click to cycle status"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-[#858585] group-hover:text-[#111111]" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium leading-snug truncate ${
                              isDone ? 'line-through text-[#858585]' : 'text-[#111111]'
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-[#858585] line-clamp-1 mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Due Date */}
                        {task.due_date && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#858585]">
                            <Calendar className="w-3 h-3" />
                            {task.due_date}
                          </span>
                        )}

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                            task.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-700 font-bold'
                              : task.priority === 'high'
                              ? 'bg-orange-100 text-orange-700 font-medium'
                              : 'bg-gray-100 text-[#555555]'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Status Button (Cycles) */}
                        <button
                          onClick={() => handleToggleTaskStatus(task)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border capitalize transition-colors ${
                            task.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : task.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : task.status === 'review'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {task.status.replace('_', ' ')}
                        </button>

                        {/* Delete Task */}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#858585] hover:text-rose-600 rounded transition-all"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Milestones & Metadata */}
        <div className="space-y-6">
          {/* Milestones Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
              <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <MilestoneIcon className="w-4 h-4 text-[#1400FF]" />
                <span>Project Milestones</span>
              </h3>
              <span className="text-xs font-mono text-[#858585]">
                {milestones.filter((m) => m.status === 'achieved').length} / {milestones.length}
              </span>
            </div>

            {/* Add Milestone Inline */}
            <form onSubmit={handleAddMilestone} className="space-y-2">
              <input
                type="text"
                placeholder="New milestone title..."
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newMilestoneDueDate}
                  onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
                <button
                  type="submit"
                  disabled={isAddingMilestone || !newMilestoneTitle.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#1400FF] text-white text-xs font-medium hover:bg-[#0F00CC] disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </form>

            {/* Milestones List */}
            <div className="space-y-2.5 pt-2">
              {milestones.length === 0 ? (
                <p className="text-xs text-[#858585] text-center py-4">No milestones logged yet.</p>
              ) : (
                milestones.map((milestone) => {
                  const isAchieved = milestone.status === 'achieved';
                  return (
                    <div
                      key={milestone.id}
                      className={`group p-3 rounded-xl border flex items-start justify-between gap-2 transition-colors ${
                        isAchieved ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-[#E5E5E2]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleToggleMilestone(milestone)}
                          className="mt-0.5 text-xs"
                        >
                          {isAchieved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-[#858585]" />
                          )}
                        </button>
                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              isAchieved ? 'line-through text-[#858585]' : 'text-[#111111]'
                            }`}
                          >
                            {milestone.title}
                          </p>
                          {milestone.due_date && (
                            <span className="text-[10px] font-mono text-[#858585]">
                              Due: {milestone.due_date}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#858585] hover:text-rose-600 rounded transition-all"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Project Notes & Scope Overview */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#111111]">Project Scope & Notes</h3>
            <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] text-xs text-[#555555] leading-relaxed">
              {project.description ||
                project.notes ||
                'No special notes recorded for this deliverable.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
