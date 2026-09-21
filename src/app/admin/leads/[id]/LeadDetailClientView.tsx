'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LeadRecord, LeadStatus, Priority } from '@/types/database';
import {
  updateLeadStatusAction,
  updateLeadAction,
  deleteLeadAction,
  convertLeadAction,
} from '../actions';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  Globe,
  Building,
  Tag,
  CheckCircle2,
  TrendingUp,
  Trash2,
  Save,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';

interface LeadDetailClientViewProps {
  lead: LeadRecord;
}

const STATUS_STEPS: { status: LeadStatus; label: string }[] = [
  { status: 'new', label: 'New Lead' },
  { status: 'contacted', label: 'Contacted' },
  { status: 'qualified', label: 'Qualified' },
  { status: 'proposal', label: 'Proposal' },
  { status: 'negotiation', label: 'Negotiation' },
  { status: 'won', label: 'Won Deal' },
];

export function LeadDetailClientView({ lead: initialLead }: LeadDetailClientViewProps) {
  const router = useRouter();
  const [lead, setLead] = useState<LeadRecord>(initialLead);
  const [notes, setNotes] = useState(initialLead.notes || '');
  const [nextFollowUp, setNextFollowUp] = useState(
    initialLead.next_follow_up
      ? new Date(initialLead.next_follow_up).toISOString().slice(0, 16)
      : ''
  );
  const [isPending, startTransition] = useTransition();
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const handleStatusChange = (status: LeadStatus) => {
    startTransition(async () => {
      const res = await updateLeadStatusAction(lead.id, status);
      if (res.success && res.data) {
        setLead(res.data);
        showFeedback('Status updated successfully');
      } else {
        alert(res.error || 'Failed to update status');
      }
    });
  };

  const handleSaveNotes = () => {
    startTransition(async () => {
      const res = await updateLeadAction(lead.id, { notes });
      if (res.success && res.data) {
        setLead(res.data);
        showFeedback('Notes saved');
      } else {
        alert(res.error || 'Failed to save notes');
      }
    });
  };

  const handleSaveFollowUp = () => {
    startTransition(async () => {
      const res = await updateLeadAction(lead.id, {
        next_follow_up: nextFollowUp ? new Date(nextFollowUp).toISOString() : null,
      });
      if (res.success && res.data) {
        setLead(res.data);
        showFeedback('Follow-up scheduled');
      } else {
        alert(res.error || 'Failed to schedule follow-up');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return;
    startTransition(async () => {
      const res = await deleteLeadAction(lead.id);
      if (res.success) {
        router.push('/admin/leads');
      } else {
        alert(res.error || 'Failed to delete lead');
      }
    });
  };

  const handleConvertLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConvertError(null);
    const formData = new FormData(e.currentTarget);

    const dealData = {
      company: (formData.get('company') as string) || lead.company || lead.name,
      contact_person: (formData.get('contact_person') as string) || lead.name,
      email: (formData.get('email') as string) || lead.email,
      phone: (formData.get('phone') as string) || lead.phone || undefined,
      estimated_deal_value: parseFloat((formData.get('estimated_deal_value') as string) || '0') || 0,
      currency: (formData.get('currency') as string) || 'BDT',
      probability: parseInt((formData.get('probability') as string) || '60', 10) || 60,
      stage: (formData.get('stage') as any) || 'qualified',
      expected_close_date: (formData.get('expected_close_date') as string) || undefined,
      notes: (formData.get('notes') as string) || `Converted from Lead ${lead.name}`,
    };

    startTransition(async () => {
      const res = await convertLeadAction(lead.id, dealData);
      if (res.success) {
        router.push('/admin/prospects');
      } else {
        setConvertError(res.error || 'Failed to convert lead');
      }
    });
  };

  const showFeedback = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === lead.status);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back link & Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="p-2 rounded-lg border border-[#E5E5E2] bg-white hover:bg-[#F0F0ED] text-[#555555] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111]">{lead.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase bg-[#1400FF]/10 text-[#1400FF]">
                {lead.status}
              </span>
            </div>
            <p className="text-xs text-[#555555] mt-0.5">
              Lead captured on {new Date(lead.created_at).toLocaleDateString()}
              {lead.company ? ` • ${lead.company}` : ''}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConvertModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-semibold hover:bg-[#1000CC] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Convert to Prospect</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg border border-[#E5E5E2] bg-white text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Notification banner */}
      {saveSuccessMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 360° Status Progression Pipeline Stepper */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858585] mb-4">
          Pipeline Progression
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = step.status === lead.status;
            return (
              <button
                key={step.status}
                disabled={isPending}
                onClick={() => handleStatusChange(step.status)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-[#1400FF] text-white border-[#1400FF] shadow-md ring-2 ring-[#1400FF]/20'
                    : isCompleted
                    ? 'bg-[#F0F0ED] text-[#111111] border-[#E5E5E2] hover:border-gray-400'
                    : 'bg-white text-gray-400 border-dashed border-gray-300 hover:border-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="text-[11px] font-mono mb-1 opacity-70">Step 0{idx + 1}</div>
                <div className="text-xs font-bold leading-tight">{step.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lead Information & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details Card */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-[#111111] pb-3 border-b border-[#E5E5E2]">
              Contact & Inquiry Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400">Email</span>
                <div className="flex items-center gap-2 font-medium text-[#111111]">
                  <Mail className="w-3.5 h-3.5 text-[#1400FF]" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Phone / WhatsApp</span>
                <div className="flex items-center gap-2 font-medium text-[#111111]">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {lead.phone ? (
                    <a href={`tel:${lead.phone}`} className="hover:underline">
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Company</span>
                <div className="flex items-center gap-2 font-medium text-[#111111]">
                  <Building className="w-3.5 h-3.5 text-gray-500" />
                  <span>{lead.company || 'Individual Lead'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Website</span>
                <div className="flex items-center gap-2 font-medium text-[#111111]">
                  <Globe className="w-3.5 h-3.5 text-gray-500" />
                  {lead.website ? (
                    <a
                      href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-[#1400FF] flex items-center gap-1"
                    >
                      <span>{lead.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Target Service</span>
                <div className="font-semibold text-[#111111]">
                  {lead.service_interested || 'General Consultancy'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Estimated Budget</span>
                <div className="font-bold text-emerald-700">
                  {lead.budget || 'Open / Discussion'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Location</span>
                <div className="font-medium text-[#111111]">
                  {[lead.city, lead.country].filter(Boolean).join(', ') || 'Bangladesh'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Attribution Source</span>
                <div className="font-mono uppercase text-[11px] text-gray-600">
                  {lead.lead_source}
                </div>
              </div>
            </div>

            {/* Original Inbound Message */}
            {lead.message && (
              <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] space-y-1 mt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858585]">
                  Original Inquiry Message
                </span>
                <p className="text-xs text-[#111111] leading-relaxed whitespace-pre-line">
                  {lead.message}
                </p>
              </div>
            )}

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858585]">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs bg-[#F0F0ED] text-[#555555] border border-[#E5E5E2] flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-gray-400" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Notes Editor */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1400FF]" />
                <h3 className="text-sm font-bold text-[#111111]">Sales Notes & Communication Log</h3>
              </div>
              <button
                onClick={handleSaveNotes}
                disabled={isPending}
                className="px-3 py-1.5 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5"
              >
                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                <span>Save Notes</span>
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Record phone discussions, discovery requirements, objections, next steps..."
              className="w-full p-3 text-xs rounded-xl border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] leading-relaxed"
            />
            <p className="text-[11px] text-[#858585]">
              Notes are preserved on conversion and synced across client activity streams.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Follow-up Scheduler & Quick Actions */}
        <div className="space-y-6">
          {/* Follow-up Scheduler Card */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1400FF]" />
              <h3 className="text-sm font-bold text-[#111111]">Follow-Up Scheduler</h3>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-[#555555]">Next Follow-Up Date & Time</label>
              <input
                type="datetime-local"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
              />
            </div>

            <button
              onClick={handleSaveFollowUp}
              disabled={isPending}
              className="w-full py-2 rounded-lg bg-[#F0F0ED] hover:bg-gray-200 text-xs font-semibold text-[#111111] transition-colors flex items-center justify-center gap-1.5"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
              <span>Update Schedule</span>
            </button>

            {lead.next_follow_up && (
              <div className="p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-800 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Scheduled Reminder</span>
                </div>
                <p className="text-[11px] text-sky-700">
                  {new Date(lead.next_follow_up).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Quick Lead Attributes */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Lead Meta Details
            </h3>
            <div className="divide-y divide-[#E5E5E2] text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Lead ID</span>
                <span className="font-mono text-[10px] text-gray-700">{lead.id.slice(0, 13)}...</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500">Assigned To</span>
                <span className="font-medium text-[#111111]">
                  {lead.assigned_to_name || 'Unassigned'}
                </span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-gray-500">Priority Level</span>
                <span className="capitalize font-semibold text-[#111111]">{lead.priority}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-gray-700">
                  {new Date(lead.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Convert to Prospect Modal */}
      {isConvertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Convert to Deal Prospect</h3>
                <p className="text-xs text-gray-500">Promote into the sales pipeline.</p>
              </div>
              <button
                onClick={() => setIsConvertModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertLead} className="p-6 space-y-4">
              {convertError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {convertError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Company *</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={lead.company || lead.name}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Contact Person *</label>
                  <input
                    type="text"
                    name="contact_person"
                    defaultValue={lead.name}
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
                    defaultValue={lead.email}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={lead.phone || ''}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
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
                    defaultValue={parseFloat(lead.budget?.replace(/[^0-9.]/g, '') || '0') || 250000}
                    step="1000"
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Currency</label>
                  <select
                    name="currency"
                    defaultValue="BDT"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Stage</label>
                  <select
                    name="stage"
                    defaultValue="qualified"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-white"
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
                    defaultValue={65}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConvertModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E5E5E2] text-xs text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-semibold"
                >
                  Confirm Conversion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
