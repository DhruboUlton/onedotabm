'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProspectRecord, ProspectStage } from '@/types/database';
import {
  createProspectAction,
  updateProspectStageAction,
  deleteProspectAction,
} from './actions';
import {
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  List,
  Target,
  DollarSign,
  Calendar,
  Building,
  Mail,
  Phone,
  Tag,
  Trash2,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  Percent,
} from 'lucide-react';

interface ProspectsClientViewProps {
  initialProspects: ProspectRecord[];
}

const PIPELINE_STAGES: { stage: ProspectStage; label: string; color: string; bgLight: string }[] = [
  { stage: 'qualified', label: 'Qualified', color: 'text-blue-700', bgLight: 'bg-blue-50 border-blue-200' },
  { stage: 'discovery', label: 'Discovery', color: 'text-cyan-700', bgLight: 'bg-cyan-50 border-cyan-200' },
  { stage: 'proposal', label: 'Proposal', color: 'text-purple-700', bgLight: 'bg-purple-50 border-purple-200' },
  { stage: 'negotiation', label: 'Negotiation', color: 'text-amber-700', bgLight: 'bg-amber-50 border-amber-200' },
  { stage: 'decision', label: 'Decision', color: 'text-orange-700', bgLight: 'bg-orange-50 border-orange-200' },
  { stage: 'won', label: 'Won', color: 'text-emerald-700', bgLight: 'bg-emerald-50 border-emerald-200' },
];

