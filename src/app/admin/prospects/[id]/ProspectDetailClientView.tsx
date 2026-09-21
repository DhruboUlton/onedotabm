'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProspectRecord, ProspectStage } from '@/types/database';
import {
  updateProspectStageAction,
  updateProspectAction,
  deleteProspectAction,
} from '../actions';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Percent,
  TrendingUp,
  Building,
  Mail,
  Phone,
  Tag,
  CheckCircle2,
  Trash2,
  Save,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Loader2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProspectDetailClientViewProps {
  prospect: ProspectRecord;
}

const PIPELINE_STEPS: { stage: ProspectStage; label: string }[] = [
  { stage: 'qualified', label: 'Qualified' },
  { stage: 'discovery', label: 'Discovery' },
  { stage: 'proposal', label: 'Proposal' },
  { stage: 'negotiation', label: 'Negotiation' },
  { stage: 'decision', label: 'Decision' },
  { stage: 'won', label: 'Won Deal' },
];

export function ProspectDetailClientView({ prospect: initialProspect }: ProspectDetailClientViewProps) {
  const router = useRouter();
  const [prospect, setProspect] = useState<ProspectRecord>(initialProspect);
  const [notes, setNotes] = useState(initialProspect.notes || '');
  const [probability, setProbability] = useState(initialProspect.probability ?? 50);
  const [dealValue, setDealValue] = useState(initialProspect.estimated_deal_value);
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    initialProspect.expected_close_date || ''
  );
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.stage === prospect.stage);

  const handleStageChange = (stage: ProspectStage) => {
    startTransition(async () => {
      const res = await updateProspectStageAction(prospect.id, stage);
      if (res.success && res.data) {
        setProspect(res.data);
        showFeedback(`Deal moved to ${stage}`);
      } else {
        alert(res.error || 'Failed to update stage');
      }
    });
  };

  const handleSaveAttributes = () => {
    startTransition(async () => {
      const res = await updateProspectAction(prospect.id, {
        notes,
        probability: Number(probability),
        estimated_deal_value: Number(dealValue),
        expected_close_date: expectedCloseDate || null,
      });
      if (res.success && res.data) {
        setProspect(res.data);
        showFeedback('Deal attributes saved successfully');
      } else {
        alert(res.error || 'Failed to save deal attributes');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this prospect deal?')) return;
    startTransition(async () => {
      const res = await deleteProspectAction(prospect.id);
      if (res.success) {
        router.push('/admin/prospects');
      } else {
        alert(res.error || 'Failed to delete prospect');
      }
    });
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const weightedValue = (Number(dealValue || 0) * Number(probability || 0)) / 100;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with breadcrumb and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/prospects"
            className="p-2 rounded-lg border border-[#E5E5E2] bg-white hover:bg-[#F0F0ED] text-[#555555] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111]">{prospect.company}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase bg-[#1400FF]/10 text-[#1400FF]">
                {prospect.stage}
              </span>
            </div>
            <p className="text-xs text-[#555555] mt-0.5">
              Contact: {prospect.contact_person} • Created on{' '}
              {new Date(prospect.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAttributes}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg border border-[#E5E5E2] bg-white text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Prospect"
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

      {/* Stage Progression Stepper */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858585] mb-4">
          Pipeline Stage Stepper
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {PIPELINE_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = step.stage === prospect.stage;
            return (
              <button
                key={step.stage}
                disabled={isPending}
                onClick={() => handleStageChange(step.stage)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-[#1400FF] text-white border-[#1400FF] shadow-md ring-2 ring-[#1400FF]/20'
                    : isCompleted
                    ? 'bg-[#F0F0ED] text-[#111111] border-[#E5E5E2] hover:border-gray-400'
                    : 'bg-white text-gray-400 border-dashed border-gray-300 hover:border-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="text-[11px] font-mono mb-1 opacity-70">Stage 0{idx + 1}</div>
                <div className="text-xs font-bold leading-tight">{step.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Deal Attributes & Scope */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Deal Metrics Card */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[#111111] pb-3 border-b border-[#E5E5E2]">
              Deal Financial Attributes & Forecasting
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E5E5E2] space-y-2">
                <span className="text-xs text-gray-500 font-medium">Estimated Deal Value</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-400">{prospect.currency}</span>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(parseFloat(e.target.value) || 0)}
                    step="5000"
                    className="w-full text-lg font-bold text-[#111111] bg-transparent border-b border-gray-300 focus:border-[#1400FF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E5E5E2] space-y-2">
                <span className="text-xs text-gray-500 font-medium">Win Probability</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={probability}
                    onChange={(e) => setProbability(parseInt(e.target.value, 10) || 0)}
                    min={0}
                    max={100}
                    className="w-20 text-lg font-bold text-[#111111] bg-transparent border-b border-gray-300 focus:border-[#1400FF] focus:outline-none"
                  />
                  <span className="text-lg font-bold text-gray-400">%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E5E5E2] space-y-2">
                <span className="text-xs text-gray-500 font-medium">Weighted Forecast</span>
                <div className="text-lg font-bold text-purple-700">
                  {prospect.currency} {Math.round(weightedValue).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Probability Visual Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Probability Meter</span>
                <span className="font-semibold text-[#111111]">{probability}% confidence</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    probability >= 70
                      ? 'bg-emerald-500'
                      : probability >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${probability}%` }}
                />
              </div>
            </div>

            {/* Expected Close Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  value={expectedCloseDate}
                  onChange={(e) => setExpectedCloseDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Currency
                </label>
                <div className="px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] bg-gray-50 font-semibold text-gray-700">
                  {prospect.currency} (Bangladeshi Taka / Local Contract)
                </div>
              </div>
            </div>
          </div>

          {/* Services Scope */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111111] pb-2 border-b border-[#E5E5E2]">
              Proposed Services & Scope
            </h3>
            <div className="flex flex-wrap gap-2">
              {prospect.services && prospect.services.length > 0 ? (
                prospect.services.map((svc, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0F0ED] text-[#111111] border border-[#E5E5E2] flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#1400FF]" />
                    {svc}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No services specified yet.</span>
              )}
            </div>
          </div>

          {/* Notes & Activity Log */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1400FF]" />
                <h3 className="text-sm font-bold text-[#111111]">Deal Notes & Strategy</h3>
              </div>
              <button
                onClick={handleSaveAttributes}
                disabled={isPending}
                className="px-3 py-1.5 rounded-lg bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                <span>Save Notes</span>
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Record proposal terms, client decision committee notes, pricing discounts discussed..."
              className="w-full p-3 text-xs rounded-xl border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] leading-relaxed"
            />
          </div>
        </div>

        {/* Right 1 Col: Contact & Meta details */}
        <div className="space-y-6">
          {/* Primary Contact Card */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Primary Contact
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400">Contact Person</span>
                <div className="font-semibold text-sm text-[#111111]">{prospect.contact_person}</div>
              </div>
              <div>
                <span className="text-gray-400">Email</span>
                <div className="flex items-center gap-2 font-medium text-[#111111] mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#1400FF]" />
                  <a href={`mailto:${prospect.email}`} className="hover:underline">
                    {prospect.email}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Phone</span>
                <div className="flex items-center gap-2 font-medium text-[#111111] mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {prospect.phone ? (
                    <a href={`tel:${prospect.phone}`} className="hover:underline">
                      {prospect.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Account Executive</span>
                <div className="font-medium text-[#111111] mt-0.5">
                  {prospect.assigned_to_name || 'Dhrubo Duti Biswas'}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Lead Record Link */}
          {prospect.lead_id && (
            <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1400FF]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
                  Originating Lead
                </h3>
              </div>
              <p className="text-xs text-[#555555]">
                This deal was converted from an inbound lead inquiry.
              </p>
              <Link
                href={`/admin/leads/${prospect.lead_id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F0ED] hover:bg-gray-200 text-xs font-semibold text-[#111111] transition-colors"
              >
                <span>View Original Lead #360</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Quick Meta Card */}
          <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Deal Metadata
            </h3>
            <div className="divide-y divide-[#E5E5E2] text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Prospect ID</span>
                <span className="font-mono text-[10px] text-gray-700">{prospect.id.slice(0, 13)}...</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Created At</span>
                <span className="text-gray-700">
                  {new Date(prospect.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Last Modified</span>
                <span className="text-gray-700">
                  {new Date(prospect.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
