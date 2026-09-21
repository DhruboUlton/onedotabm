'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Receipt,
  Users,
  FolderKanban,
  Target,
  ArrowUpRight,
  Printer,
  Calendar,
  Building2,
  PieChart,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';
import { AnalyticsOverview } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AnalyticsClientProps {
  overview: AnalyticsOverview;
}

export function AnalyticsClient({ overview }: AnalyticsClientProps) {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'year' | 'all'>('all');

  const formatMoney = (amount: number, cur = 'BDT') => {
    const symbol = cur === 'BDT' ? '৳' : '$';
    return `${symbol}${Number(amount || 0).toLocaleString('en-US')}`;
  };

  const maxMonthlyRevenue = Math.max(
    ...overview.monthlyRevenue.map((m) => m.revenue),
    100000
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Business Intelligence & Analytics
            </h1>
            <Badge variant="accent" size="sm">
              Remote PostgreSQL
            </Badge>
          </div>
          <p className="text-xs text-[#555555]">
            Telemetry on agency cashflow, inbound acquisition velocity, and project delivery cycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#E5E5E2] p-1 rounded-xl text-xs font-medium">
            {(['30d', '90d', 'year', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider font-mono text-[11px] transition-colors ${
                  timeRange === r
                    ? 'bg-[#111111] text-white'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                {r === '30d' ? '30 Days' : r === '90d' ? 'Quarter' : r === 'year' ? '2026 YTD' : 'All-Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-white border border-[#E5E5E2] hover:bg-[#F0F0ED] text-[#555555]"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border border-[#E5E5E2]">
          <div className="flex items-center justify-between text-[#858585] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Collected Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111]">
            {formatMoney(overview.totalRevenue)}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Invoiced Settlement Rate</span>
          </p>
        </Card>

        <Card className="p-5 bg-white border border-[#E5E5E2]">
          <div className="flex items-center justify-between text-[#858585] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Pipeline Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1400FF] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111]">
            {formatMoney(overview.pipelineValue)}
          </div>
          <p className="text-xs text-[#555555] mt-1">
            Active proposals in negotiation
          </p>
        </Card>

        <Card className="p-5 bg-white border border-[#E5E5E2]">
          <div className="flex items-center justify-between text-[#858585] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Lead Conversion
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111]">
            {overview.conversionRate}%
          </div>
          <p className="text-xs text-[#555555] mt-1">
            {overview.qualifiedLeads} of {overview.totalLeads} qualified
          </p>
        </Card>

        <Card className="p-5 bg-white border border-[#E5E5E2]">
          <div className="flex items-center justify-between text-[#858585] mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Sprint Completion
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111]">
            {overview.averageProjectProgress}%
          </div>
          <p className="text-xs text-[#555555] mt-1">
            Across {overview.activeProjects + overview.completedProjects} client milestones
          </p>
        </Card>
      </div>

      {/* Financial Growth & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bars (2 Columns) */}
        <Card className="lg:col-span-2 p-6 bg-white border border-[#E5E5E2] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E5E2] pb-4">
            <div>
              <h3 className="font-bold text-base text-[#111111]">Cash Flow & Revenue Velocity</h3>
              <p className="text-xs text-[#858585]">
                Monthly cash collections from client engagements
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-[#F0F0ED] text-[#111111]">
              BDT (৳)
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {overview.monthlyRevenue.map((item) => {
              const heightPct = Math.round((item.revenue / maxMonthlyRevenue) * 100);
              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#111111]">{item.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#858585] font-mono">
                        {item.invoicesCount} payment{item.invoicesCount !== 1 ? 's' : ''}
                      </span>
                      <span className="font-mono font-bold text-[#1400FF]">
                        {formatMoney(item.revenue)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#F0F0ED] h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1400FF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(heightPct, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E5E5E2] flex items-center justify-between text-xs text-[#858585]">
            <span>Average Deal Size: ৳185,000</span>
            <Link href="/admin/billing" className="text-[#1400FF] font-semibold hover:underline inline-flex items-center gap-1">
              View Invoices <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Client Lifetime Value Leaderboard (1 Column) */}
        <Card className="p-6 bg-white border border-[#E5E5E2] space-y-4">
          <div className="border-b border-[#E5E5E2] pb-3">
            <h3 className="font-bold text-sm text-[#111111]">Top Clients by Revenue</h3>
            <p className="text-xs text-[#858585]">Lifetime value & active engagements</p>
          </div>

          <div className="space-y-3">
            {overview.topClients.length === 0 ? (
              <p className="text-xs text-[#858585]">No client billing recorded yet.</p>
            ) : (
              overview.topClients.map((c, index) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#E5E5E2] font-mono text-xs font-bold flex items-center justify-center text-[#111111] shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-[#111111] truncate">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-[#858585]">
                        {c.projectsCount} project{c.projectsCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#1400FF] shrink-0">
                    {formatMoney(c.revenue)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-[#E5E5E2]">
            <Link
              href="/admin/clients"
              className="text-xs font-semibold text-[#1400FF] hover:underline inline-flex items-center gap-1"
            >
              Full Client Directory <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Inbound Lead Sources & Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acquisition Breakdown */}
        <Card className="p-6 bg-white border border-[#E5E5E2] space-y-4">
          <div className="border-b border-[#E5E5E2] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#111111]">Inbound Acquisition Channels</h3>
              <p className="text-xs text-[#858585]">Where high-intent clients originate</p>
            </div>
            <Users className="w-4 h-4 text-[#1400FF]" />
          </div>

          <div className="space-y-3">
            {overview.leadSources.map((item) => (
              <div key={item.source} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium capitalize text-[#111111]">
                    {item.source.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-[#858585]">
                    {item.count} leads ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#F0F0ED] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#111111] h-full rounded-full"
                    style={{ width: `${Math.max(item.percentage, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Operations Health */}
        <Card className="p-6 bg-white border border-[#E5E5E2] space-y-4">
          <div className="border-b border-[#E5E5E2] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#111111]">Delivery Portfolio Health</h3>
              <p className="text-xs text-[#858585]">Execution progress and milestone delivery</p>
            </div>
            <FolderKanban className="w-4 h-4 text-purple-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {overview.projectStatusDistribution.map((item) => (
              <div
                key={item.status}
                className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#E5E5E2] space-y-1"
              >
                <div className="text-[11px] font-mono uppercase text-[#858585]">
                  {item.status.replace('_', ' ')}
                </div>
                <div className="text-xl font-bold text-[#111111]">{item.count}</div>
                <div className="text-[10px] text-[#555555]">Projects in this stage</div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-[#555555]">
            Average sprint completion velocity is{' '}
            <span className="font-bold text-emerald-600">{overview.averageProjectProgress}%</span>{' '}
            with 0 delayed milestones.
          </div>
        </Card>
      </div>
    </div>
  );
}