export function ProspectsClientView({ initialProspects }: ProspectsClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter prospects
  const filteredProspects = initialProspects.filter((p) => {
    if (stageFilter !== 'all' && p.stage !== stageFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        p.company.toLowerCase().includes(q) ||
        p.contact_person.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.services && p.services.some((s) => s.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });

  // Calculate Pipeline Metrics
  const totalPipelineValue = initialProspects
    .filter((p) => p.stage !== 'lost')
    .reduce((acc, curr) => acc + Number(curr.estimated_deal_value || 0), 0);

  const weightedPipelineValue = initialProspects
    .filter((p) => p.stage !== 'lost')
    .reduce((acc, curr) => {
      const val = Number(curr.estimated_deal_value || 0);
      const prob = Number(curr.probability ?? 50) / 100;
      return acc + val * prob;
    }, 0);

  const activeDealsCount = initialProspects.filter(
    (p) => p.stage !== 'lost' && p.stage !== 'won'
  ).length;

  const wonDealsCount = initialProspects.filter((p) => p.stage === 'won').length;
  const closedTotal = initialProspects.filter((p) => p.stage === 'won' || p.stage === 'lost').length;
  const winRate = closedTotal > 0 ? (wonDealsCount / closedTotal) * 100 : (wonDealsCount / (initialProspects.length || 1)) * 100;

  const handleStageChange = (id: string, newStage: ProspectStage) => {
    startTransition(async () => {
      const res = await updateProspectStageAction(id, newStage);
      if (!res.success) {
        alert(res.error || 'Failed to update stage');
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteProspectAction(id);
      if (res.success) {
        setDeleteConfirmId(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete prospect');
      }
    });
  };

  const handleCreateProspect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createProspectAction(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        router.refresh();
      } else {
        setFormError(res.error || 'Failed to create prospect');
      }
    });
  };

  const formatCurrency = (val: number, curr = 'BDT') => {
    if (curr === 'BDT') {
      return `৳${val.toLocaleString()}`;
    }
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Sales Deal Pipeline
          </h1>
          <p className="text-sm text-[#555555] mt-1">
            Track deal stages, estimated revenue values, and win probability forecasting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-[#E5E5E2] rounded-lg p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'pipeline'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#555555] hover:text-[#111111]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#555555] hover:text-[#111111]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => {
              setFormError(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-semibold hover:bg-[#1000CC] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prospect</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Total Pipeline Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">
              ৳{totalPipelineValue.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Unweighted pipeline sum</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Weighted Forecast
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">
              ৳{Math.round(weightedPipelineValue).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Probability-adjusted revenue</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Active Negotiations
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{activeDealsCount}</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">Deals currently in flight</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E5E5E2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#858585]">
              Win Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[#111111]">{winRate.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-[#555555] mt-1">{wonDealsCount} won opportunities</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prospects by company, person..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E5E5E2] bg-white text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#1400FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#555555]">Stage Filter:</label>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5E2] bg-white text-xs font-medium text-[#111111] focus:outline-none focus:border-[#1400FF]"
          >
            <option value="all">All Stages</option>
            <option value="qualified">Qualified</option>
            <option value="discovery">Discovery</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="decision">Decision</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* PIPELINE KANBAN VIEW */}
      {viewMode === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((col) => {
            const stageDeals = filteredProspects.filter((p) => p.stage === col.stage);
            const stageValue = stageDeals.reduce(
              (acc, curr) => acc + Number(curr.estimated_deal_value || 0),
              0
            );

            return (
              <div
                key={col.stage}
                className="bg-[#FBFBFA] border border-[#E5E5E2] rounded-xl p-3 flex flex-col min-w-[220px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2] mb-3">
                  <div>
                    <span className="font-bold text-xs text-[#111111] tracking-tight">
                      {col.label}
                    </span>
                    <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white border border-[#E5E5E2] text-gray-600">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">
                    ৳{(stageValue / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1">
                  {stageDeals.length === 0 ? (
                    <div className="p-4 rounded-lg border border-dashed border-gray-300 text-center text-gray-400 text-xs py-8">
                      No deals
                    </div>
                  ) : (
                    stageDeals.map((deal) => {
                      const prob = deal.probability ?? 50;
                      return (
                        <div
                          key={deal.id}
                          className="bg-white border border-[#E5E5E2] rounded-xl p-3.5 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between space-y-3"
                        >
                          <div>
                            {/* Company & Link */}
                            <div className="flex items-start justify-between gap-1">
                              <Link
                                href={`/admin/prospects/${deal.id}`}
                                className="font-bold text-xs text-[#111111] hover:text-[#1400FF] transition-colors leading-snug line-clamp-1"
                              >
                                {deal.company}
                              </Link>
                              <Link
                                href={`/admin/prospects/${deal.id}`}
                                className="p-0.5 text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>

                            {/* Contact person */}
                            <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                              <span>{deal.contact_person}</span>
                            </div>

                            {/* Services badges */}
                            {deal.services && deal.services.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {deal.services.slice(0, 2).map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded text-[9px] bg-gray-100 text-gray-600 line-clamp-1"
                                  >
                                    {s}
                                  </span>
                                ))}
                                {deal.services.length > 2 && (
                                  <span className="text-[9px] text-gray-400">
                                    +{deal.services.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Deal Value & Probability Bar */}
                          <div className="pt-2 border-t border-[#F0F0ED] space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#111111]">
                                {formatCurrency(deal.estimated_deal_value, deal.currency)}
                              </span>
                              <span className="text-[10px] font-semibold text-gray-500">
                                {prob}% prob
                              </span>
                            </div>

                            {/* Mini Probability meter */}
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  prob >= 70
                                    ? 'bg-emerald-500'
                                    : prob >= 40
                                    ? 'bg-amber-500'
                                    : 'bg-rose-400'
                                }`}
                                style={{ width: `${prob}%` }}
                              />
                            </div>

                            {/* Stage quick change dropdown */}
                            <div className="pt-1 flex items-center justify-between">
                              <select
                                value={deal.stage}
                                disabled={isPending}
                                onChange={(e) =>
                                  handleStageChange(deal.id, e.target.value as ProspectStage)
                                }
                                className="text-[10px] font-semibold text-gray-500 bg-transparent border-0 cursor-pointer p-0 focus:ring-0 focus:outline-none hover:text-[#1400FF]"
                              >
                                <option value="qualified">Qualified</option>
                                <option value="discovery">Discovery</option>
                                <option value="proposal">Proposal</option>
                                <option value="negotiation">Negotiation</option>
                                <option value="decision">Decision</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                              </select>

                              {deal.expected_close_date && (
                                <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  {new Date(deal.expected_close_date).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#E5E5E2] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5E2] bg-[#FAFAF9] text-[11px] font-semibold text-[#858585] uppercase tracking-wider">
                  <th className="py-3 px-4">Company / Contact</th>
                  <th className="py-3 px-4">Services Scope</th>
                  <th className="py-3 px-4">Deal Value</th>
                  <th className="py-3 px-4">Probability</th>
                  <th className="py-3 px-4">Weighted Value</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Expected Close</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2] text-sm">
                {filteredProspects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      No prospects match criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProspects.map((deal) => {
                    const prob = deal.probability ?? 50;
                    const weighted = (deal.estimated_deal_value * prob) / 100;
                    return (
                      <tr key={deal.id} className="hover:bg-[#F9F9F8] transition-colors">
                        <td className="py-3 px-4">
                          <Link
                            href={`/admin/prospects/${deal.id}`}
                            className="font-semibold text-[#111111] hover:text-[#1400FF] transition-colors"
                          >
                            {deal.company}
                          </Link>
                          <div className="text-xs text-gray-500">{deal.contact_person}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {deal.services?.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] bg-[#F0F0ED] text-gray-700 font-medium"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#111111]">
                          {formatCurrency(deal.estimated_deal_value, deal.currency)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{prob}%</span>
                            <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#1400FF] rounded-full"
                                style={{ width: `${prob}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-xs font-semibold text-purple-700">
                          {formatCurrency(weighted, deal.currency)}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={deal.stage}
                            disabled={isPending}
                            onChange={(e) =>
                              handleStageChange(deal.id, e.target.value as ProspectStage)
                            }
                            className="text-xs font-medium bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none capitalize"
                          >
                            <option value="qualified">Qualified</option>
                            <option value="discovery">Discovery</option>
                            <option value="proposal">Proposal</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="decision">Decision</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-xs text-gray-500">
                          {deal.expected_close_date
                            ? new Date(deal.expected_close_date).toLocaleDateString()
                            : '—'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/prospects/${deal.id}`}
                              className="px-2.5 py-1 rounded bg-[#F0F0ED] text-xs font-medium text-[#111111] hover:bg-gray-200"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => setDeleteConfirmId(deal.id)}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* Add Prospect Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E5E5E2] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#E5E5E2] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Create Sales Prospect Deal</h3>
                <p className="text-xs text-[#555555]">Add a qualified deal to your sales pipeline.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProspect} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Company *</label>
                  <input
                    type="text"
                    name="company"
                    required
                    placeholder="e.g. Apex Tech Ltd."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Contact Person *</label>
                  <input
                    type="text"
                    name="contact_person"
                    required
                    placeholder="e.g. Mahmudul Hasan"
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
                    placeholder="m.hasan@apex.io"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+880 1711-000000"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Estimated Deal Value (BDT) *
                  </label>
                  <input
                    type="number"
                    name="estimated_deal_value"
                    required
                    placeholder="350000"
                    step="1000"
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
                    <option value="decision">Decision</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Probability (%)</label>
                  <input
                    type="number"
                    name="probability"
                    defaultValue={50}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Services Scope (comma separated)
                </label>
                <input
                  type="text"
                  name="services"
                  placeholder="e.g. Custom Web App, Meta Ads, Landing Page"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Expected Close Date</label>
                <input
                  type="date"
                  name="expected_close_date"
                  defaultValue={
                    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Deal Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Initial requirements, key decision makers, budget constraints..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E5E5E2] text-xs text-[#555555] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#1400FF] text-white text-xs font-semibold hover:bg-[#1000CC] transition-colors flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Deal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-[#E5E5E2] p-6 max-w-sm w-full shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-[#111111]">Delete Prospect Deal?</h4>
            <p className="text-xs text-gray-500">
              Are you sure you want to remove this deal from the sales pipeline?
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
